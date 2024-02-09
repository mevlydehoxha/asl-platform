<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailTestController extends Controller
{
    public function testMail()
    {
        Mail::raw('Test email content', function ($message) {
            $message->to('mevlydeihoxha@gmail.com');
            $message->subject('Test Email');
        });

        return "Test email sent.";
    }
}
