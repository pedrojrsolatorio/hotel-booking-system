<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Verity House' }}</title>
</head>

<body
    style="margin:0; padding:0; background-color:#F7F3EA; font-family: Georgia, 'Times New Roman', serif; color:#23241F;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="background-color:#F7F3EA; padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0"
                    style="background-color:#ffffff; border:1px solid #E7E0D2; border-radius:14px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#1B2E28; padding:28px 36px;">
                            <span style="color:#F7F3EA; font-size:22px; letter-spacing:0.02em;">Verity House</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px;">
                            {{ $slot }}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="padding:24px 36px; border-top:1px solid #E7E0D2; font-family: Arial, sans-serif; font-size:12px; color:#7C8B7A;">
                            Verity House &middot; reservations@verityhouse.example &middot; +1 (555) 019-2044
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
