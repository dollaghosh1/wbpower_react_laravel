<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function allUserList(Request $request)
        {
           
            $user = User::all();
            return response()->json([
                'success'=>true,
                'data'=>$user,
                'message'=>'User List successfully'
            ],200);
    
        }
    public function userDetails(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'User details fetched successfully'
        ], 200);
    }
    public function UpdateUserDetails(Request $request)
    {
       // echo 'test';exit;
         try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.'
            ], 401);
        }

        // Validate request data
        $validatedData = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);
    //return $validatedData;
        // Update user
       $user->update($validatedData);

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'User details updated successfully'
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors'  => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong: ' . $e->getMessage()
        ], 500);
    }
    }
    public function deleteUserDetails(Request $request)
    {
       // echo 'test';exit;
         try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.'
                ], 401);
            }
            $user->delete(); 
             return response()->json([
            'success' => true,
            'message' => 'User details delete successfully'
        ], 200);

         }
         catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }

    }
    

}

