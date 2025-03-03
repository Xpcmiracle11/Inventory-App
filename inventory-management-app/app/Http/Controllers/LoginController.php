<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function index(Request $request){

        return Inertia::render('Login/Login');
    }
    public function login(Request $request){
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('web')->attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('/stocks');
        }

        return back()->withErrors([
            'password' => 'Invalid email or password',
        ]);
    }
    public function logout(Request $request){
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
