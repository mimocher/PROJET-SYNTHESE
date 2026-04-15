<?php

namespace App\Http\Controllers\Api\Dentiste;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\ConsultationActe;
use App\Models\Patient;
use App\Models\RendezVous;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DentisteStatController extends Controller
{
    /**
     * GET /api/dentiste/statistiques
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'periode'    => 'nullable|in:semaine,mois,trimestre,annee',
            'date_debut' => 'nullable|date',
            'date_fin'   => 'nullable|date|after_or_equal:date_debut',
        ]);

        $dentiste = $request->user();
        $periode  = $request->periode ?? 'mois';

        [$debut, $fin] = $this->getPeriode($request, $periode);

        // ── Consultations ──────────────────────────────────────────────────────
        $totalConsultations = Consultation::where('dentiste_id', $dentiste->id)
            ->whereBetween('date_consultation', [$debut, $fin])
            ->count();

        // ── Actes réalisés ─────────────────────────────────────────────────────
        $actesQuery = ConsultationActe::whereHas('consultation', fn($q) =>
            $q->where('dentiste_id', $dentiste->id)
              ->whereBetween('date_consultation', [$debut, $fin])
        )->with('catalogueActe:id,libelle,code');

        $actes = $actesQuery->get()
            ->groupBy('catalogue_acte_id')
            ->map(fn($groupe) => [
                'acte'     => $groupe->first()->catalogueActe,
                'quantite' => $groupe->sum('quantite'),
                'total'    => $groupe->sum(fn($a) => $a->quantite * $a->prix_unitaire),
            ])
            ->sortByDesc('total')
            ->values();

        $chiffreAffaires = $actes->sum('total');

        // ── Top 5 actes ────────────────────────────────────────────────────────
        $top5Actes = $actes->take(5);

        // ── RDV par statut ─────────────────────────────────────────────────────
        $rdvs = RendezVous::where('dentiste_id', $dentiste->id)
            ->whereBetween('date_heure', [$debut->startOfDay(), $fin->endOfDay()])
            ->get();

        $rdvStats = $rdvs->groupBy('statut')->map(fn($g) => $g->count());

        $totalRdv   = $rdvs->count();
        $rdvTermine = $rdvs->where('statut', 'termine')->count();
        $tauxPresence = $totalRdv > 0
            ? round(($rdvTermine / $totalRdv) * 100, 1)
            : 0;

        // ── Patients uniques consultés ─────────────────────────────────────────
        $patientsUniques = Consultation::where('dentiste_id', $dentiste->id)
            ->whereBetween('date_consultation', [$debut, $fin])
            ->join('dossiers_medicaux', 'consultations.dossier_medical_id', '=', 'dossiers_medicaux.id')
            ->distinct('dossiers_medicaux.patient_id')
            ->count('dossiers_medicaux.patient_id');

        // ── Nouveaux patients (créés dans la période) ─────────────────────────
        $nouveauxPatients = Patient::whereHas('user', fn($q) =>
            $q->whereBetween('created_at', [$debut, $fin])
        )->count();

        // ── Urgences ──────────────────────────────────────────────────────────
        $urgences = $rdvs->where('is_urgence', true)->count();

        // ── Consultations par jour (courbe) ───────────────────────────────────
        $consultationsParJour = Consultation::where('dentiste_id', $dentiste->id)
            ->whereBetween('date_consultation', [$debut, $fin])
            ->selectRaw('DATE(date_consultation) as jour, COUNT(*) as total')
            ->groupBy('jour')
            ->orderBy('jour')
            ->get();

        // ── Moyenne de consultations par jour de travail ───────────────────────
        $joursAvecConsultations = $consultationsParJour->count();
        $moyenneParJour = $joursAvecConsultations > 0
            ? round($totalConsultations / $joursAvecConsultations, 1)
            : 0;

        return response()->json([
            'success' => true,
            'data'    => [
                'periode' => [
                    'debut'  => $debut->toDateString(),
                    'fin'    => $fin->toDateString(),
                    'libelle' => $periode,
                ],
                'consultations' => [
                    'total'          => $totalConsultations,
                    'moyenne_par_jour' => $moyenneParJour,
                    'par_jour'       => $consultationsParJour,
                ],
                'chiffre_affaires' => round($chiffreAffaires, 2),
                'actes_realises'   => $actes,
                'top_5_actes'      => $top5Actes,
                'rdv' => [
                    'total'         => $totalRdv,
                    'par_statut'    => $rdvStats,
                    'taux_presence' => $tauxPresence,
                    'urgences'      => $urgences,
                ],
                'patients' => [
                    'uniques_consultes' => $patientsUniques,
                    'nouveaux'          => $nouveauxPatients,
                ],
            ],
        ]);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private function getPeriode(Request $request, string $periode): array
    {
        if ($request->date_debut && $request->date_fin) {
            return [
                Carbon::parse($request->date_debut)->startOfDay(),
                Carbon::parse($request->date_fin)->endOfDay(),
            ];
        }

        $fin   = now()->endOfDay();
        $debut = match ($periode) {
            'semaine'   => now()->startOfWeek()->startOfDay(),
            'trimestre' => now()->startOfQuarter()->startOfDay(),
            'annee'     => now()->startOfYear()->startOfDay(),
            default     => now()->startOfMonth()->startOfDay(),
        };

        return [$debut, $fin];
    }
}
