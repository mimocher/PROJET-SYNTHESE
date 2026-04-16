<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    // ── PATIENT ───────────────────────────────────────────────────────────────

    /** GET /api/patient/messages */
    public function patientIndex(Request $request): JsonResponse
    {
        $user      = $request->user();
        $secretaire = User::where('role', 'secretaire')->first();
        if (!$secretaire) return response()->json(['success' => true, 'data' => []]);

        $messages = Message::where(function ($q) use ($user, $secretaire) {
                $q->where('from_user_id', $user->id)->where('to_user_id', $secretaire->id);
            })->orWhere(function ($q) use ($user, $secretaire) {
                $q->where('from_user_id', $secretaire->id)->where('to_user_id', $user->id);
            })
            ->orderBy('created_at')
            ->get();

        // Marquer comme lus les messages de la secrétaire
        Message::where('from_user_id', $secretaire->id)
            ->where('to_user_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['success' => true, 'data' => $messages]);
    }

    /** POST /api/patient/messages */
    public function patientStore(Request $request): JsonResponse
    {
        $request->validate(['body' => 'required|string|max:1000']);
        $secretaire = User::where('role', 'secretaire')->first();
        if (!$secretaire) return response()->json(['success' => false, 'message' => 'Aucune secrétaire disponible.'], 404);

        $msg = Message::create([
            'from_user_id' => $request->user()->id,
            'to_user_id'   => $secretaire->id,
            'body'         => $request->body,
            'lu'           => false,
        ]);

        return response()->json(['success' => true, 'data' => $msg], 201);
    }

    // ── SECRÉTAIRE ────────────────────────────────────────────────────────────

    /** GET /api/secretaire/messages → liste des conversations */
    public function secretaireIndex(Request $request): JsonResponse
    {
        $user = $request->user();

        $msgs = Message::where('from_user_id', $user->id)
            ->orWhere('to_user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        $convs = $msgs->groupBy(function ($m) use ($user) {
                return $m->from_user_id === $user->id ? $m->to_user_id : $m->from_user_id;
            })
            ->map(function ($group, $patientId) use ($user) {
                $last   = $group->first();
                $unread = $group->where('from_user_id', '!=', $user->id)->where('lu', false)->count();
                $p      = User::find($patientId);
                return [
                    'patient_id'   => (int) $patientId,
                    'patient_name' => $p?->name ?? '—',
                    'last_message' => $last->body,
                    'last_at'      => $last->created_at,
                    'unread'       => $unread,
                ];
            })
            ->values();

        return response()->json(['success' => true, 'data' => $convs]);
    }

    /** GET /api/secretaire/messages/{patientId} */
    public function secretaireShow(Request $request, int $patientId): JsonResponse
    {
        $user = $request->user();

        $messages = Message::where(function ($q) use ($user, $patientId) {
                $q->where('from_user_id', $user->id)->where('to_user_id', $patientId);
            })->orWhere(function ($q) use ($user, $patientId) {
                $q->where('from_user_id', $patientId)->where('to_user_id', $user->id);
            })
            ->orderBy('created_at')
            ->get();

        Message::where('from_user_id', $patientId)
            ->where('to_user_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['success' => true, 'data' => $messages]);
    }

    /** POST /api/secretaire/messages/{patientId} */
    public function secretaireStore(Request $request, int $patientId): JsonResponse
    {
        $request->validate(['body' => 'required|string|max:1000']);
        $patient = User::find($patientId);
        if (!$patient) return response()->json(['success' => false, 'message' => 'Patient introuvable.'], 404);

        $msg = Message::create([
            'from_user_id' => $request->user()->id,
            'to_user_id'   => $patientId,
            'body'         => $request->body,
            'lu'           => false,
        ]);

        return response()->json(['success' => true, 'data' => $msg], 201);
    }

    /** GET /api/patient/messages/unread — nombre de messages non lus */
    public function patientUnread(Request $request): JsonResponse
    {
        $user      = $request->user();
        $secretaire = User::where('role', 'secretaire')->first();
        $count = $secretaire
            ? Message::where('from_user_id', $secretaire->id)->where('to_user_id', $user->id)->where('lu', false)->count()
            : 0;
        return response()->json(['success' => true, 'data' => $count]);
    }

    /** GET /api/secretaire/messages/unread — total non lus */
    public function secretaireUnread(Request $request): JsonResponse
    {
        $user  = $request->user();
        $count = Message::where('to_user_id', $user->id)->where('lu', false)->count();
        return response()->json(['success' => true, 'data' => $count]);
    }
}
