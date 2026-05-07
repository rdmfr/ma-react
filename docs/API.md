# API

Base URL (lokal): `http://127.0.0.1:8000/api`

Auth menggunakan token Bearer yang disimpan di frontend (lihat [backend.js](file:///c:/Nitip%20Fadhil/ma-react/frontend/src/lib/backend.js)).

## Health
- `GET /health`
  - Response: `{ "status": "ok" }`

## Auth
- `POST /auth/login`
  - Body:
    - `email` (string)
    - `password` (string)
  - Response:
    - `token` (string)
    - `user` (object)

- `GET /auth/me` (auth)
- `POST /auth/logout` (auth)

## Profile
- `PUT /profile` (auth)
  - Body (opsional): `name`, `email`, `avatar_url`, `phone`, `bio`, `class_name`, `position`

## Public
- `GET /public/bootstrap`
- `POST /public/contact`
- `POST /public/ppdb`

## Dashboard
- `GET /dashboard/bootstrap` (auth)

## Records (Generic CRUD)
Model generik: satu tabel `records` untuk menampung berbagai fitur CRUD berbasis `type` + `data` JSON.

- `GET /records` (auth)
  - Query:
    - `type` (string)
    - `limit` (number, default 1000 di frontend)

- `POST /records` (auth)
  - Body: `{ "type": "someType", "data": { ... } }`

- `GET /records/{id}` (auth)
- `PUT /records/{id}` (auth)
  - Body: `{ "data": { ... } }`
- `DELETE /records/{id}` (auth)

## Admin: Users
Hanya untuk role `admin`.
- `GET /admin/users` (auth, role:admin)
- `POST /admin/users` (auth, role:admin)
- `PUT /admin/users/{id}` (auth, role:admin)
- `DELETE /admin/users/{id}` (auth, role:admin)
