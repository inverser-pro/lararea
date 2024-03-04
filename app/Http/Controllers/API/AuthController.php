<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->except('login');
    }

    public function login( Request $request ) :string
    {
        $credentials = $request->only(['email','password']);
        if(!$token = auth('api')->attempt($credentials)){
            return response()->json(['error'=>'Unauthorized'],401);
        }
        return $this->respondWithToken($token);
    }
    public function logout() :string
    {
        auth('api')->logout();
        return response()->json(['msg' => 'You have successfully logged out']);
    }
    public function user() :string
    {
        return response()->json(auth('api')->user());
    }
    public function refresh() :string
    {
        return $this->respondWithToken(auth('api')->refresh());
    }
    public function respondWithToken($token) :string
    {
        return response()->json([
           'access_token' => $token,
           'type' => 'Bearer',
           'expires'=> Config::get('jwt.ttl')*60
        ]);
    }
}
