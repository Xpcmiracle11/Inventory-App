<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Equipments;
use App\Models\Stocks;
use App\Models\Supplier;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use DB;
use Log;
class CategoryController extends Controller
{
    public function index(Request $request) {
        $search = $request->input('search');
        $sort = $request->input('sort', 'Default');
        $years = Category::selectRaw('YEAR(created_at) as year')
        ->distinct()
        ->orderBy('year', 'desc')
        ->pluck('year');
        $suppliers = Supplier::select([
            'id',
            'supplier_name',
            'address',
            'phone_number',
            'email',
        ])
        ->orderBy('created_at', 'desc')
        ->paginate(10);
        $categories = Category::select(
            'id',
            'equipment_name',
            'item_type',
            DB::raw("DATE_FORMAT(created_at, '%m-%d-%Y') as date"),
        )
        ->when($search, function($query) use ($search) {
            $query->where(function($q) use ($search){
            $q->where('equipment_name', 'like', "{$search}")
            ->orWhere('item_tpye', 'like', "{$search}");
            });
        })
        ->when($sort !== 'Default', function ($query) use ($sort){                
            if(is_numeric($sort)) {
            $query->whereYear('created_at', $sort);
            }
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);
        $equipments = Equipments::select(
        'id',
        'equipment_name',
    ) ->get();
        $user = Auth::user();
        return Inertia::render('Category/Category', [
            'suppliers' => $suppliers,
            'user' => $user,
            'categories' => $categories,
            'years' => $years,
            'search' => $search,
            'sort' => $sort,
            'equipments' => $equipments,
        ]);
    }
    public function store(Request $request){
        $validatedData = $request->validate([
            'equipment_name' => 'required|string|max:255',
            'item_type' => 'required|string|max:255',
        ]);
        $equipment = Equipments::firstOrCreate(
            ['equipment_name' => $validatedData['equipment_name']]
        );
        $validatedData['item_id'] = $equipment->id;
        Category::create($validatedData);
        return redirect()->route('category.index')->with('success', 'Category added successfully!');
    }
    public function update(Request $request, $id) {
        $validatedData = $request->validate([
            'equipment_name' => 'required|string|max:255',
            'item_type' => 'required|string|max:255',
        ]);
        $equipment = Equipments::firstOrCreate(
            ['equipment_name' => $validatedData['equipment_name']]
        );
        $validatedData['item_id'] = $equipment->id;
        $categories = Category::findOrFail($id);
        $categories->update($validatedData);
        return redirect()->route('category.index')->with('message', 'Category updated successfully!');
    }
    public function destroy($id){
        $categories = Category::findOrFail($id);
        $categories->delete();
        return redirect()->route('category.index')->with('message', 'Category has been deleted!');
    }
public function insertToStocks(Request $request, $id)
{
    $validatedData = $request->validate([
        'stocksData' => 'required|array',
        'stocksData.*.brand' => 'required|string|max:255',
        'stocksData.*.model' => 'required|string|max:255',
        'stocksData.*.serial_number' => 'required|string|max:255', // Removed unique validation
        'stocksData.*.supplier' => 'required|string|max:255',
        'stocksData.*.category_id' => 'required|exists:categories,id',
        'stocksData.*.equipment_name' => 'required|string',
        'stocksData.*.item_type' => 'required|string',
    ]);

    $category = Category::findOrFail($id);

    Log::info("Full Request Data:", $request->all());

    if (empty($validatedData['stocksData'])) {
        Log::error("No valid stock data received.");
        return redirect()->route('category.index')->with('error', 'No valid data submitted.');
    }

    foreach ($validatedData['stocksData'] as $stockData) {
        $createdStock = Stocks::create([
            'category_id' => $stockData['category_id'],
            'equipment_name' => $stockData['equipment_name'],
            'item_type' => $stockData['item_type'],
            'brand' => $stockData['brand'],
            'model' => $stockData['model'],
            'serial_number' => $stockData['serial_number'], // Now accepts duplicates
            'supplier' => $stockData['supplier'],
        ]);

        Log::info("Inserted Stock:", $createdStock->toArray());
    }

    return redirect()->route('category.index')->with('message', 'Stocks have been added successfully!');
}

}
