<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Password;
use Illuminate\Http\Request;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $this->validate($request, ['email' => 'required|email']);
    
        $response = $this->broker()->sendResetLink(
            $request->only('email')
        );
    
        if ($response == Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset email sent.']);
        } else {
            return response()->json(['message' => 'Unable to send password reset email.'], 422);
        }
    }
    
    protected function broker()
    {
        return Password::broker();
    }
    
}
