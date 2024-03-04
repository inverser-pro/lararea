<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws HttpException
     */
    public function login( Request $request ) :string
    {
        $credentials = $request->only(['email','password']);
        if(!$token = auth('api')->attempt($credentials)){
            return response()->json(['error'=>'ERROR_dfogj8T | Unauthorized'],401);
        }
        return $this->respondWithToken($token);
    }
    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() :string
    {
        auth('api')->logout();
        return response()->json(['msg' => 'You have successfully logged out']);
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user() :string
    {
        return response()->json(auth('api')->user());
    }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() :string
    {
        return $this->respondWithToken(auth('api')->refresh());
    }
    /**
     * Receiving a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondWithToken($token) :string
    {
        return response()->json([
           'access_token' => $token,
           'type' => 'Bearer',
           'expires'=> Config::get('jwt.ttl')*60
        ]);
    }
}
