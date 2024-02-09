<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'email' => 'required|string|max:255',
                'password' => 'required|string|max:255',
            ]);
    
            $task = User::create([
                'firstname' => $request->input('firstname'),
                'lastname' => $request->input('lastname'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'completed' => false,
            ]);
    
            return response()->json($task, 201);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the user.'], 500);
        }
    }
    public function index()
    {
        $users = User::all(); 
        return response()->json($users);
    }
}
