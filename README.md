# Verity House — Hotel Booking Platform

A full-stack, portfolio-ready hotel booking platform built with **Laravel 12, Inertia.js, React, and TypeScript**, with a Gemini-powered AI booking assistant.

## Quick start

### Requirements

- Docker Desktop
- Git

Clone the repository:

```bash
git clone <repository-url>
cd hotel-booking-platform
```

Install the PHP dependencies using Laravel Sail:

```bash
./vendor/bin/sail composer install
```

Copy the environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
./vendor/bin/sail artisan key:generate
```

Start the Docker environment:

```bash
./vendor/bin/sail up -d
```

Install frontend dependencies:

```bash
./vendor/bin/sail npm install
```

Run migrations and seed the database:

```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

Create the storage symlink:

```bash
./vendor/bin/sail artisan storage:link
```

The application should now be available at:

```text
http://localhost
```

Run the Vite development server:

```bash
./vendor/bin/sail npm run dev
```

### Environment configuration

For local email/queue testing:

```env
MAIL_MAILER=log
QUEUE_CONNECTION=sync
```

To enable the Gemini-powered booking assistant:

```env
GEMINI_API_KEY=your_api_key
```

The chatbot degrades gracefully when no Gemini API key is configured.

### Seeded accounts

**Admin**

```text
Email: admin@gmail.com
Password: password
```

**Customer**

```text
Email: customer@gmail.com
Password: password
```

## Common Sail commands

Start the application:

```bash
./vendor/bin/sail up -d
```

Stop the application:

```bash
./vendor/bin/sail down
```

View application logs:

```bash
./vendor/bin/sail logs -f
```

Run Artisan commands:

```bash
./vendor/bin/sail artisan <command>
```

Run Composer:

```bash
./vendor/bin/sail composer <command>
```

Run npm commands:

```bash
./vendor/bin/sail npm <command>
```

Run tests:

```bash
./vendor/bin/sail artisan test
```

## Project structure

```text
app/
  Console/Commands/     SendCheckInReminders
  Events/               BookingCreated, BookingCancelled
  Exceptions/           RoomUnavailableException
  Http/Controllers/     Public + Auth controllers
    Admin/              Dashboard, Rooms, Bookings, Users
    Api/                ChatController
  Http/Requests/         Form validation per action
  Http/Resources/       RoomResource, RoomImageResource, BookingResource
  Listeners/            Email listeners for booking events
  Mail/                 BookingConfirmed, BookingCancelled, BookingReminder
  Models/                User, Room, RoomImage, Booking, Payment, Faq, Chat*
  Policies/             RoomPolicy, BookingPolicy
  Services/             RoomService, BookingService, GeminiService

database/
  migrations/
  factories/
  seeders/

resources/
  css/app.css           Brand tokens, key-tag component, animations
  js/Components/        RoomCard, RoomSearchForm, ChatWidget, Admin/RoomForm
  js/Layouts/           PublicLayout, AdminLayout
  js/Pages/              Home, Rooms/*, Bookings/*, Admin/*
  views/emails/         Branded transactional email templates
  views/errors/         Branded 404/403 pages

routes/
  web.php               All routes
  console.php            Scheduled check-in reminders
```

## API / route reference

### Public

| Method | URI                         | Description                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | `/`                         | Homepage with featured rooms |
| GET    | `/rooms`                    | Room listing with filters    |
| GET    | `/rooms/{room:slug}`        | Room details + booking form  |
| POST   | `/chat`                     | Send a chatbot message       |
| GET    | `/chat/history?session_id=` | Restore chat history         |

### Authenticated customer

| Method           | URI                          | Description           |
| ---------------- | ---------------------------- | --------------------- |
| GET              | `/dashboard`                 | Customer landing page |
| GET/PATCH/DELETE | `/profile`                   | Profile management    |
| GET              | `/bookings`                  | My bookings           |
| POST             | `/bookings`                  | Create a booking      |
| GET              | `/bookings/{booking}`        | Booking details       |
| PATCH            | `/bookings/{booking}/cancel` | Cancel a booking      |

### Admin

| Method                | URI                                | Description                |
| --------------------- | ---------------------------------- | -------------------------- |
| GET                   | `/admin/dashboard`                 | Stats + charts             |
| GET/POST/PATCH/DELETE | `/admin/rooms...`                  | Room CRUD                  |
| GET                   | `/admin/bookings`                  | Search/filter bookings     |
| PATCH                 | `/admin/bookings/{booking}/status` | Change booking status      |
| DELETE                | `/admin/bookings/{booking}`        | Remove a booking           |
| GET                   | `/admin/users`                     | Search users               |
| PATCH                 | `/admin/users/{user}/role`         | Toggle admin/customer role |
