<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Auth;
class SupplierController extends Controller
{
    public function index(Request $request) {
        $search = $request->input('search');
        $sort = $request->input('sort', 'Default');
        $years = Supplier::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        $suppliers = Supplier::select([
            'id',
            'supplier_name',
            'address',
            'phone_number',
            'email',
            DB::raw("DATE_FORMAT(created_at, '%m-%d-%Y') as date"),
        ])
        ->when($search, function($query) use ($search) {
            $query->where(function($q) use ($search) {
                $q->where('supplier_name', 'like', "%{$search}")
                ->orWhere('address', 'like', "%{$search}");
            });
        })
        ->when($sort && $sort !== 'Default', function ($query) use ($sort){
            if(is_numeric($sort)) {
                $query->whereYear('created_at', $sort);
            }
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);
        return Inertia::render('Supplier/Supplier', [
            'user' => Auth::user(),
            'years' => $years,
            'search' => $search,
            'sort' => $sort,
            'suppliers' => $suppliers,
        ]);
    }
    public function store(Request $request){
    $validatedData = $request->validate([
        'supplier_name' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'phone_number' => 'required|string|max:255',
        'email' => 'required|string|max:255',
    ]);
    Supplier::create($validatedData);
    return redirect()->route('supplier.index')->with('success', 'Supplier added successfully!');
    }
        public function update(Request $request, $id) {
        $validatedData = $request->validate([
        'supplier_name' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'phone_number' => 'required|string|max:255',
        'email' => 'required|string|max:255',
        ]);
        $supplier = Supplier::findOrFail($id);
        $supplier->update($validatedData);
        return redirect()->route('supplier.index')->with('message', 'Supplier updated Successfully!');
    }
    public function destroy($id){
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        return redirect()->route('supplier.index')->with('message', 'Supplier has been deleted!');
    }
}
