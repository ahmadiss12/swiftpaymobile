<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone_number')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('swiftpay_id')->unique();
            $table->decimal('balance', 10, 2)->default(0.00);
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
            $table->index('phone_number');
            $table->index('swiftpay_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
