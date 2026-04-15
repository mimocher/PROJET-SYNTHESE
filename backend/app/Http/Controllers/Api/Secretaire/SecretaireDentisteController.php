<?php

namespace App\Http\Controllers\Api\Secretaire;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecretaireDentisteController extends Controller
{
    /**
     * GET /api/secretaire/dentistes
     * Liste des dentistes avec leurs horaires et congés
     */
    public function index(Request $request): JsonResponse
    {
        $dentistes = User::where('role', 'dentiste')
            ->where('is_active', true)
            ->with(['horaires' => fn($q) => $q->where('is_active', true)->orderBy('jour_semaine'), 'conges'])
            ->orderBy('name')
            ->get()
            ->map(fn($d) => [
                'id'       => $d->id,
                'name'     => $d->name,
                'email'    => $d->email,
                'horaires' => $d->horaires,
                'conges'   => $d->conges->where('date_fin', '>=', now()->toDateString())->values(),
            ]);

        return response()->json(['success' => true, 'data' => $dentistes]);
    }

    /**
     * GET /api/secretaire/dentistes/{id}/creneaux
     * Créneaux disponibles d'un dentiste pour une date donnée
     */
    public function creneaux(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'date'          => 'required|date|after_or_equal:today',
            'duree_minutes' => 'nullable|integer|min:15|max:240',
        ]);

        $dentiste = User::where('role', 'dentiste')->find($id);
        if (!$dentiste) {
            return response()->json(['success' => false, 'message' => 'Dentiste introuvable.'], 404);
        }

        $date  = \Carbon\Carbon::parse($request->date);
        $duree = $request->duree_minutes ?? 30;

        // Vérifier si le dentiste travaille ce jour (1=lundi, 7=dimanche ISO)
        $jourISO = $date->dayOfWeekIso;
        $horaire = $dentiste->horaires()
            ->where('jour_semaine', $jourISO)
            ->where('is_active', true)
            ->first();

        if (!$horaire) {
            return response()->json([
                'success' => true,
                'data'    => [],
                'message' => 'Le dentiste ne travaille pas ce jour-là.',
            ]);
        }

        // Vérifier qu'il n'est pas en congé
        $enConge = $dentiste->conges()
            ->where('date_debut', '<=', $date->toDateString())
            ->where('date_fin', '>=', $date->toDateString())
            ->exists();

        if ($enConge) {
            return response()->json([
                'success' => true,
                'data'    => [],
                'message' => 'Le dentiste est en congé ce jour-là.',
            ]);
        }

        // Récupérer les RDV existants
        $rdvsExistants = \App\Models\RendezVous::where('dentiste_id', $id)
            ->whereDate('date_heure', $date)
            ->whereNotIn('statut', ['annule', 'absent'])
            ->orderBy('date_heure')
            ->get(['date_heure', 'duree_minutes']);

        // Générer les créneaux libres (pas à pas de $duree minutes)
        $debut  = \Carbon\Carbon::parse($date->toDateString() . ' ' . $horaire->heure_debut);
        $finJour = \Carbon\Carbon::parse($date->toDateString() . ' ' . $horaire->heure_fin);
        $creneaux = [];

        while ($debut->copy()->addMinutes($duree)->lte($finJour)) {
            $finCreneau = $debut->copy()->addMinutes($duree);
            $libre = true;

            foreach ($rdvsExistants as $rdv) {
                $debutRdv = \Carbon\Carbon::parse($rdv->date_heure);
                $finRdv   = $debutRdv->copy()->addMinutes($rdv->duree_minutes);

                if ($debut->lt($finRdv) && $finCreneau->gt($debutRdv)) {
                    $libre = false;
                    break;
                }
            }

            if ($libre) {
                $creneaux[] = $debut->format('H:i');
            }

            $debut->addMinutes($duree);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'date'          => $date->toDateString(),
                'dentiste'      => ['id' => $dentiste->id, 'name' => $dentiste->name],
                'duree_minutes' => $duree,
                'creneaux'      => $creneaux,
            ],
        ]);
    }
}
