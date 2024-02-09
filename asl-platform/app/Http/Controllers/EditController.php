<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class EditController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|string|max:255',
        ]);
    
        \Log::debug('Request data: ' . json_encode($request->all()));
    
        $user->update($request->all());
    
        return response()->json(['message' => 'User updated successfully']);
    }
    
}
