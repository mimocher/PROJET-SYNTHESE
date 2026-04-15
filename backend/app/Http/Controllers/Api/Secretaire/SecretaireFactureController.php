<?php

namespace App\Http\Controllers\Api\Secretaire;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use App\Models\LigneFacture;
use App\Models\Paiement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecretaireFactureController extends Controller
{
    /**
     * GET /api/secretaire/factures
     */
    public function index(Request $request): JsonResponse
    {
        $factures = Facture::with(['patient.user', 'lignes', 'secretaire:id,name'])
            ->when($request->statut, fn($q) => $q->where('statut', $request->statut))
            ->when($request->patient_id, fn($q) => $q->where('patient_id', $request->patient_id))
            ->when($request->search, function ($q) use ($request) {
                $q->where('numero_facture', 'like', '%' . $request->search . '%')
                  ->orWhereHas('patient.user', fn($u) => $u->where('name', 'like', '%' . $request->search . '%'));
            })
            ->when($request->date_debut, fn($q) => $q->where('date_facture', '>=', $request->date_debut))
            ->when($request->date_fin, fn($q) => $q->where('date_facture', '<=', $request->date_fin))
            ->orderByDesc('date_facture')
            ->paginate($request->per_page ?? 20);

        return response()->json(['success' => true, 'data' => $factures]);
    }

    /**
     * POST /api/secretaire/factures
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id'                  => 'required|exists:patients,id',
            'consultation_id'             => 'nullable|exists:consultations,id',
            'date_facture'                => 'required|date',
            'notes'                       => 'nullable|string',
            'lignes'                      => 'required|array|min:1',
            'lignes.*.libelle'            => 'required|string|max:255',
            'lignes.*.quantite'           => 'required|integer|min:1',
            'lignes.*.prix_unitaire'      => 'required|numeric|min:0',
            'lignes.*.catalogue_acte_id'  => 'nullable|exists:catalogue_actes,id',
        ]);

        $montantTotal = collect($request->lignes)
            ->sum(fn($l) => $l['quantite'] * $l['prix_unitaire']);

        $facture = Facture::create([
            'patient_id'       => $request->patient_id,
            'secretaire_id'    => $request->user()->id,
            'consultation_id'  => $request->consultation_id,
            'numero_facture'   => Facture::genererNumero(),
            'date_facture'     => $request->date_facture,
            'montant_total'    => $montantTotal,
            'montant_paye'     => 0,
            'montant_mutuelle' => 0,
            'statut'           => 'en_attente',
            'notes'            => $request->notes,
        ]);

        foreach ($request->lignes as $ligne) {
            LigneFacture::create([
                'facture_id'        => $facture->id,
                'catalogue_acte_id' => $ligne['catalogue_acte_id'] ?? null,
                'libelle'           => $ligne['libelle'],
                'quantite'          => $ligne['quantite'],
                'prix_unitaire'     => $ligne['prix_unitaire'],
                'total'             => $ligne['quantite'] * $ligne['prix_unitaire'],
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => $facture->load(['lignes', 'patient.user', 'secretaire:id,name']),
            'message' => 'Facture créée avec succès.',
        ], 201);
    }

    /**
     * GET /api/secretaire/factures/{id}
     */
    public function show(int $id): JsonResponse
    {
        $facture = Facture::with([
            'patient.user',
            'lignes.catalogueActe',
            'paiements',
            'secretaire:id,name',
            'consultation',
        ])->find($id);

        if (!$facture) {
            return response()->json(['success' => false, 'message' => 'Facture introuvable.'], 404);
        }

        // Ajouter le montant restant calculé
        $data             = $facture->toArray();
        $data['montant_restant'] = max(0, $facture->montant_total - $facture->montant_paye - $facture->montant_mutuelle);

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * POST /api/secretaire/factures/{id}/paiements
     * Enregistrer un paiement (avec protection contre le surpaiement)
     */
    public function storePaiement(Request $request, int $id): JsonResponse
    {
        $facture = Facture::find($id);
        if (!$facture) {
            return response()->json(['success' => false, 'message' => 'Facture introuvable.'], 404);
        }

        if ($facture->statut === 'paye') {
            return response()->json(['success' => false, 'message' => 'Cette facture est déjà entièrement payée.'], 422);
        }

        if ($facture->statut === 'annule') {
            return response()->json(['success' => false, 'message' => 'Impossible d\'encaisser un paiement sur une facture annulée.'], 422);
        }

        $request->validate([
            'montant'       => 'required|numeric|min:0.01',
            'mode_paiement' => 'required|in:especes,carte,virement,mutuelle,cheque',
            'date_paiement' => 'required|date',
            'reference'     => 'nullable|string|max:100',
            'notes'         => 'nullable|string',
        ]);

        // Calcul du reste à payer
        $resteAPayer = $facture->montant_total - $facture->montant_paye - $facture->montant_mutuelle;

        if ($request->montant > $resteAPayer + 0.001) {
            return response()->json([
                'success' => false,
                'message' => "Le montant saisi ({$request->montant} €) dépasse le reste à payer ({$resteAPayer} €).",
            ], 422);
        }

        Paiement::create([
            'facture_id'    => $facture->id,
            'montant'       => $request->montant,
            'mode_paiement' => $request->mode_paiement,
            'date_paiement' => $request->date_paiement,
            'reference'     => $request->reference,
            'notes'         => $request->notes,
        ]);

        // Mettre à jour le montant payé
        if ($request->mode_paiement === 'mutuelle') {
            $facture->increment('montant_mutuelle', $request->montant);
        } else {
            $facture->increment('montant_paye', $request->montant);
        }

        $facture->fresh()->recalculerStatut();

        $factureActualisee = Facture::with(['paiements', 'lignes'])->find($id);

        return response()->json([
            'success' => true,
            'data'    => $factureActualisee,
            'message' => 'Paiement enregistré avec succès.',
        ], 201);
    }

    /**
     * PATCH /api/secretaire/factures/{id}/annuler
     */
    public function annuler(Request $request, int $id): JsonResponse
    {
        $facture = Facture::find($id);
        if (!$facture) {
            return response()->json(['success' => false, 'message' => 'Facture introuvable.'], 404);
        }

        if ($facture->statut === 'paye') {
            return response()->json(['success' => false, 'message' => 'Impossible d\'annuler une facture déjà payée.'], 422);
        }

        if ($facture->statut === 'annule') {
            return response()->json(['success' => false, 'message' => 'Cette facture est déjà annulée.'], 422);
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $facture->update([
            'statut' => 'annule',
            'notes'  => $request->notes ?? $facture->notes,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $facture->fresh(),
            'message' => 'Facture annulée.',
        ]);
    }

    /**
     * GET /api/secretaire/factures/impayes
     */
    public function impayes(Request $request): JsonResponse
    {
        $impayes = Facture::with(['patient.user', 'lignes'])
            ->whereIn('statut', ['en_attente', 'partiellement_paye'])
            ->when($request->patient_id, fn($q) => $q->where('patient_id', $request->patient_id))
            ->orderBy('date_facture')
            ->paginate($request->per_page ?? 20);

        // Montant total impayé
        $totalImpayes = Facture::whereIn('statut', ['en_attente', 'partiellement_paye'])
            ->selectRaw('SUM(montant_total - montant_paye - montant_mutuelle) as total')
            ->value('total') ?? 0;

        return response()->json([
            'success' => true,
            'data'    => $impayes,
            'meta'    => [
                'montant_total_impayes' => round($totalImpayes, 2),
            ],
        ]);
    }
}
