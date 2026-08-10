@component('emails.layout', ['subject' => 'Your reservation is confirmed'])
    <p style="font-size:13px; text-transform:uppercase; letter-spacing:0.12em; color:#B08D57; margin:0 0 8px;">Reservation
        confirmed</p>
    <h1 style="font-size:24px; margin:0 0 16px; font-weight:500;">Thank you, {{ $booking->user->name }}.</h1>
    <p style="font-size:15px; line-height:1.6; color:#23241F; margin:0 0 24px;">
        Your room at Verity House is booked. Here's everything on file for your stay:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="border:1px solid #E7E0D2; border-radius:10px; margin-bottom:24px;">
        <tr>
            <td
                style="padding:16px 20px; font-family: 'Courier New', monospace; font-size:13px; color:#7C8B7A; border-bottom:1px solid #E7E0D2;">
                Reference</td>
            <td
                style="padding:16px 20px; font-family: 'Courier New', monospace; font-size:13px; text-align:right; border-bottom:1px solid #E7E0D2;">
                {{ $booking->booking_reference }}</td>
        </tr>
        <tr>
            <td style="padding:16px 20px; font-size:14px; color:#7C8B7A; border-bottom:1px solid #E7E0D2;">Room</td>
            <td style="padding:16px 20px; font-size:14px; text-align:right; border-bottom:1px solid #E7E0D2;">
                {{ $booking->room->name }}</td>
        </tr>
        <tr>
            <td style="padding:16px 20px; font-size:14px; color:#7C8B7A; border-bottom:1px solid #E7E0D2;">Check in</td>
            <td style="padding:16px 20px; font-size:14px; text-align:right; border-bottom:1px solid #E7E0D2;">
                {{ $booking->check_in->format('D, M j Y') }}, from 2:00 PM</td>
        </tr>
        <tr>
            <td style="padding:16px 20px; font-size:14px; color:#7C8B7A; border-bottom:1px solid #E7E0D2;">Check out</td>
            <td style="padding:16px 20px; font-size:14px; text-align:right; border-bottom:1px solid #E7E0D2;">
                {{ $booking->check_out->format('D, M j Y') }}, by 12:00 PM</td>
        </tr>
        <tr>
            <td style="padding:16px 20px; font-size:14px; color:#7C8B7A; border-bottom:1px solid #E7E0D2;">Guests</td>
            <td style="padding:16px 20px; font-size:14px; text-align:right; border-bottom:1px solid #E7E0D2;">
                {{ $booking->guests }}</td>
        </tr>
        @if ($booking->special_requests)
            <tr>
                <td style="padding:16px 20px; font-size:14px; color:#7C8B7A; border-bottom:1px solid #E7E0D2;">Special
                    requests</td>
                <td style="padding:16px 20px; font-size:14px; text-align:right; border-bottom:1px solid #E7E0D2;">
                    {{ $booking->special_requests }}</td>
            </tr>
        @endif
        <tr>
            <td style="padding:16px 20px; font-size:15px; font-weight:bold;">Total</td>
            <td style="padding:16px 20px; font-size:15px; font-weight:bold; text-align:right;">
                ${{ number_format($booking->total_price, 2) }}</td>
        </tr>
    </table>

    <p style="font-size:14px; line-height:1.6; color:#7C8B7A; margin:0;">
        You can view or cancel this reservation any time from your account. We look forward to having you.
    </p>
@endcomponent
