<?php
namespace App\Services;

class StripeService
{
    public static function createPaymentIntent($amount, $currency = 'usd')
    {
        // amount: decimal in major units (e.g., 12.34).
        try {
            $key = env('STRIPE_SECRET');
            if (!$key) return null;
            $client = new \Stripe\StripeClient($key);
            $pi = $client->paymentIntents->create([
                'amount' => (int) round($amount * 100),
                'currency' => $currency,
                'payment_method_types' => ['card']
            ]);
            return $pi->id;
        } catch (\Throwable $e) {
            \Log::error('Stripe createPaymentIntent error: '.$e->getMessage());
            return null;
        }
    }
}
