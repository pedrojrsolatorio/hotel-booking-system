<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access restricted — Verity House</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Inter:wght@400;500&display=swap"
        rel="stylesheet">
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1B2E28;
            color: #F7F3EA;
            font-family: 'Inter', sans-serif;
            text-align: center;
            padding: 24px;
        }

        h1 {
            font-family: 'Fraunces', serif;
            font-weight: 500;
            font-style: italic;
            font-size: clamp(3rem, 10vw, 6rem);
            margin: 0;
            color: #6E2B34;
        }

        p {
            margin: 12px 0 28px;
            color: rgba(247, 243, 234, 0.7);
        }

        a {
            display: inline-block;
            background: #B08D57;
            color: #1B2E28;
            padding: 12px 28px;
            border-radius: 14px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>

<body>
    <div>
        <h1>403</h1>
        <p>{{ $exception->getMessage() ?: 'This area is restricted.' }}</p>
        <a href="/">Back to Verity House</a>
    </div>
</body>

</html>
