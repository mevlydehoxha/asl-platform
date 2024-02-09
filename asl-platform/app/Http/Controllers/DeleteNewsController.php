<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Storage;

class DeleteNewsController extends Controller
{
    public function destroy($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json(['message' => 'Sign not found'], 404);
        }

        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }
        
        if ($news->video) {
            Storage::disk('public')->delete($news->video);
        }

        $news->delete();

        return response()->json(['message' => 'Sign deleted successfully']);
    }
}
