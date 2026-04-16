<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use App\Models\Ordonnance;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    /**
     * GET /api/secretaire/factures/{id}/pdf
     * GET /api/patient/factures/{id}/pdf
     */
    public function facture(Request $request, int $id)
    {
        $user = $request->user();

        $query = Facture::with([
            'patient.user',
            'lignes',
            'paiements',
        ]);

        if ($user->role === 'patient') {
            $query->whereHas('patient', fn($q) => $q->where('user_id', $user->id));
        }

        $facture = $query->find($id);

        if (!$facture) {
            return response()->json(['success' => false, 'message' => 'Facture introuvable.'], 404);
        }

        $pdf = Pdf::loadView('pdf.facture', compact('facture'))
            ->setPaper('A4', 'portrait');

        return $pdf->download("facture-{$facture->numero_facture}.pdf");
    }

    /**
     * GET /api/secretaire/ordonnances/{id}/pdf
     * GET /api/dentiste/ordonnances/{id}/pdf
     * GET /api/patient/ordonnances/{id}/pdf
     */
    public function ordonnance(Request $request, int $id)
    {
        $user = $request->user();

        $query = Ordonnance::with(['patient.user', 'dentiste:id,name']);

        if ($user->role === 'patient') {
            $query->whereHas('patient', fn($q) => $q->where('user_id', $user->id));
        } elseif ($user->role === 'dentiste') {
            $query->where('dentiste_id', $user->id);
        }

        $ordonnance = $query->find($id);

        if (!$ordonnance) {
            return response()->json(['success' => false, 'message' => 'Ordonnance introuvable.'], 404);
        }

        $pdf = Pdf::loadView('pdf.ordonnance', compact('ordonnance'))
            ->setPaper('A4', 'portrait');

        return $pdf->download("ordonnance-{$ordonnance->id}.pdf");
    }
}
