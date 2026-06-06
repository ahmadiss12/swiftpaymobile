<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class DashboardController extends Controller
{
    /**
     * Get dashboard data for authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get recent transactions (last 5)
        $recentTransactions = Transaction::where(function($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->orWhere('recipient_id', $user->id);
            })
            ->where('status', 'Completed')
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($transaction) use ($user) {
                $isReceived = $transaction->recipient_id === $user->id;

                return [
                    'id' => $transaction->transaction_id,
                    'sender_id' => $transaction->sender_id,
                    'recipient_id' => $transaction->recipient_id,
                    'amount' => (float) $transaction->amount,
                    'transaction_type' => $isReceived ? 'received' : 'sent',
                    'status' => $transaction->status,
                    'message' => $transaction->message,
                    'other_party_name' => $isReceived
                        ? $transaction->sender->full_name
                        : $transaction->recipient->full_name,
                    'created_at' => $transaction->created_at->toISOString(),
                ];
            });

        return response()->json([
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'swiftpay_id' => $user->swiftpay_id,
                'balance' => (float) $user->balance,
            ],
            'recentTransactions' => $recentTransactions
        ], 200);
    }
}
