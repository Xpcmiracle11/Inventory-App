<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Exports\DefectivesExport;
use Maatwebsite\Excel\Facades\Excel;use Inertia\Inertia;
use App\Models\Defectives;
use App\Models\Stocks;
use App\Models\User;
use Illuminate\Support\Facades\Log;
class DefectiveController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $yearSort = $request->input('yearSort');
        $monthSort = $request->input('monthSort');
        $weekSort = $request->input('weekSort');
        $years = Defectives::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray(); 
        $months = Defectives::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month')
        ->when($yearSort && $yearSort !== 'Default', function ($query) use ($yearSort) {
            $query->whereYear('created_at', $yearSort);
        })
        ->distinct()
        ->orderBy('month', 'asc')
        ->get()
        ->map(function ($item) {
            return [
                'year' => $item->year,
                'number' => $item->month,
                'name' => date('F', mktime(0, 0, 0, $item->month, 1))
            ];
        })
        ->toArray();
        $weeks = Defectives::selectRaw("
                        YEAR(created_at) as year, 
                        MONTH(created_at) as month, 
                        WEEK(created_at, 1) - WEEK(DATE_SUB(created_at, INTERVAL DAY(created_at)-1 DAY), 1) + 1 as week_number
                    ")
            ->when($yearSort && $yearSort !== 'Default', function ($query) use ($yearSort) {
                $query->whereYear('created_at', $yearSort);
            })
            ->when($monthSort && $monthSort !== 'Default', function ($query) use ($monthSort) {
                $query->whereMonth('created_at', $monthSort);
            })
            ->distinct()
            ->orderBy('week_number', 'asc')
            ->get()
            ->filter(function ($item) { 
                return !is_null($item->week_number);
            })
            ->map(function ($item) {
                return [
                    'year' => $item->year,
                    'month' => $item->month,
                    'number' => $item->week_number,
                    'name' => "Week " . $item->week_number
                ];
            })
            ->toArray();
        $moderators = User::select([
            'id',
            'first_name',
            'last_name',
        ]) 
        ->orderBy('created_at')
        ->paginate(10);
        $defectives = Defectives::select([
                'defectives.id as defective_id',
                'stocks.id as stock_id',
                'stocks.equipment_name',
                'stocks.serial_number',
                'defectives.item_id',
                'stocks.serial_number',
                'defectives.managers_name',
                'defectives.cluster',
                'defectives.floor',
                'defectives.area',
                'defectives.incident_details',
                'defectives.person_incharge',
                'defectives.status',
                'defectives.note',
                DB::raw("DATE_FORMAT(defectives.created_at, '%m-%d-%Y') as date"),
            ])
            ->join('stocks', 'stocks.id', '=', 'defectives.item_id')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('stocks.equipment_name', 'like', "%{$search}%")
                        ->orWhere('stocks.serial_number', 'like', "%{$search}%")
                        ->orWhere('defectives.floor', 'like', "%{$search}%")
                        ->orWhere('defectives.area', 'like', "%{$search}%")
                        ->orWhere('defectives.person_incharge', 'like', "%{$search}%")
                        ->orWhere('defectives.status', 'like', "%{$search}%");
                });
            })
            ->when($yearSort && $yearSort !== 'Default', function ($query) use ($yearSort) {
                if (is_numeric($yearSort)) {
                    $query->whereYear('defectives.created_at', $yearSort);
                }
            })
            ->when($monthSort && $monthSort !== 'Default', function ($query) use ($monthSort) {
                if (is_numeric($monthSort)) {
                    $query->whereMonth('defectives.created_at', $monthSort); 
                }
            })
            ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
                if (is_numeric($weekSort)) {
                    $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
                }
            })
            ->orderBy('defectives.created_at', 'desc')
            ->paginate(10);
        $defectiveItemIds = Defectives::pluck('item_id')->toArray();
        $stocks = Stocks::whereNotIn('id', $defectiveItemIds)->get();
        return Inertia::render('Defective/Defective', [
            'user' => Auth::user(),
            'search' => $search,
            'years' => $years,
            'months' => $months,
            'weeks' => $weeks,
            'yearSort' => $yearSort,
            'monthSort' => $monthSort,
            'weekSort' => $weekSort,
            'defectives' => $defectives,
            'stocks' => $stocks,
            'moderators' => $moderators,
        ]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|max:255',
            'item_id' => 'required|array|min:1', 
            'item_id.*' => 'nullable|integer', 
            'managers_name' => 'required|string|max:255',
            'cluster' => 'required|string|max:255',
            'floor' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'incident_details' => 'required|string|max:255',
            'person_incharge' => 'required|string|max:255',
            'note' => 'nullable|string|max:255',
        ]);

        foreach ($validatedData['item_id'] as $itemId) {
            $data = [
                'status' => $validatedData['status'],
                'item_id' => $itemId,
                'managers_name' => $validatedData['managers_name'],
                'cluster' => $validatedData['cluster'],
                'floor' => $validatedData['floor'],
                'area' => $validatedData['area'],
                'incident_details' => $validatedData['incident_details'],
                'person_incharge' => $validatedData['person_incharge'],
                'note' => $validatedData['note'],
            ];
            Defectives::create($data);
        }

        return redirect()->route('defective.index')->with('success', 'Defectives added successfully!');
    }
    public function update(Request $request, $id) {
        $validatedData = $request->validate([
            'item_id' => 'required|integer',
            'managers_name' => 'required|string|max:255',
            'cluster' => 'required|string|max:255',
            'floor' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'incident_details' => 'required|string|max:255',
            'person_incharge' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'note' => 'nullable|string|max:255',
        ]);
        $defective = Defectives::findOrFail($id);
        $defective->update($validatedData);
        return redirect()->route('defective.index')->with('message', 'Defectives updated Successfully!');
    }
    public function destroy($id){
        $defective = Defectives::findOrFail($id);
        $defective->delete();
        return redirect()->route('defective.index')->with('message', 'Defective data has been deleted!');
    }
    public function export(Request $request)
    {
        $yearSort = $request->input('yearSort');
        $monthSort = $request->input('monthSort');
        $weekSort = $request->input('weekSort');
        return Excel::download(new DefectivesExport($yearSort, $monthSort, $weekSort), 'defectives.xlsx');
    }
}
