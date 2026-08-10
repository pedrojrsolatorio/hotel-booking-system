<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled tasks
|--------------------------------------------------------------------------
| Requires a cron entry running `php artisan schedule:run` every minute
| in production (see Laravel's deployment docs), or `php artisan schedule:work`
| for local testing.
*/
Schedule::command(\App\Console\Commands\SendCheckInReminders::class)
    ->dailyAt('08:00')
    ->name('send-checkin-reminders')
    ->withoutOverlapping();
