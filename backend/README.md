# SwiftPay Backend

Laravel API for the SwiftPay Expo mobile app.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Configure MySQL in `.env` before running migrations.

## Endpoints

Public:

- `POST /api/register`
- `POST /api/login`

Authenticated with `Bearer <token>`:

- `POST /api/logout`
- `GET /api/dashboard`
- `POST /api/transactions/send`
- `GET /api/transactions`
- `GET /api/user/me`
- `GET /api/user/search?identifier=...`

## Notes

- Authentication uses Laravel Sanctum personal access tokens.
- Transfers are wrapped in a database transaction and lock user rows before balance updates.
- New demo users start with a balance of `1000.00` so the mobile flow can be tested immediately.
