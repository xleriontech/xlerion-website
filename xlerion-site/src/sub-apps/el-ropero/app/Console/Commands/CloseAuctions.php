<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class CloseAuctions extends Command
{
    protected $signature = 'auctions:close';
    protected $description = 'Close expired auctions and generate transactions (sandbox)';

    public function handle()
    {
        $now = now();
        $auctions = Auction::where('status','open')->where('ends_at','<=',$now)->get();
        foreach ($auctions as $a) {
            $this->info("Closing auction {$a->id}");
            $a->status = 'closed';
            $a->save();

            $winnerBid = $a->bids()->orderBy('amount','desc')->first();
            if ($winnerBid) {
                $tx = Transaction::create([
                    'auction_id'=>$a->id,
                    'buyer_id'=>$winnerBid->user_id,
                    'amount'=>$winnerBid->amount,
                    'status'=>'pending',
                    'stripe_payment_id'=>null
                ]);
                // Attempt to create a Stripe PaymentIntent (sandbox) if configured
                try {
                    $pi = \App\Services\StripeService::createPaymentIntent($tx->amount, env('STRIPE_CURRENCY','usd'));
                    if ($pi) {
                        $tx->stripe_payment_id = $pi;
                        $tx->save();
                    }
                } catch (\Throwable $e) {
                    Log::error('Stripe PI create failed: '.$e->getMessage());
                }

                // Queue email notification to the winner
                try {
                    \Illuminate\Support\Facades\Mail::to($winnerBid->user->email)->queue(new \App\Mail\WinnerNotification($tx));
                } catch (\Exception $e) {
                    Log::error('Failed to queue winner email: '.$e->getMessage());
                }

                Log::info("Auction {$a->id} winner: user {$winnerBid->user_id}, tx {$tx->id}");
            } else {
                Log::info("Auction {$a->id} closed with no bids.");
            }
        }
        return 0;
    }
}
