@component('emails.layout', ['subject' => 'Your reservation has been cancelled'])
    <p style="font-size:13px; text-transform:uppercase; letter-spacing:0.12em; color:#6E2B34; margin:0 0 8px;">Reservation
        cancelled</p>
    <h1 style="font-size:24px; margin:0 0 16px; font-weight:500;">We've cancelled your reservation,
        {{ $booking->user->name }}.</h1>
    <p style="font-size:15px; line-height:1.6; color:#23241F; margin:0 0 24px;">
        This confirms that the following reservation has been cancelled. No further action is needed.
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
            <td style="padding:16px 20px; font-size:14px; color:#7C8B7A;">Original dates</td>
            <td style="padding:16px 20px; font-size:14px; text-align:right;">{{ $booking->check_in->format('M j') }} &ndash;
                {{ $booking->check_out->format('M j, Y') }}</td>
        </tr>
    </table>

    @if ($booking->payment && $booking->payment->payment_status === 'refunded')
        <p style="font-size:14px; line-height:1.6; color:#7C8B7A; margin:0 0 16px;">
            Your payment of ${{ number_format($booking->payment->amount, 2) }} has been marked for refund and should
            appear on your original payment method within a few business days.
        </p>
    @endif

    <p style="font-size:14px; line-height:1.6; color:#7C8B7A; margin:0;">
        We hope to welcome you another time. Browse our rooms whenever you're ready to book again.
    </p>
@endcomponent
