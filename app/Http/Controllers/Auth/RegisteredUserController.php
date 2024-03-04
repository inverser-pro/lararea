<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     * @data from Front registration form //localhost/register
     *                                          >> $request->any_data
     *                                              any_data = name || email || password || password_confirmation || csrf
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Additional verification of the password for compliance with the necessary requirements of the technical specifications
        try {
            // Since checking for each category of characters is performed additionally on the Frontend, here I perform the check only nominally, in case of automatic or generated outside the browser requests
            $validator = Validator::make(['password' => $request->password], [
                'password' => [
                    'min:8', // Checking for minimum password length
                    'regex:/[A-z]/', // Checking for capital and lowercase letters
                    'regex:/[0-9]/', // Checking for numbers
                    'regex:/[\\/!\';\[\]@`~#$%^&*(),.?":{}|<>_+=-]/', // Checking for special characters
//                    'not_regex:/[А-я\\s]/', // Checking for Russian capital and lowercase characters and spaces
                ],
            ]);
            if ($validator->fails()) {
                // If the password fails one of the checks, error handling
                throw ValidationException::withMessages($validator->errors()->toArray());
            }
        } catch (ValidationException $e) {
            // Handling Form Validation Errors
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
