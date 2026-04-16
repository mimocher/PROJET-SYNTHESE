<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientDossierController extends Controller
{
    /**
     * GET /api/patient/dossier
     */
    public function show(Request $request): JsonResponse
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Profil patient introuvable.'], 404);
        }

        $dossier = $patient->dossierMedical()->with([
            'consultations.dentiste:id,name',
            'consultations.actes.catalogueActe',
        ])->first();

        if (!$dossier) {
            return response()->json(['success' => false, 'message' => 'Dossier médical introuvable.'], 404);
        }

        // Plans de traitement avec leurs séances
        $plans = $patient->plansTraitement()
            ->with(['seances'])
            ->orderByDesc('date_debut')
            ->get();

        // Ordonnances actives
        $ordonnances = $patient->ordonnances()
            ->with(['dentiste:id,name'])
            ->where('is_archived', false)
            ->orderByDesc('date_ordonnance')
            ->get();

        $data = $dossier->toArray();
        $data['plans_traitement'] = $plans;
        $data['ordonnances']      = $ordonnances;

        return response()->json(['success' => true, 'data' => $data]);
    }
}