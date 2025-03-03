<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class SettingsController extends Controller
{
    public function index( Request $request){
        $user = Auth::user();

        return Inertia::render('Settings/Settings', [
            'user' =>  $user,
        ]);
    }
    public function update(Request $request, $id) {
        $validatedData = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:255',
        ]);
        $user = User::findOrFail($id);
        if (!empty($validatedData['password'])) {
            $validatedData['password'] = bcrypt($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }
        $user->update($validatedData);
        return redirect()->route('settings.index')->with('message', 'Account has been updated');
    }
    public function destroy($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return redirect()->route('login.index')->with('message', 'User has been deleted!');
    }
}
