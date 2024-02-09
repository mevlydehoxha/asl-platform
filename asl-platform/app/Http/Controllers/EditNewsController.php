<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;

class EditNewsController extends Controller
{
    public function show($id)
    {
        $news = News::findOrFail($id);
        return response()->json($news);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
    
        $rules = [
            'title' => 'required|string',
            'description' => 'required|string',
            'others' => 'string',
        ];
    
        if ($request->has('video')) {
            $rules['video'] = '';
        }
    
        if ($request->has('image')) {
            $rules['image'] = '';
        }
    
        $validatedData = $request->validate($rules);
    
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('images', 'public');
            $news->image = $imagePath;
        }
    
        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoPath = $video->store('videos', 'public');
            $news->video = $videoPath;
        }
    
        $news->title = $validatedData['title'];
        $news->description = $validatedData['description'];
        $news->others = $validatedData['others'];
        $news->save();
    
        return response()->json(['message' => 'News data updated successfully', 'data' => $news], 200);
    }
}
