# API Documentation - PERON.ID E-Commerce

Dokumentasi lengkap untuk semua API endpoint yang tersedia di aplikasi PERON.ID.

**Base URL:** `https://tubesecommerce.vercel.app`

**Environment:** Production

**API Response Format:** All APIs follow company standard with consistent response structure

---

## 📐 Standard Response Format

All API responses follow this standardized format:

### Success Response
```json
{
  "code": 200,
  "status": "success",
  "message": "Success message here",
  "data": {
    // Response data object
  }
}
```

### Error Response
```json
{
  "code": 400,
  "status": "error",
  "message": "Error message here",
  "errors": {
    // Optional: Additional error details
  }
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Internal Server Error | Server error |

---

## 📋 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Product APIs](#product-apis)
4. [Category APIs](#category-apis)
5. [Shipping APIs](#shipping-apis)
6. [Payment APIs](#payment-apis)
7. [Error Codes](#error-codes)

---

## 🔐 Authentication APIs

### 1. Register User

Membuat akun user baru.

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Parameter yang dibutuhkan:**

| nama     | wajib | keterangan                           |
| -------- | ----- | ------------------------------------ |
| name     | Y     | nama lengkap                         |
| email    | Y     | email dengan format yang valid       |
| password | Y     | password, minimal 6 karakter         |

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

**Success Response (200 OK):**
```json
{
  "code": 201,
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "clxyz12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-11-25T10:30:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 400 | `{ "code": 400, "status": "error", "message": "Email already registered" }` | Email sudah digunakan |
| 400 | `{ "code": 400, "status": "error", "message": "Name, email, and password are required" }` | Field required kosong |
| 500 | `{ "code": 500, "status": "error", "message": "Failed to create user" }` | Server error |

**Example cURL:**
```bash
curl -X POST https://tubesecommerce.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 2. Login User

Login menggunakan NextAuth credentials provider.

**Endpoint:** `POST /api/auth/signin`

**Note:** Menggunakan NextAuth.js, akses melalui form login di `/login` atau gunakan NextAuth API.

**Credentials:**
- Email: `admin@peron.id`
- Password: `admin123`

**Session Management:**
- JWT-based authentication
- Session disimpan di cookie: `next-auth.session-token`
- Expire time: 30 days

---

### 3. Logout User

Logout dan hapus session.

**Endpoint:** `GET /api/auth/signout`

**Method:** GET atau POST

**Response:** Redirect ke homepage

---

## 👤 User APIs

### 1. Get User Profile

Mendapatkan data profil user yang sedang login.

**Endpoint:** `GET /api/user/profile`

**Authentication:** Required (Session Cookie)

**Headers:**
```
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Success Response (200 OK):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "id": "clxyz12345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Sudirman No. 1, Jakarta",
    "role": "USER"
  }
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 401 | `{ "code": 401, "status": "error", "message": "Unauthorized" }` | Belum login atau session expired |
| 404 | `{ "code": 404, "status": "error", "message": "User not found" }` | User tidak ditemukan di database |
| 500 | `{ "code": 500, "status": "error", "message": "Failed to fetch profile" }` | Server error |

**Example cURL:**
```bash
curl -X GET https://tubesecommerce.vercel.app/api/user/profile \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

### 2. Update User Profile

Update data profil user (nama, telepon, alamat).

**Endpoint:** `PATCH /api/user/profile`

**Authentication:** Required (Session Cookie)

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Parameter yang dibutuhkan:**

| nama    | wajib | keterangan                           |
| ------- | ----- | ------------------------------------ |
| name    | T     | nama lengkap                         |
| phone   | T     | nomor telepon                        |
| address | T     | alamat lengkap                       |

**Request Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

**Success Response (200 OK):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "id": "clxyz12345",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "08199999999",
    "address": "Jl. Thamrin No. 5, Jakarta",
    "role": "USER"
  }
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 401 | `{ "code": 401, "status": "error", "message": "Unauthorized" }` | Belum login |
| 500 | `{ "code": 500, "status": "error", "message": "Failed to update profile" }` | Server error |

**Example cURL:**
```bash
curl -X PATCH https://tubesecommerce.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "name": "John Doe Updated",
    "phone": "08199999999",
    "address": "Jl. Thamrin No. 5, Jakarta"
  }'
