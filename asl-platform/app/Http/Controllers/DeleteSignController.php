<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sign;
use Illuminate\Support\Facades\Storage;

class DeleteSignController extends Controller
{
    public function destroy($id)
    {
        $sign = Sign::find($id);

        if (!$sign) {
            return response()->json(['message' => 'Sign not found'], 404);
        }

        if ($sign->image) {
            Storage::disk('public')->delete($sign->image);
        }
        
        if ($sign->video) {
            Storage::disk('public')->delete($sign->video);
        }

        $sign->delete();

        return response()->json(['message' => 'Sign deleted successfully']);
    }
}
