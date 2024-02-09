<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;


class DeleteController extends Controller
{
    public function delete($id)
    {
        $item = User::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