```

---

## 🛍️ Product APIs

### 1. Get All Products

Mendapatkan daftar semua produk dengan filter opsional.

**Endpoint:** `GET /api/products`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Pencarian berdasarkan nama produk |
| `category` | string | No | Filter berdasarkan category ID |

**Success Response (200 OK):**
```json
[
  {
    "id": "clxyz123",
    "name": "Montana Gold 400ml",
    "description": "Premium spray paint for street art",
    "price": 85000,
    "stock": 50,
    "images": "https://drive.google.com/...",
    "categoryId": "clcat123",
    "category": {
      "id": "clcat123",
      "name": "Spray Paint"
    },
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

**Example Requests:**
```bash
# Get all products
curl https://tubesecommerce.vercel.app/api/products

# Search products
curl https://tubesecommerce.vercel.app/api/products?search=montana

# Filter by category
curl https://tubesecommerce.vercel.app/api/products?category=clcat123
```

---

### 2. Get Product by ID

Mendapatkan detail produk berdasarkan ID.

**Endpoint:** `GET /api/products/[id]`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product ID |

**Success Response (200 OK):**
```json
{
  "id": "clxyz123",
  "name": "Montana Gold 400ml",
  "description": "Premium spray paint for street art with excellent coverage and vibrant colors",
  "price": 85000,
  "stock": 50,
  "images": "https://drive.google.com/...",
  "categoryId": "clcat123",
  "category": {
    "id": "clcat123",
    "name": "Spray Paint"
  },
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 404 | `{ "error": "Product not found" }` | Product tidak ditemukan |

**Example cURL:**
```bash
curl https://tubesecommerce.vercel.app/api/products/clxyz123
```

---

## 📂 Category APIs

### 1. Get All Categories

Mendapatkan daftar semua kategori produk.

**Endpoint:** `GET /api/categories`

**Success Response (200 OK):**
```json
[
  {
    "id": "clcat123",
    "name": "Spray Paint",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  },
  {
    "id": "clcat456",
    "name": "Marker and Ink",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

**Example cURL:**
```bash
curl https://tubesecommerce.vercel.app/api/categories
```

---

## 🚚 Shipping APIs

### 1. Calculate Shipping Rates

Menghitung tarif pengiriman menggunakan Biteship API.

**Endpoint:** `POST /api/shipping/rates`

**Headers:**
```
Content-Type: application/json
```

**Parameter yang dibutuhkan:**

| nama                     | wajib | keterangan                               |
| ------------------------ | ----- | ---------------------------------------- |
| destination_postal_code  | Y     | kode pos tujuan, 5 digit angka           |
| items                    | Y     | array of items (produk)                  |
| items[].id               | Y     | ID produk                                |
| items[].name             | Y     | nama produk                              |
| items[].price            | Y     | harga produk (number)                    |
| items[].quantity         | Y     | jumlah produk (number)                   |

**Request Body:**
```json
{
  "destination_postal_code": "string (required, 5 digits)",
  "items": [
    {
      "id": "string (required)",
      "name": "string (required)",
      "price": "number (required)",
      "quantity": "number (required)"
    }
  ]
}
```

**Success Response (200 OK):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Shipping rates calculated successfully",
  "data": [
    {
      "available_for_cash_on_delivery": false,
      "available_for_proof_of_delivery": false,
      "available_for_instant_waybill_id": true,
      "courier_name": "JNE",
      "courier_code": "jne",
      "courier_service_name": "REG",
      "courier_service_code": "reg",
      "description": "Layanan Reguler",
      "duration": "2-3 hari",
      "shipment_duration_range": "2-3",
      "shipment_duration_unit": "days",
      "service_type": "standard",
      "shipping_type": "parcel",
      "price": 15000,
      "type": "overnight"
    },
    {
      "courier_name": "JNT",
      "courier_code": "jnt",
      "courier_service_name": "EZ",
      "price": 12000,
      "duration": "3-4 hari"
    }
  ]
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 400 | `{ "code": 400, "status": "error", "message": "Destination postal code and items are required" }` | Field required kosong |
| 400 | `{ "code": 400, "status": "error", "message": "Invalid postal code" }` | Kode pos tidak valid |
| 500 | `{ "code": 500, "status": "error", "message": "Failed to calculate shipping rates" }` | Server error atau Biteship API error |

**Notes:**
- Origin postal code: `12920` (Jakarta Pusat)
- Weight calculation: 500g per item
- Supported couriers: JNE, JNT, SiCepat, AnterAja, Ninja Express

**Example cURL:**
```bash
curl -X POST https://tubesecommerce.vercel.app/api/shipping/rates \
  -H "Content-Type: application/json" \
  -d '{
    "destination_postal_code": "10110",
    "items": [
      {
        "id": "clxyz123",
        "name": "Montana Gold 400ml",
        "price": 85000,
        "quantity": 2
      }
    ]
  }'
```

---

## 💳 Payment APIs

### 1. Create Payment

Membuat transaksi payment menggunakan Midtrans Snap.

**Endpoint:** `POST /api/payment/create`

**Authentication:** Required (Session Cookie)

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Parameter yang dibutuhkan:**

| nama                          | wajib | keterangan                               |
| ----------------------------- | ----- | ---------------------------------------- |
| items                         | Y     | array of items (produk yang dibeli)      |
| items[].productId             | Y     | ID produk                                |
| items[].name                  | Y     | nama produk                              |
| items[].price                 | Y     | harga produk (number)                    |
| items[].quantity              | Y     | jumlah produk (number)                   |
| total                         | Y     | total pembayaran (number)                |
| address                       | Y     | alamat pengiriman lengkap                |
| shipping                      | Y     | object shipping information              |
| shipping.courier_name         | Y     | nama kurir (JNE, JNT, dll)               |
| shipping.courier_service_name | Y     | nama layanan kurir (REG, EXPRESS, dll)   |
| shipping.price                | Y     | harga ongkir (number)                    |

**Request Body:**
```json
{
  "items": [
    {
      "productId": "string (required)",
      "name": "string (required)",
      "price": "number (required)",
      "quantity": "number (required)"
    }
  ],
  "total": "number (required)",
  "address": "string (required)",
  "shipping": {
    "courier_name": "string (required)",
    "courier_service_name": "string (required)",
    "price": "number (required)"
  }
}
```

**Success Response (200 OK):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Payment created successfully",
  "data": {
    "token": "abc123-def456-ghi789",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v3/redirection/abc123",
    "order_id": "ORDER-1732531200000-abc123"
  }
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 401 | `{ "code": 401, "status": "error", "message": "Unauthorized" }` | Belum login |
| 404 | `{ "code": 404, "status": "error", "message": "User not found" }` | User tidak ditemukan |
| 500 | `{ "code": 500, "status": "error", "message": "Failed to create payment" }` | Server error atau Midtrans API error |

**Payment Flow:**
1. Client kirim request ke `/api/payment/create`
2. API buat order di database (status: UNPAID)
3. API request token ke Midtrans Snap
4. API return token ke client
5. Client load Midtrans Snap popup dengan token
6. User pilih metode pembayaran dan bayar
7. Midtrans kirim webhook ke `/api/payment/webhook`
8. API update order status

**Example cURL:**
```bash
curl -X POST https://tubesecommerce.vercel.app/api/payment/create \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "productId": "clxyz123",
        "name": "Montana Gold 400ml",
        "price": 85000,
        "quantity": 2
      }
    ],
    "total": 185000,
    "address": "Jl. Sudirman No. 1, Jakarta",
    "shipping": {
      "courier_name": "JNE",
      "courier_service_name": "REG",
      "price": 15000
    }
  }'
```

---

### 2. Payment Webhook

Menerima notifikasi pembayaran dari Midtrans.

**Endpoint:** `POST /api/payment/webhook`

**Note:** Endpoint ini dipanggil otomatis oleh Midtrans, bukan oleh client.

**Headers:**
```
Content-Type: application/json
```

**Request Body (dari Midtrans):**
```json
{
  "transaction_time": "2025-11-25 10:30:00",
  "transaction_status": "capture",
  "transaction_id": "abc123-def456",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "sha512_hash_value",
  "payment_type": "credit_card",
  "order_id": "ORDER-1732531200000-abc123",
  "merchant_id": "G123456789",
  "gross_amount": "185000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```

**Success Response (200 OK):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Webhook processed successfully",
  "data": {
    "order_id": "ORDER-1732531200000-abc123",
    "status": "PAID"
  }
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 401 | `{ "code": 401, "status": "error", "message": "Invalid signature" }` | Signature verification gagal |
| 403 | `{ "code": 403, "status": "error", "message": "Invalid signature" }` | Request bukan dari Midtrans |
| 404 | `{ "code": 404, "status": "error", "message": "Order not found" }` | Order tidak ditemukan |
| 500 | `{ "code": 500, "status": "error", "message": "Webhook processing failed" }` | Server error |

**Transaction Status Mapping:**

| Midtrans Status | Order Status | Description |
|-----------------|--------------|-------------|
| `capture` | PAID | Payment berhasil (kartu kredit) |
| `settlement` | PAID | Payment berhasil (transfer/VA) |
| `pending` | UNPAID | Menunggu pembayaran |
| `deny` | CANCELLED | Payment ditolak |
| `cancel` | CANCELLED | Payment dibatalkan |
| `expire` | CANCELLED | Payment expired |

**Security:**
- Signature verification menggunakan SHA512
- Format: `order_id + transaction_status + gross_amount + server_key`
- Webhook hanya terima request dengan signature valid

---

## ⚠️ Error Codes

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource baru dibuat |
| 400 | Bad Request | Request tidak valid (data salah) |
| 401 | Unauthorized | Belum login atau session expired |
| 404 | Not Found | Resource tidak ditemukan |
| 500 | Internal Server Error | Server error |

### Common Error Responses

**Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**Validation Error:**
```json
{
  "error": "Invalid input",
  "details": "Email format is invalid"
}
```

**Not Found:**
```json
{
  "error": "Resource not found"
}
```

**Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## 🔑 Authentication Guide

### Getting Session Token

1. **Login via Browser:**
   - Buka https://tubesecommerce.vercel.app/login
   - Login dengan credentials
   - Buka DevTools (F12) → Application → Cookies
   - Copy value dari `next-auth.session-token`

2. **Use Token in Postman:**
   - Add header: `Cookie: next-auth.session-token=YOUR_TOKEN`

3. **Token Expiration:**
   - Default: 30 days
   - Perlu login ulang setelah expire

---

## 📝 Notes

### Rate Limiting
Saat ini belum ada rate limiting. Untuk production, disarankan menambahkan:
- Rate limit per IP: 100 requests/minute
- Rate limit per user: 1000 requests/hour

### CORS
Production mode: CORS configured for Vercel deployment  
Custom domains: Configure as needed

### Environment Variables
Pastikan file `.env` sudah dikonfigurasi dengan benar:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://tubesecommerce.vercel.app"

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY="Mid-server-xxx"
MIDTRANS_CLIENT_KEY="Mid-client-xxx"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-xxx"
MIDTRANS_IS_PRODUCTION="false"

# Biteship (Test)
BITESHIP_API_KEY="biteship_test.xxx"
BITESHIP_BASE_URL="https://api.biteship.com"
```

---

## 🧪 Testing

### Postman Collection
Import collection untuk testing:
1. Download: `PERON-ID-API-Collection.json` (if available)
2. Import di Postman: File → Import
3. Set environment variable `base_url` = `https://tubesecommerce.vercel.app`

### Test Credentials
```
Admin User:
Email: admin@peron.id
Password: admin123

Test Postal Codes (Jakarta):
- 10110 (Gambir)
- 12920 (Jakarta Pusat)
- 13220 (Jakarta Timur)
```

---

## 📞 Support

Untuk pertanyaan atau issues:
- GitHub Issues: [repository-url]
- Email: admin@peron.id

---

**Last Updated:** December 20, 2025  
**API Version:** 1.0.0  
**Environment:** Production (Vercel)
