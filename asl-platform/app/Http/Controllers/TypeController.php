<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    public function index()
    {
        $type = Type::all(); 
        return response()->json($type);
    }
    public function show($id)
    {
        $type = Type::findOrFail($id);
        return response()->json($type);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'type' => 'required|string|max:255',
            ]);
    
            $data = Type::create([
                'type' => $request->input('type'),
                'completed' => false,
            ]);
    
            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while creating the type.'], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $type = Type::findOrFail($id);
        $data = $request->validate([
            'type' => 'required|unique:types,type,' . $type->id,
        ]);

        $type->update($data);

        return response()->json(['message' => 'Type updated successfully']);
    }
    public function destroy($id)
    {
        $type = Type::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Type deleted successfully']);
    }

}
