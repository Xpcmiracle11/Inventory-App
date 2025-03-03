<?php
namespace App\Exports;

use App\Models\Defectives;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;
use DB;

class DefectivesExport implements FromCollection, WithHeadings, WithMapping
{
    protected $yearSort;
    protected $monthSort;
    protected $weekSort;

    public function __construct($yearSort = null, $monthSort = null, $weekSort = null)
    {
        $this->yearSort = $yearSort;
        $this->monthSort = $monthSort;
        $this->weekSort = $weekSort;
    }

    public function collection()
    {
        return Defectives::leftJoin('stocks', 'defectives.item_id', '=', 'stocks.id')
            ->select(
                'defectives.id',
                DB::raw("CONCAT(stocks.equipment_name, ' - ', stocks.serial_number) AS equipment_details"),
                'defectives.managers_name',
                'defectives.cluster',
                'defectives.floor',
                'defectives.area',
                'defectives.incident_details',
                'defectives.person_incharge',
                'defectives.status',
                'defectives.note',
                'defectives.created_at'
            )
            ->when($this->yearSort && $this->yearSort !== 'Default', function ($query) {
                $query->whereYear('defectives.created_at', $this->yearSort);
            })
            ->when($this->monthSort && $this->monthSort !== 'Default', function ($query) {
                $query->whereMonth('defectives.created_at', $this->monthSort);
            })
            ->when($this->weekSort && $this->weekSort !== 'Default', function ($query) {
                $query->whereRaw('WEEK(defectives.created_at, 1) - WEEK(DATE_SUB(defectives.created_at, INTERVAL DAY(defectives.created_at)-1 DAY), 1) + 1 = ?', [$this->weekSort]);
            })           
            ->orderBy('defectives.created_at', 'desc')
            ->get();
    }
    public function headings(): array
    {
        return [
            'ID',
            'Equipment Name & Serial Number',
            "Manager's Name",
            'Cluster',
            'Floor',
            'Area',
            'Incident Details',
            'Person In-Charge',
            'Status',
            'Note',
            'Date'
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->equipment_details,
            $row->managers_name,
            $row->cluster,
            $row->floor,
            $row->area,
            $row->incident_details,
            $row->person_incharge,
            $row->status,
            $row->note,
            Carbon::parse($row->created_at)->format('F d, Y')
        ];
    }
}
