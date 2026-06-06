# SwiftPay Mobile

SwiftPay is a mobile money-transfer demo built with Expo React Native and a Laravel Sanctum API. Users can register, sign in, view their balance, send money by SwiftPay ID/email/phone, review transactions, and share a QR code for receiving payments.

Newly registered demo accounts receive a starter balance so the transfer flow can be tested immediately.

## Structure

```text
swiftpaymobile/
  mobile/     Expo React Native app
  backend/    Laravel API with Sanctum auth
```

## Mobile Setup

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env` to the Laravel API URL:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:8000/api
```

Use your computer LAN IP for a physical phone. Android emulator can use `http://10.0.2.2:8000/api`; iOS simulator and web can use `http://localhost:8000/api`.

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API runs at `http://localhost:8000/api` by default.

## API Features

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/dashboard`
- `POST /api/transactions/send`
- `GET /api/transactions`
- `GET /api/user/me`
- `GET /api/user/search`

## Portfolio Notes

This repo intentionally keeps dependencies out of Git. Install mobile dependencies with `npm install` and backend dependencies with `composer install`.
