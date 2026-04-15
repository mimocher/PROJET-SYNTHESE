<?php

namespace App\Http\Controllers\Api\Secretaire;

use App\Http\Controllers\Controller;
use App\Models\DossierMedical;
use App\Models\Patient;
use App\Models\RendezVous;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SecretairePatientController extends Controller
{
    /**
     * GET /api/secretaire/patients
     */
    public function index(Request $request): JsonResponse
    {
        $sortBy  = in_array($request->sort_by, ['id', 'name', 'created_at']) ? $request->sort_by : 'id';
        $sortDir = $request->sort_dir === 'asc' ? 'asc' : 'desc';

        $query = Patient::with('user')
            ->when($request->search, fn($q) => $q->search($request->search))
            ->when($request->has('archived'), fn($q) => $q->where('is_archived', filter_var($request->archived, FILTER_VALIDATE_BOOLEAN)))
            ->when(!$request->has('archived'), fn($q) => $q->where('is_archived', false));

        // Tri par nom du user ou par id
        if ($sortBy === 'name') {
            $query->join('users', 'patients.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortDir)
                  ->select('patients.*');
        } else {
            $query->orderBy('patients.' . $sortBy, $sortDir);
        }

        $patients = $query->paginate($request->per_page ?? 20);

        return response()->json(['success' => true, 'data' => $patients]);
    }

    /**
     * POST /api/secretaire/patients
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'                    => 'required|string|max:255',
            'email'                   => 'required|email|unique:users,email',
            'password'                => 'sometimes|string|min:8',
            'telephone'               => 'nullable|string|max:20',
            'date_naissance'          => 'nullable|date|before:today',
            'sexe'                    => 'nullable|in:M,F,autre',
            'adresse'                 => 'nullable|string',
            'ville'                   => 'nullable|string|max:100',
            'code_postal'             => 'nullable|string|max:10',
            'mutuelle'                => 'nullable|string|max:100',
            'numero_securite_sociale' => 'nullable|string|max:30',
            'contact_urgence_nom'     => 'nullable|string|max:255',
            'contact_urgence_tel'     => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password ?? 'ChangeMoi123!'),
            'role'     => 'patient',
        ]);

        $patient = Patient::create(array_merge(
            ['user_id' => $user->id],
            $request->only([
                'telephone', 'date_naissance', 'sexe', 'adresse',
                'ville', 'code_postal', 'mutuelle', 'numero_securite_sociale',
                'contact_urgence_nom', 'contact_urgence_tel',
            ])
        ));

        // Créer un dossier médical vide
        DossierMedical::create(['patient_id' => $patient->id]);

        return response()->json([
            'success' => true,
            'data'    => $patient->load('user'),
            'message' => 'Patient créé avec succès.',
        ], 201);
    }

    /**
     * GET /api/secretaire/patients/{id}
     */
    public function show(int $id): JsonResponse
    {
        $patient = Patient::with([
            'user',
            'dossierMedical',
            'rendezVous' => fn($q) => $q->with('dentiste:id,name')->orderByDesc('date_heure')->limit(5),
            'factures'   => fn($q) => $q->orderByDesc('date_facture')->limit(3),
        ])->find($id);

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Patient introuvable.'], 404);
        }

        // Stats rapides
        $stats = [
            'total_rdv'       => RendezVous::where('patient_id', $patient->id)->count(),
            'rdv_termines'    => RendezVous::where('patient_id', $patient->id)->where('statut', 'termine')->count(),
            'rdv_annules'     => RendezVous::where('patient_id', $patient->id)->where('statut', 'annule')->count(),
            'factures_impayees' => $patient->factures()->whereIn('statut', ['en_attente', 'partiellement_paye'])->count(),
        ];

        return response()->json([
            'success' => true,
            'data'    => array_merge($patient->toArray(), ['stats' => $stats]),
        ]);
    }

    /**
     * PUT /api/secretaire/patients/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $patient = Patient::with('user')->find($id);

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Patient introuvable.'], 404);
        }

        $request->validate([
            'name'                    => 'sometimes|string|max:255',
            'email'                   => 'sometimes|email|unique:users,email,' . $patient->user_id,
            'telephone'               => 'nullable|string|max:20',
            'date_naissance'          => 'nullable|date|before:today',
            'sexe'                    => 'nullable|in:M,F,autre',
            'adresse'                 => 'nullable|string',
            'ville'                   => 'nullable|string|max:100',
            'code_postal'             => 'nullable|string|max:10',
            'mutuelle'                => 'nullable|string|max:100',
            'numero_securite_sociale' => 'nullable|string|max:30',
            'contact_urgence_nom'     => 'nullable|string|max:255',
            'contact_urgence_tel'     => 'nullable|string|max:20',
        ]);

        if ($request->hasAny(['name', 'email'])) {
            $patient->user->update($request->only(['name', 'email']));
        }

        $patient->update($request->only([
            'telephone', 'date_naissance', 'sexe', 'adresse',
            'ville', 'code_postal', 'mutuelle', 'numero_securite_sociale',
            'contact_urgence_nom', 'contact_urgence_tel',
        ]));

        return response()->json([
            'success' => true,
            'data'    => $patient->fresh()->load('user'),
            'message' => 'Patient mis à jour avec succès.',
        ]);
    }

    /**
     * DELETE /api/secretaire/patients/{id}
     * Archive le patient (soft-delete métier)
     */
    public function destroy(int $id): JsonResponse
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Patient introuvable.'], 404);
        }

        if ($patient->is_archived) {
            return response()->json(['success' => false, 'message' => 'Ce patient est déjà archivé.'], 422);
        }

        $patient->update(['is_archived' => true]);
        $patient->user->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Patient archivé avec succès.',
        ]);
    }

    /**
     * POST /api/secretaire/patients/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Patient introuvable.'], 404);
        }

        if (!$patient->is_archived) {
            return response()->json(['success' => false, 'message' => 'Ce patient n\'est pas archivé.'], 422);
        }

        $patient->update(['is_archived' => false]);
        $patient->user->update(['is_active' => true]);

        return response()->json([
            'success' => true,
            'data'    => $patient->fresh()->load('user'),
            'message' => 'Patient réactivé avec succès.',
        ]);
    }
}
