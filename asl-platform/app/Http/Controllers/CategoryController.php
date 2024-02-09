<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all(); 
        return response()->json($categories);
    }
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);
    
            $data = Category::create([
                'name' => $request->input('name'),
                'completed' => false,
            ]);
    
            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while creating the category.'], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|unique:categories,name,' . $category->id,
        ]);

        $category->update($data);

        return response()->json(['message' => 'Category updated successfully']);
    }
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

}
