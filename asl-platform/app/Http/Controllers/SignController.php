<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sign;

class SignController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title_albanian' => 'required|string',
            'title_english' => 'required|string',
            'description' => 'required|string', 
            'image' => 'image',
            'video' => 'required|mimes:mp4', 
        ]);

        $image = $request->file('image');
        $imagePath = $image->store('images', 'public');

        $video = $request->file('video');
        $videoPath = $video->store('videos', 'public');

        $sign = Sign::create([
            'category_id' => $validatedData['category_id'],
            'title_albanian' => $validatedData['title_albanian'],
            'title_english' => $validatedData['title_english'],
            'description' => $validatedData['description'],
            'image' => $imagePath, 
            'video' => $videoPath,
        ]);

        return response()->json(['message' => 'Sign created successfully', 'data' => $sign], 201);
    }

    public function index()
    {
        $signs = Sign::all(); 
        return response()->json($signs);
    }
}