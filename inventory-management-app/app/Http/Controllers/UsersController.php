<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UsersController extends Controller
{
  public function index(Request $request) {
    if (Auth::user()->role !== 'Admin') {
            return redirect('/dashboard')->with('error', 'Access denied.');
    }
    $search = $request->input('search');
    $sort = $request->input('sort', 'Default');
    $years = User::selectRaw('YEAR(created_at) as year')
      ->distinct()
      ->orderBy('year', 'desc')
      ->pluck('year');
    $users = User::select(
      'id',
      'first_name',
      'last_name',
      'role',
      'department',
      'email',
      'password',
      DB::raw("DATE_FORMAT(created_at, '%m-%d-%Y') as date"),
    )
      ->when($search, function($query) use ($search){
        $query->where(function ($q) use ($search){
          $q->where('first_name', 'like', "%{$search}")
            ->orWhere('last_name', 'like', "%{$search}")
            ->orWhere('role', 'like', "%{$search}");
        });
      })
      ->when($sort !== 'Default', function ($query) use ($sort){
        if(is_numeric($sort)) {
          $query->whereYear('created_at', $sort);
        }
      })
      ->orderBy('created_at', 'desc')
      ->paginate(10);

    $user = Auth::user();

      return Inertia::render ('Users/Users', [
      'user' => $user,
      'users' => $users,
      'years' => $years,
      'sort' => $sort,
      'search' => $search
      ]);
  }
  public function store (Request $request) {
    $validatedData = $request->validate([
      'first_name' => 'required|string|max:255',
      'last_name' => 'required|string|max:255',
      'email' => 'required|string|max:255',
      'role' => 'required|string|max:255',
      'department' => 'required|string|max:255',
      'password' => 'required|string|max:255',
    ]);
    User::create($validatedData);
    return redirect()->route('users.index')->with('message', 'Account created Successfully!');
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
    $users = User::findOrFail($id);
    if (!empty($validatedData['password'])) {
        $validatedData['password'] = bcrypt($validatedData['password']);
    } else {
        unset($validatedData['password']);
    }
    $users->update($validatedData);
    return redirect()->route('users.index')->with('message', 'User has been updated');
  }
   public function destroy($id){
        $users = User::findOrFail($id);
        $users->delete();
        return redirect()->route('users.index')->with('message', 'User has been deleted!');
    }
}
