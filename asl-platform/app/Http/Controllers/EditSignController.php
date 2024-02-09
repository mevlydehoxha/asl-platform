<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sign;

class EditSignController extends Controller
{
    public function show($id)
    {
        $sign = Sign::findOrFail($id);
        return response()->json($sign);
    }

    public function update(Request $request, $id)
    {
        $sign = Sign::findOrFail($id);
    
        $rules = [
            'title_albanian' => 'required|string',
            'title_english' => 'required|string',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
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
            $sign->image = $imagePath;
        }
    
        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoPath = $video->store('videos', 'public');
            $sign->video = $videoPath;
        }
    
        $sign->title_albanian = $validatedData['title_albanian'];
        $sign->title_english = $validatedData['title_english'];
        $sign->description = $validatedData['description'];
        $sign->category_id = $validatedData['category_id'];
        $sign->save();
    
        return response()->json(['message' => 'Sign updated successfully', 'data' => $sign], 200);
    }
    
    
}
