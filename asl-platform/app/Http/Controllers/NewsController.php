<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;


class NewsController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'image' => 'image',
            'video' => 'mimes:mp4',
            'title' => 'required|string',
            'description' => 'required|string', 
            'others' => 'string',

        ]);

        $image = $request->file('image');
        $imagePath = $image->store('images', 'public');

        $video = $request->file('video');
        $videoPath = $video->store('videos', 'public');

        $news = News::create([
            'image' => $imagePath, 
            'video' => $videoPath,
            'title' => $validatedData['title'],
            'others' => $validatedData['others'],
            'description' => $validatedData['description'],
        ]);

        return response()->json(['message' => 'News data created successfully', 'data' => $news], 201);
    }

    public function index()
    {
        $news = News::all(); 
        return response()->json($news);
    }
}
