<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DefectiveController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StocksController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::controller(LoginController::class)->group(function () {
    Route::get('/login', 'index')->name('login');
    Route::post('/login', 'login')->name('login.login');
    Route::post('/logout', 'logout')->name('logout.logout');
});

Route::middleware(['auth'])->group(function () {
    Route::controller(DashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('dashboard.index');
    });

    Route:: controller(SupplierController::class)->group(function () {
        Route::get('/supplier', 'index')->name('supplier.index');
        Route::post('/supplier', 'store')->name('supplier.store');
        Route::put('/supplier/{id}', 'update')->name('supplier.update');
        Route::delete('/supplier/{id}', 'destroy')->name('supplier.destroy');
    });

    Route::controller(CategoryController::class)->group(function () {
        Route::get('/category', 'index')->name('category.index');
        Route::post('/category', 'store')->name('category.store');
        Route::put('/category/{id}', 'update')->name('category.update');
        Route::delete('/category/{id}', 'destroy')->name('category.destroy');
        Route::post('/category/{id}', 'insertToStocks')->name('category.insertToStocks');
    });

    Route::controller(StocksController::class)->group(function () {
        Route::get('/stocks', 'index')->name('stocks.index');
        Route::post('/stocks', 'store')->name('stocks.store');
        Route::put('/stocks/{id}', 'update')->name('stocks.update');
        Route::delete('/stocks/{id}', 'destroy')->name('stocks.destroy');
    });

    Route::controller(DefectiveController::class)->group(function () {
        Route::get('/defective', 'index')->name('defective.index');
        Route::post('/defective', 'store')->name('defective.store');
        Route::put('/defective/{id}', 'update')->name('defective.update');
        Route::delete('/defective/{id}', 'destroy')->name('defective.destroy');
        Route::get('/defective/export', 'export')->name('defective.export');
    });

    Route::controller(UsersController::class)->group(function () {
        Route::get('/users', 'index')->name('users.index');
        Route::post('/users', 'store')->name('users.store');
        Route::put('/users/{id}', 'update')->name('users.update');
        Route::delete('/users/{id}', 'destroy')->name('users.destroy');
    });

    Route::controller(SettingsController::class)->group(function () {
        Route::get('/settings', 'index')->name('settings.index');
        Route::put('/settings/{id}', 'update')->name('settings.update');
        Route::delete('/settings/{id}', 'destroy')->name('settings.destroy');
    });
});
