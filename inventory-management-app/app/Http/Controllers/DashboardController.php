<?php

namespace App\Http\Controllers;

use App\Models\Defectives;
use App\Models\Stocks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use DB;

class DashboardController extends Controller
{
    public function index (Request $request){
        $yearSort = $request->input('yearSort');
        $monthSort = $request->input('monthSort');
        $weekSort = $request->input('weekSort');

        $years = Defectives::selectRaw('YEAR(created_at) as year')
            ->union(Stocks::selectRaw('YEAR(created_at) as year')->toBase())
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        $months = Defectives::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month')
            ->union(Stocks::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month')->toBase())
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
            ->union(Stocks::selectRaw("
                YEAR(created_at) as year, 
                MONTH(created_at) as month, 
                WEEK(created_at, 1) - WEEK(DATE_SUB(created_at, INTERVAL DAY(created_at)-1 DAY), 1) + 1 as week_number
            ")->toBase())
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
            $stocks = Stocks::select(
                    'equipment_name',
                    DB::raw('COUNT(*) as total_count') 
                )
                ->whereNotIn('id', function ($query) {
                    $query->select('item_id')->from('defectives');
                })
                ->when($yearSort && $yearSort !== 'Default', function ($query) use ($yearSort) {
                    if (is_numeric($yearSort)) {
                        $query->whereYear('created_at', $yearSort);
                    }
                })
                ->when($monthSort && $monthSort !== 'Default', function ($query) use ($monthSort) {
                    if (is_numeric($monthSort)) {
                        $query->whereMonth('created_at', $monthSort);
                    }
                })
                ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
                    if (is_numeric($weekSort)) {
                        $query->whereRaw('WEEK(created_at, 1) - WEEK(DATE_SUB(created_at, INTERVAL DAY(created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
                    }
                })
                ->groupBy('equipment_name') 
                ->get();
            $defectives = Defectives::select([
                    'stocks.equipment_name',
                    DB::raw('COUNT(defectives.id) as total_count')
                ])
                ->join('stocks', 'stocks.id', '=', 'defectives.item_id')
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
                ->groupBy('stocks.equipment_name')
                ->get();
        $defectiveCount = Defectives::when($yearSort && $yearSort !== 'Default', function ($query) use ($yearSort) {
                if (is_numeric($yearSort)) {
                    $query->whereYear('created_at', $yearSort);
                }
            })
            ->when($monthSort && $monthSort !== 'Default', function ($query) use ($monthSort) {
                if (is_numeric($monthSort)) {
                    $query->whereMonth('created_at', $monthSort);
                }
            })
            ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
                if (is_numeric($weekSort)) {
                        $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
                }
            })
            ->count();
        $stockCount = Stocks::when($yearSort && $yearSort !== 'Default', function ($query) use ($yearSort) {
                if (is_numeric($yearSort)) {
                    $query->whereYear('created_at', $yearSort);
                }
            })
            ->when($monthSort && $monthSort !== 'Default', function ($query) use ($monthSort) {
                if (is_numeric($monthSort)) {
                    $query->whereMonth('created_at', $monthSort);
                }
            })
            ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
                if (is_numeric($weekSort)) {
                        $query->whereRaw('WEEK(stocks.created_at, 1) - WEEK(DATE_SUB(stocks.created_at, INTERVAL DAY(stocks.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
                }
            })
            ->whereNotIn('id', function ($query) {
                $query->select('item_id')->from('defectives');
            }) 
            ->count();
        $defectiveData = Defectives::selectRaw(
            ($monthSort && $monthSort !== 'Default') 
                ? 'DAY(created_at) as period, COUNT(*) as total_quantity' 
                : (($yearSort && $yearSort !== 'Default') 
                    ? 'MONTH(created_at) as period, COUNT(*) as total_quantity' 
                    : 'YEAR(created_at) as period, COUNT(*) as total_quantity'
                )
        )
        ->when(is_numeric($yearSort) && $yearSort !== 'Default', function ($query) use ($yearSort) {
            $query->whereYear('created_at', $yearSort);
        })
        ->when($monthSort && $monthSort !== 'Default', function ($query) use ($monthSort) {
            if (is_numeric($monthSort)) {
                $query->whereMonth('created_at', (int) $monthSort);
            }
        })
        ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
            if (is_numeric($weekSort)) {
               $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
            }
        })
        ->groupBy('period')
        ->orderBy('period', 'asc')
        ->get()
        ->map(function ($item) use ($monthSort, $yearSort) {
            if ($yearSort && $yearSort !== 'Default' && (!$monthSort || $monthSort === 'Default')) {
                $months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                $item->period = $months[$item->period - 1] ?? $item->period;
            }
            return $item;
        });
        $floorAreaDefectiveData = Defectives::selectRaw(
            ($monthSort && $monthSort !== 'Default') 
                ? 'DAY(created_at) as period, floor, area, COUNT(*) as total_quantity' 
                : 'floor, area, COUNT(*) as total_quantity'
        )
        ->when(is_numeric($yearSort) && $yearSort !== 'Default', function ($query) use ($yearSort) {
            $query->whereYear('created_at', $yearSort);
        })
        ->when(is_numeric($monthSort) && $monthSort !== 'Default', function ($query) use ($monthSort) {
            $query->whereMonth('created_at', $monthSort);
        })
        ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
            if (is_numeric($weekSort)) {
               $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
            }
        })
        ->groupByRaw(($monthSort && $monthSort !== 'Default') 
            ? 'DAY(created_at), floor, area'  
            : 'floor, area'         
        )
        ->when($monthSort && $monthSort !== 'Default', function ($query) {
            $query->orderByRaw('DAY(created_at) asc');
        })
        ->get();
        $floorDefectiveData = Defectives::selectRaw(
            ($monthSort && $monthSort !== 'Default') 
                ? 'DAY(created_at) as period, floor, COUNT(*) as total_quantity' 
                : 'floor, COUNT(*) as total_quantity'
        )
        ->when(is_numeric($yearSort) && $yearSort !== 'Default', function ($query) use ($yearSort) {
            $query->whereYear('created_at', $yearSort);
        })
        ->when(is_numeric($monthSort) && $monthSort !== 'Default', function ($query) use ($monthSort) {
            $query->whereMonth('created_at', $monthSort);
        })
        ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
            if (is_numeric($weekSort)) {
               $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
            }
        })
        ->groupByRaw(($monthSort && $monthSort !== 'Default') 
            ? 'DAY(created_at), floor'  
            : 'floor'         
        )
        ->when($monthSort && $monthSort !== 'Default', function ($query) {
            $query->orderByRaw('DAY(created_at) asc');
        })
        ->get();
        $equipmentFloorAreaDefectiveData = Defectives::selectRaw(
            ($monthSort && $monthSort !== 'Default') 
                ? 'DAY(defectives.created_at) as period, stocks.equipment_name, defectives.floor, defectives.area, COUNT(defectives.id) as total_defectives' 
                : 'stocks.equipment_name, defectives.floor, defectives.area, COUNT(defectives.id) as total_defectives'
        )
        ->join('stocks', 'defectives.item_id', '=', 'stocks.id')
        ->when(is_numeric($yearSort) && $yearSort !== 'Default', function ($query) use ($yearSort) {
            $query->whereYear('defectives.created_at', $yearSort);
        })
        ->when(is_numeric($monthSort) && $monthSort !== 'Default', function ($query) use ($monthSort) {
            $query->whereMonth('defectives.created_at', $monthSort);
        })
        ->when($weekSort && $weekSort !== 'Default', function ($query) use ($weekSort) {
            if (is_numeric($weekSort)) {
               $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$weekSort]);
            }
        })
        ->groupByRaw(($monthSort && $monthSort !== 'Default') 
            ? 'DAY(defectives.created_at), stocks.equipment_name, defectives.floor, defectives.area'  
            : 'stocks.equipment_name, defectives.floor, defectives.area'
        )
        ->when($monthSort && $monthSort !== 'Default', function ($query) {
            $query->orderByRaw('DAY(defectives.created_at) asc');
        })
        ->get();
        $user = Auth::user();
        return Inertia::render('Dashboard/Dashboard', [
            'stocks' => $stocks,
            'defectives' => $defectives,
            'user' => $user,
            'yearSort' => $yearSort,
            'monthSort' => $monthSort,
            'weekSort' => $weekSort,
            'defectiveCount' => $defectiveCount,
            'stockCount' => $stockCount,
            'defectiveData' => $defectiveData,
            'floorAreaDefectiveData' => $floorAreaDefectiveData,
            'years' => $years,
            'months' => $months,
            'weeks' => $weeks,
            'floorDefectiveData' => $floorDefectiveData,
            'equipmentFloorAreaDefectiveData' => $equipmentFloorAreaDefectiveData,
        ]);
    }
}
