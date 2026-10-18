<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transaction;
use App\Mail\WinnerNotification;
use Illuminate\Support\Facades\Mail;

class NotifyWinners extends Command
{
    protected $signature = 'auctions:notify-winners';
    protected $description = 'Send emails to winners of closed auctions for pending transactions';

    public function handle()
    {
        $txs = Transaction::where('status','pending')->get();
        foreach ($txs as $tx) {
            Mail::to($tx->buyer->email ?? null)->queue(new WinnerNotification($tx));
            $this->info("Queued notification for tx {$tx->id}");
        }
        return 0;
    }
}
