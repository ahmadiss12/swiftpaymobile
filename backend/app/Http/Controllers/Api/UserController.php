<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get user by identifier (swiftpay_id, email, or phone_number)
     */
    public function getUserByIdentifier(Request $request)
    {
        $identifier = $request->query('identifier');

        if (!$identifier) {
            return response()->json([
                'message' => 'Identifier is required'
            ], 400);
        }

        $user = User::where('swiftpay_id', $identifier)
            ->orWhere('email', $identifier)
            ->orWhere('phone_number', $identifier)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'swiftpay_id' => $user->swiftpay_id,
            ]
        ], 200);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'swiftpay_id' => $user->swiftpay_id,
                'balance' => (float) $user->balance,
            ]
        ], 200);
    }
}
