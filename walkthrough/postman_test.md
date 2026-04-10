# 🚀 BookFlow — API Testing Guide (Phase 1-3)

Use this guide to test the migrated and newly implemented endpoints using Postman or any HTTP client.

---

## 1. Authentication & Users

### Register a Business Owner
**POST** `{{base_url}}/auth/register`
```json
{
  "email": "owner@barber.com",
  "password": "password123",
  "name": "Ahmed Barber",
  "phone": "01012345678",
  "role": "BUSINESS_OWNER"
}
```

### Login
**POST** `{{base_url}}/auth/login`
```json
{
  "email": "owner@barber.com",
  "password": "password123"
}
```
> **Action:** Copy the `accessToken` from the response and set it as a Bearer Token in Postman.

### Get Me
**GET** `{{base_url}}/auth/me`
*Headers:* `Authorization: Bearer {{token}}`

---

## 2. Business Management

### Create a Business
**POST** `{{base_url}}/businesses`
*Headers:* `Authorization: Bearer {{token}}` (Must be BUSINESS_OWNER)
```json
{
  "name": "The Sharp Cut",
  "description": "Premium Barbershop in Maadi",
  "category": "BARBERSHOP",
  "city": "Cairo",
  "address": "Street 9, Maadi",
  "phone": "01122334455"
}
```
> **Action:** Copy the `id` of the created business.

### List Businesses (Public)
**GET** `{{base_url}}/businesses?city=Cairo&category=BARBERSHOP`

### Get Business by Slug
**GET** `{{base_url}}/businesses/slug/the-sharp-cut`

---

## 3. Service Management

### Add a Service to Business
**POST** `{{base_url}}/businesses/{{businessId}}/services`
*Headers:* `Authorization: Bearer {{token}}`
```json
{
  "name": "Haircut & Shave",
  "description": "Complete grooming package",
  "durationMinutes": 45,
  "price": 250,
  "currency": "EGP"
}
```
> **Action:** Copy the `id` of the created service.

---

## 4. Availability & Slots (The Engine)

### Set Weekly Availability
**PUT** `{{base_url}}/businesses/{{businessId}}/availability`
*Headers:* `Authorization: Bearer {{token}}`
```json
{
  "schedule": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00" },
    { "dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00" },
    { "dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00" },
    { "dayOfWeek": 4, "startTime": "09:00", "endTime": "21:00" },
    { "dayOfWeek": 5, "startTime": "13:00", "endTime": "22:00" }
  ]
}
```

### Get Available Slots (Public)
**GET** `{{base_url}}/businesses/{{businessId}}/slots?serviceId={{serviceId}}&date=2026-04-06`
*(Note: Pick a date that matches a dayOfWeek you set above)*

---

## 5. Bookings (Core Transaction flow)

### Create a Booking
**POST** `{{base_url}}/bookings`
*Headers:* `Authorization: Bearer {{customer_token}}`
```json
{
  "serviceId": "{{serviceId}}",
  "businessId": "{{businessId}}",
  "date": "2026-04-06",
  "startTime": "10:00",
  "notes": "First time customer"
}
```

### Get Customer Bookings (My Bookings)
**GET** `{{base_url}}/bookings/mine`
*Headers:* `Authorization: Bearer {{customer_token}}`

### Get Business Bookings (Owner Schedule)
**GET** `{{base_url}}/businesses/{{businessId}}/bookings`
*Headers:* `Authorization: Bearer {{owner_token}}`

### Cancel a Booking
**PATCH** `{{base_url}}/bookings/{{bookingId}}/cancel`
*Headers:* `Authorization: Bearer {{token}}`

### Complete a Booking (Owner only)
**PATCH** `{{base_url}}/bookings/{{bookingId}}/complete`
*Headers:* `Authorization: Bearer {{owner_token}}`

---

## 6. Business Dashboard

### Get Business Dashboard
**GET** `{{base_url}}/businesses/{{businessId}}/dashboard`
*Headers:* `Authorization: Bearer {{owner_token}}`

---

## 7. Uploads (Images)

### Upload Business Logo
**POST** `{{base_url}}/uploads/business-logo`
*Headers:* `Authorization: Bearer {{token}}`
*Body (form-data):*
- `file`: (Select image)
- `businessId`: `{{businessId}}`

---

## Variables Checklist
- `base_url`: `http://localhost:3000`
- `businessId`: UUID of your created business
- `serviceId`: UUID of your created service
- `bookingId`: UUID of your created booking
- `owner_token`: JWT from business owner login
- `customer_token`: JWT from customer login
