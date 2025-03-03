<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Stocks;

class StocksController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'Default');
        $years = Stocks::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');
        $equipmentSort = $request->input('equipmentSort', 'All');
        $equipments = Stocks::distinct()->pluck('equipment_name');
        $stocks = Stocks::select(
            'id',
            'equipment_name',
            'brand',
            'model',
            'serial_number',
            'supplier',
            DB::raw("DATE_FORMAT(created_at, '%m-%d-%Y') as date")
        )
        ->whereNotIn('id', function ($query) {
            $query->select('item_id')->from('defectives');
        })
        ->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('serial_number', 'like', "%{$search}%");
            });
        })
        ->when($sort !== 'Default', function ($query) use ($sort) {
            if (is_numeric($sort)) {
                $query->whereYear('created_at', $sort);
            }
        })
        ->when($equipmentSort !== 'All', function ($query) use ($equipmentSort) {
        $query->where('equipment_name', $equipmentSort);
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);
        $user = Auth::user();
        return Inertia::render('Stocks/Stocks', [
            'equipments' => $equipments,
            'equipmentSort' => $equipmentSort,
            'user' => $user,
            'stocks' => $stocks,
            'years' => $years,
            'sort' => $sort,
            'search' => $search 
        ]);
    }
}