<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WinnerNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $transaction;
    public function __construct($transaction)
    {
        $this->transaction = $transaction;
    }

    public function build()
    {
        return $this->subject('Has ganado una subasta en El Ropero')
                    ->view('emails.winner')
                    ->with(['tx' => $this->transaction]);
    }
}
