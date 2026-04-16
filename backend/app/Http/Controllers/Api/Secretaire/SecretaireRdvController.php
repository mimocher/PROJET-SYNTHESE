<?php

namespace App\Http\Controllers\Api\Secretaire;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use App\Models\Patient;
use App\Models\RendezVous;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecretaireRdvController extends Controller
{
    /**
     * GET /api/secretaire/rdv
     * RDV du jour par défaut, ou filtrés par date et statut
     */
    public function index(Request $request): JsonResponse
    {
        $date = $request->date ? Carbon::parse($request->date) : today();

        $rdvs = RendezVous::with(['patient.user', 'dentiste:id,name'])
            ->whereDate('date_heure', $date)
            ->when($request->statut, fn($q) => $q->where('statut', $request->statut))
            ->when($request->dentiste_id, fn($q) => $q->where('dentiste_id', $request->dentiste_id))
            ->orderBy('date_heure')
            ->get();

        return response()->json(['success' => true, 'data' => $rdvs]);
    }

    /**
     * GET /api/secretaire/rdv/semaine
     */
    public function semaine(Request $request): JsonResponse
    {
        $debut = $request->debut
            ? Carbon::parse($request->debut)->startOfWeek()
            : now()->startOfWeek();
        $fin = $debut->copy()->endOfWeek();

        $rdvs = RendezVous::with(['patient.user', 'dentiste:id,name'])
            ->whereBetween('date_heure', [$debut->startOfDay(), $fin->endOfDay()])
            ->when($request->dentiste_id, fn($q) => $q->where('dentiste_id', $request->dentiste_id))
            ->orderBy('date_heure')
            ->get();

        // Grouper par jour
        $grouped = $rdvs->groupBy(fn($rdv) => Carbon::parse($rdv->date_heure)->toDateString());

        return response()->json([
            'success' => true,
            'data'    => [
                'debut'   => $debut->toDateString(),
                'fin'     => $fin->toDateString(),
                'rdvs'    => $grouped,
            ],
        ]);
    }

    /**
     * GET /api/secretaire/rdv/{id}
     */
    public function show(int $id): JsonResponse
    {
        $rdv = RendezVous::with(['patient.user', 'dentiste:id,name', 'consultation'])
            ->find($id);

        if (!$rdv) {
            return response()->json(['success' => false, 'message' => 'RDV introuvable.'], 404);
        }

        return response()->json(['success' => true, 'data' => $rdv]);
    }

    /**
     * POST /api/secretaire/rdv
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id'    => 'required|exists:patients,id',
            'dentiste_id'   => 'required|exists:users,id',
            'date_heure'    => 'required|date',
            'motif'         => 'required|string|max:255',
            'duree_minutes' => 'nullable|integer|min:15|max:240',
            'is_urgence'    => 'nullable|boolean',
            'notes'         => 'nullable|string',
        ]);

        // Vérifier que l'utilisateur est bien un dentiste
        $dentiste = User::find($request->dentiste_id);
        if (!$dentiste || $dentiste->role !== 'dentiste') {
            return response()->json(['success' => false, 'message' => 'Utilisateur non valide : ce n\'est pas un dentiste.'], 422);
        }

        $debut = Carbon::parse($request->date_heure);
        $duree = $request->duree_minutes ?? 30;
        $fin   = $debut->copy()->addMinutes($duree);

        // Vérification de chevauchement basée sur la durée
        $conflit = RendezVous::where('dentiste_id', $request->dentiste_id)
            ->whereNotIn('statut', ['annule', 'absent'])
            ->where(function ($q) use ($debut, $fin) {
                $q->where(function ($q2) use ($debut, $fin) {
                    // Nouveau RDV commence pendant un RDV existant
                    $q2->where('date_heure', '<', $fin)
                       ->whereRaw("DATE_ADD(date_heure, INTERVAL duree_minutes MINUTE) > ?", [$debut]);
                });
            })
            ->exists();

        if ($conflit) {
            return response()->json(['success' => false, 'message' => 'Ce créneau est déjà occupé pour ce dentiste.'], 422);
        }

        $rdv = RendezVous::create([
            'patient_id'    => $request->patient_id,
            'dentiste_id'   => $request->dentiste_id,
            'date_heure'    => $debut,
            'duree_minutes' => $duree,
            'motif'         => $request->motif,
            'statut'        => 'confirme',
            'is_urgence'    => $request->is_urgence ?? false,
            'notes'         => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $rdv->load(['patient.user', 'dentiste:id,name']),
            'message' => 'Rendez-vous créé avec succès.',
        ], 201);
    }

    /**
     * PUT /api/secretaire/rdv/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $rdv = RendezVous::find($id);
        if (!$rdv) {
            return response()->json(['success' => false, 'message' => 'RDV introuvable.'], 404);
        }

        if (in_array($rdv->statut, ['annule', 'absent', 'termine'])) {
            return response()->json(['success' => false, 'message' => 'Impossible de modifier un RDV ' . $rdv->statut . '.'], 422);
        }

        $request->validate([
            'date_heure'    => 'sometimes|date',
            'motif'         => 'sometimes|string|max:255',
            'duree_minutes' => 'nullable|integer|min:15|max:240',
            'notes'         => 'nullable|string',
            'is_urgence'    => 'nullable|boolean',
        ]);

        // Si la date ou la durée change, vérifier les conflits
        if ($request->has('date_heure') || $request->has('duree_minutes')) {
            $debut = Carbon::parse($request->date_heure ?? $rdv->date_heure);
            $duree = $request->duree_minutes ?? $rdv->duree_minutes;
            $fin   = $debut->copy()->addMinutes($duree);

            $conflit = RendezVous::where('dentiste_id', $rdv->dentiste_id)
                ->where('id', '!=', $rdv->id)
                ->whereNotIn('statut', ['annule', 'absent'])
                ->where(function ($q) use ($debut, $fin) {
                    $q->where('date_heure', '<', $fin)
                      ->whereRaw("DATE_ADD(date_heure, INTERVAL duree_minutes MINUTE) > ?", [$debut]);
                })
                ->exists();

            if ($conflit) {
                return response()->json(['success' => false, 'message' => 'Ce créneau est déjà occupé pour ce dentiste.'], 422);
            }
        }

        $rdv->update($request->only(['date_heure', 'motif', 'duree_minutes', 'notes', 'is_urgence']));

        return response()->json([
            'success' => true,
            'data'    => $rdv->fresh()->load(['patient.user', 'dentiste:id,name']),
            'message' => 'Rendez-vous mis à jour.',
        ]);
    }

    /**
     * PATCH /api/secretaire/rdv/{id}/statut
     * Workflow : confirme → arrive → en_cours → termine / annule / absent
     */
    public function updateStatut(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'statut'           => 'required|in:confirme,arrive,en_cours,termine,annule,absent',
            'notes_annulation' => 'nullable|string|max:500',
        ]);

        $rdv = RendezVous::find($id);
        if (!$rdv) {
            return response()->json(['success' => false, 'message' => 'RDV introuvable.'], 404);
        }

        $data = ['statut' => $request->statut];

        if ($request->statut === 'annule') {
            $data['annule_par'] = 'secretaire';
            $data['annule_at']  = now();
            if ($request->notes_annulation) {
                $data['notes'] = $request->notes_annulation;
            }
        }

        $rdv->update($data);

        return response()->json([
            'success' => true,
            'data'    => $rdv->fresh()->load(['patient.user', 'dentiste:id,name']),
            'message' => "Statut mis à jour : {$request->statut}.",
        ]);
    }

    /**
     * DELETE /api/secretaire/rdv/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'notes_annulation' => 'nullable|string|max:500',
        ]);

        $rdv = RendezVous::find($id);
        if (!$rdv) {
            return response()->json(['success' => false, 'message' => 'RDV introuvable.'], 404);
        }

        if (in_array($rdv->statut, ['annule', 'absent', 'termine'])) {
            return response()->json(['success' => false, 'message' => 'Ce RDV est déjà ' . $rdv->statut . '.'], 422);
        }

        $rdv->update([
            'statut'     => 'annule',
            'annule_par' => 'secretaire',
            'annule_at'  => now(),
            'notes'      => $request->notes_annulation ?? $rdv->notes,
        ]);

        return response()->json(['success' => true, 'message' => 'RDV annulé avec succès.']);
    }

    /**
     * GET /api/secretaire/dashboard
     * Tableau de bord enrichi avec stats du jour + semaine + impayés
     */
    public function dashboard(): JsonResponse
    {
        $today      = today();
        $debutSem   = now()->startOfWeek();
        $finSem     = now()->endOfWeek();

        // RDV du jour
        $rdvsDuJour = RendezVous::with(['patient.user', 'dentiste:id,name'])
            ->whereDate('date_heure', $today)
            ->orderBy('date_heure')
            ->get();

        // RDV de la semaine (résumé)
        $rdvsSemaine = RendezVous::whereBetween('date_heure', [$debutSem->startOfDay(), $finSem->endOfDay()])
            ->whereNotIn('statut', ['annule', 'absent'])
            ->count();

        // Prochains RDV (aujourd'hui, à partir de maintenant)
        $prochains = RendezVous::with(['patient.user', 'dentiste:id,name'])
            ->whereDate('date_heure', $today)
            ->where('date_heure', '>=', now())
            ->whereIn('statut', ['confirme', 'arrive'])
            ->orderBy('date_heure')
            ->limit(5)
            ->get();

        // Impayés
        $impayes = Facture::whereIn('statut', ['en_attente', 'partiellement_paye'])->count();
        $montantImpayes = Facture::whereIn('statut', ['en_attente', 'partiellement_paye'])
            ->selectRaw('SUM(montant_total - montant_paye - montant_mutuelle) as total')
            ->value('total') ?? 0;

        // Nouveaux patients cette semaine
        $nouveauxPatients = Patient::whereHas('user', function ($q) use ($debutSem, $finSem) {
            $q->whereBetween('created_at', [$debutSem, $finSem]);
        })->count();

        return response()->json([
            'success' => true,
            'data'    => [
                // Statistiques du jour
                'aujourd_hui' => [
                    'total'     => $rdvsDuJour->count(),
                    'confirmes' => $rdvsDuJour->where('statut', 'confirme')->count(),
                    'arrives'   => $rdvsDuJour->where('statut', 'arrive')->count(),
                    'en_cours'  => $rdvsDuJour->where('statut', 'en_cours')->count(),
                    'termines'  => $rdvsDuJour->where('statut', 'termine')->count(),
                    'annules'   => $rdvsDuJour->where('statut', 'annule')->count(),
                    'absents'   => $rdvsDuJour->where('statut', 'absent')->count(),
                    'urgences'  => $rdvsDuJour->where('is_urgence', true)->count(),
                ],
                // Statistiques de la semaine
                'semaine' => [
                    'total_rdv'        => $rdvsSemaine,
                    'nouveaux_patients' => $nouveauxPatients,
                ],
                // Impayés
                'impayes' => [
                    'count'   => $impayes,
                    'montant' => round($montantImpayes, 2),
                ],
                // Listes
                'rdvs_du_jour' => $rdvsDuJour,
                'prochains_rdv' => $prochains,
            ],
        ]);
    }
}
