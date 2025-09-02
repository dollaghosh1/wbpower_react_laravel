<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostCategoryController;
use App\Http\Controllers\Api\PostController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

// User Details
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);
Route::get('alluserlist', [UserController::class, 'allUserList']);
Route::middleware('auth:api')->get('userdetails', [UserController::class, 'userDetails']);
Route::middleware('auth:api')->post('updateuserdetails', [UserController::class, 'updateUserDetails']);
Route::middleware('auth:api')->delete('deleteuserdetails', [UserController::class, 'deleteUserDetails']);

// Post Category
Route::middleware('auth:api')->post('addpostcategory', [PostCategoryController::class, 'addPostCategory']);
Route::middleware('auth:api')->get('allpostcategory', [PostCategoryController::class, 'allPostCategory']);
Route::middleware('auth:api')->get('postcategorydetails/{post_id}', [PostCategoryController::class, 'PostCategoryDetails']);
Route::middleware('auth:api')->put('updatepostcategory/{postcat_id}', [PostCategoryController::class, 'updatePostCategory']);
Route::middleware('auth:api')->delete('deletepostcategory/{postcat_id}', [PostCategoryController::class, 'deletePostCategory']);

// Post 
Route::middleware('auth:api')->post('addpost', [PostController::class, 'addPost']);
Route::middleware('auth:api')->get('allpost', [PostController::class, 'allPost']);
Route::middleware('auth:api')->get('postdetails/{post_id}', [PostController::class, 'PostDetails']);
Route::middleware('auth:api')->post('updatepost/{post_id}', [PostController::class, 'updatePost']);
Route::middleware('auth:api')->delete('deletepost/{post_id}', [PostController::class, 'deletePost']);
Route::middleware('auth:api')->get('category_wise_post/{postcat_id}', [PostController::class, 'CategoryWisePost']);