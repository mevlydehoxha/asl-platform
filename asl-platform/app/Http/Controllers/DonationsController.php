<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Donation;

class DonationsController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'description' => 'required|string',  
            'type_id' => 'required|exists:types,id',
        ]);


        $donation = Donation::create([
            'user_id' => $validatedData['user_id'],
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'type_id' => $validatedData['type_id'],
        ]);

        return response()->json(['message' => 'Donation created successfully', 'data' => $donation], 201);
    }
    public function index()
    {
        $donations = Donation::all(); 
        return response()->json($donations);
    }
    public function show($id)
    {
        $donation = Donation::findOrFail($id);
        return response()->json($donation);
    }
    public function updateCompletedStatus(Request $request, $id)
    {
        $donation = Donation::findOrFail($id);

        $validatedData = $request->validate([
            'completed' => 'required|boolean',
        ]);

        $donation->update(['completed' => $validatedData['completed']]);

        return response()->json(['message' => 'Completed status updated successfully']);
    }

}
