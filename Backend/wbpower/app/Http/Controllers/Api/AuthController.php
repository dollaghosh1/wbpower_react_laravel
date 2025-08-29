<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
            {
              
                try {
                    $request->validate([
                        'name' => 'required|string|max:255',
                        'email' => 'required|string|email|max:255|unique:users',
                        'password' => 'required|string|min:8|confirmed',
                    ]);

                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make($request->password),
                    ]);

                    $token = $user->createToken('authToken')->accessToken;

                    return response()->json(['user' => $user, 'access_token' => $token]);
                }
                catch (ValidationException $e) {
                        return response()->json([
                            'errors' => $e->errors()
                        ], 422);
                    }
            }
                

    public function login(Request $request)
        {
                try {
                    $credentials = $request->validate([
                        'email' => 'required|string|email',
                        'password' => 'required|string',
                    ]);

                    if (!Auth::attempt($credentials)) {
                        return response()->json(['message' => 'Unauthorized'], 401);
                    }

                    $user = $request->user();
                    $token = $user->createToken('authToken')->accessToken;

                    return response()->json(['user' => $user, 'access_token' => $token]);
                }
                catch (ValidationException $e) {
                        return response()->json([
                            'errors' => $e->errors()
                        ], 422);
                    }
        }
     public function logout(Request $request)
        {
            $user = Auth::user();
            
            $user->token()->revoke(); // Revoke the current access token

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ], 200);
            
        }
     
}
