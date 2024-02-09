<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        if (Auth::attempt($credentials)) {
            $user = $request->user();
            $expiration = 1440; 
            $token = $user->createToken('authToken', ['user'])->plainTextToken;
    
            return response()->json([
                'user' => $user,
                'token' => $token,
            ])->cookie('token', $token, $expiration);
        }
    
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logout successful']);
    }

   
}
