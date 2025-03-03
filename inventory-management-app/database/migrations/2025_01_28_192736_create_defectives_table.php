for<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('defectives', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('item_id');
            $table->string('managers_name');
            $table->string('cluster');
            $table->string('floor');
            $table->string('area');
            $table->string('incident_details');
            $table->string('person_incharge');
            $table->string('status');
            $table->string('note')->nullable();
            $table->timestamps();
            $table->foreign('item_id')->references('id')->on('stocks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('defectives');
    }
};
