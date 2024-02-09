<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\EditController;
use App\Http\Controllers\DeleteController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\SignController;
use App\Http\Controllers\EditSignController;
use App\Http\Controllers\DeleteSignController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\EditNewsController;
use App\Http\Controllers\DeleteNewsController;
use App\Http\Controllers\DonationsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/users', [UserController::class, 'store']);
Route::post('/users', [UserController::class, 'store']);
Route::middleware(['auth:sanctum', 'admin'])->get('/index', [UserController::class, 'index']);
Route::get('/edit/{id}', [EditController::class, 'show']);
Route::put('/edit/{id}', [EditController::class, 'update']);
Route::any('/delete/{id}', [DeleteController::class, 'delete']);

Route::any('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json(['user' => $user]);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::any('/forgotpassword', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::any('/test-mail', 'App\Http\Controllers\MailTestController@testMail');

Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories-edit/{id}', [CategoryController::class, 'show']);
Route::put('/categories-edit/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

Route::post('/signs', [SignController::class, 'store']);
Route::get('/signs', [SignController::class, 'index']);
Route::get('/signs-edit/{id}', [EditSignController::class, 'show']);
Route::put('/signs-edit/{id}', [EditSignController::class, 'update']);
Route::post('/signs-edit/{id}', [EditSignController::class, 'update']);
Route::delete('/signs/{id}', [DeleteSignController::class, 'destroy']);

Route::post('/news', [NewsController::class, 'store']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news-edit/{id}', [EditNewsController::class, 'show']);
Route::put('/news-edit/{id}', [EditNewsController::class, 'update']);
Route::post('/news-edit/{id}', [EditNewsController::class, 'update']);
Route::delete('/news/{id}', [DeleteNewsController::class, 'destroy']);

Route::post('/type', [TypeController::class, 'store']);
Route::get('/type', [TypeController::class, 'index']);  
Route::get('/type/{id}', [TypeController::class, 'index']);  
Route::get('/type-edit/{id}', [TypeController::class, 'show']);
Route::put('/type-edit/{id}', [TypeController::class, 'update']);
Route::delete('/type/{id}', [TypeController::class, 'destroy']);

Route::post('/donations', [DonationsController::class, 'store']);
Route::get('/donations', [DonationsController::class, 'index']); 
Route::get('/donations/{id}', [DonationsController::class, 'show']); 
Route::put('/donations/{id}/completed', [DonationsController::class, 'updateCompletedStatus']);
Route::get('/donations/{id}/completed', [DonationsController::class, 'updateCompletedStatus']);










