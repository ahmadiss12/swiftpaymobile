<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function sendMoney(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_identifier' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'message' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = DB::transaction(function () use ($request) {
                $sender = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
                $amount = (float) $request->amount;

                $recipient = User::where(function ($query) use ($request) {
                    $query->where('swiftpay_id', $request->recipient_identifier)
                        ->orWhere('email', $request->recipient_identifier)
                        ->orWhere('phone_number', $request->recipient_identifier);
                })->lockForUpdate()->first();

                if (!$recipient) {
                    return ['error' => 'Recipient not found', 'status' => 404];
                }

                if ($recipient->id === $sender->id) {
                    return ['error' => 'Cannot send money to yourself', 'status' => 400];
                }

                if ((float) $sender->balance < $amount) {
                    return ['error' => 'Insufficient balance', 'status' => 400];
                }

                $transaction = Transaction::create([
                    'transaction_id' => $this->generateTransactionId(),
                    'sender_id' => $sender->id,
                    'recipient_id' => $recipient->id,
                    'amount' => $amount,
                    'status' => 'Completed',
                    'message' => $request->message ?? '',
                ]);

                $sender->decrement('balance', $amount);
                $recipient->increment('balance', $amount);
                $sender->refresh();

                return [
                    'message' => 'Transfer successful',
                    'new_balance' => (float) $sender->balance,
                    'transaction' => [
                        'id' => $transaction->transaction_id,
                        'amount' => (float) $transaction->amount,
                        'recipient' => $recipient->full_name,
                        'swiftpay_id' => $recipient->swiftpay_id,
                    ],
                ];
            });

            if (isset($result['error'])) {
                return response()->json(['message' => $result['error']], $result['status']);
            }

            return response()->json($result, 200);
        } catch (\Throwable) {
            return response()->json([
                'message' => 'Transfer failed. Please try again.',
            ], 500);
        }
    }

    public function getTransactions(Request $request)
    {
        $user = $request->user();
        $type = $request->query('type', 'All');
        $limit = min((int) $request->query('limit', 50), 100);

        $query = Transaction::where(function ($q) use ($user) {
            $q->where('sender_id', $user->id)
                ->orWhere('recipient_id', $user->id);
        })
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc');

        if ($type === 'Sent') {
            $query->where('sender_id', $user->id);
        } elseif ($type === 'Received') {
            $query->where('recipient_id', $user->id);
        }

        $transactions = $query->limit($limit)->get()->map(function ($transaction) use ($user) {
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
            'transactions' => $transactions,
        ], 200);
    }

    private function generateTransactionId(): string
    {
        do {
            $transactionId = 'TXN' . str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        } while (Transaction::where('transaction_id', $transactionId)->exists());

        return $transactionId;
    }
}
