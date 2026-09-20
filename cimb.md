# CIMB CashPlus — Supabase Backend Documentation

> **Document:** `docs.md`
> **Project:** `oszqantvugvbvydlizix`
> **Audit date:** 2026-09-21
> **Scope:** seluruh komponen `cimb_*`, database schema, relations, RLS, Realtime, triggers, Edge Functions, Storage, Web Push, VAPID, dan dependency backend.

---

## 1. Architecture Overview

```text
┌──────────────────────────────┐
│       CIMB CashPlus PWA      │
│      React / Vite / TS       │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│ Edge Function: cimb          │
│ Main CIMB API                │
└──────────────┬───────────────┘
               │
               │ service role
               ▼
┌──────────────────────────────┐
│        PostgreSQL            │
│                              │
│ cimb_users                   │
│ cimb_livechat                │
│ cimb_messages                │
│ cimb_push_subscriptions      │
└───────┬──────────┬───────────┘
        │          │
        │          └──────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐        ┌──────────────────┐
│ Supabase      │        │ Supabase         │
│ Realtime      │        │ Storage          │
│               │        │ bucketcimb       │
│ users         │        │ bucketcimb_kyc   │
│ livechat      │        └──────────────────┘
│ messages      │
└───────────────┘

               Push
                │
                ▼
┌──────────────────────────────┐
│ Edge Function: cimb-push     │
│ Web Push / VAPID             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ cimb_push_subscriptions      │
│                              │
│ endpoint                     │
│ p256dh                       │
│ auth                         │
└──────────────┬───────────────┘
               │
               ▼
        Browser Push Service
               │
               ▼
          CIMB CashPlus PWA
```

### Architectural principle

Frontend CIMB CashPlus seharusnya menggunakan:

```text
Frontend
   ↓
Edge Function
   ↓
Database / Storage
```

Bukan:

```text
Frontend
   ↓
Direct table access
```

Edge Function `cimb` merupakan API utama CIMB.

---

# 2. Current `cimb_*` Tables

Audit database menemukan **4 tabel `cimb_*` aktif**:

| Table                     | RLS | Estimated Rows | Purpose                         |
| ------------------------- | --: | -------------: | ------------------------------- |
| `cimb_users`              |  ON |              5 | Account, KYC, bank, loan, bills |
| `cimb_livechat`           |  ON |              4 | Conversation                    |
| `cimb_messages`           |  ON |             19 | Chat messages                   |
| `cimb_push_subscriptions` |  ON |              0 | Web Push subscriptions          |

---

# 3. `cimb_users`

## 3.1 Primary Key

```text
phone TEXT PRIMARY KEY
```

`phone` merupakan identifier utama account CIMB.

---

## 3.2 Columns

### Identity / Account

| Column       | Type        | Default  |
| ------------ | ----------- | -------- |
| `phone`      | text        | —        |
| `email`      | text        | NULL     |
| `name`       | text        | NULL     |
| `role`       | text        | `'user'` |
| `balance`    | numeric     | `0`      |
| `created_at` | timestamptz | `now()`  |
| `updated_at` | timestamptz | `now()`  |
| `pin`        | text        | NULL     |
| `password`   | text        | NULL     |
| `avatar`     | text        | `''`     |

---

## 3.3 KYC

| Column                               | Type        |
| ------------------------------------ | ----------- |
| `kyc_status`                         | text        |
| `kyc_is_verified`                    | boolean     |
| `kyc_address_line`                   | text        |
| `kyc_city`                           | text        |
| `kyc_state`                          | text        |
| `kyc_postcode`                       | text        |
| `kyc_country`                        | text        |
| `kyc_identity_full_name`             | text        |
| `kyc_identity_gender`                | text        |
| `kyc_identity_nationality`           | text        |
| `kyc_identity_id_type`               | text        |
| `kyc_identity_mykad_number`          | text        |
| `kyc_identity_date_of_birth`         | date        |
| `kyc_documents_id_image_url`         | text        |
| `kyc_documents_face_image_url`       | text        |
| `kyc_documents_selfie_image_url`     | text        |
| `kyc_verification_verified_at`       | timestamptz |
| `kyc_emergency_contact_name`         | text        |
| `kyc_emergency_contact_phone`        | text        |
| `kyc_emergency_contact_relationship` | text        |

### Important field

Timestamp KYC yang aktual adalah:

```text
kyc_verification_verified_at
```

Bukan:

```text
kyc_verified_at
```

Frontend/API harus menggunakan nama aktual tersebut.

---

# 4. Bank Account

| Column                | Type |
| --------------------- | ---- |
| `bank_name`           | text |
| `bank_account_name`   | text |
| `bank_account_number` | text |

---

# 5. Loan

| Column                     | Type    | Default |
| -------------------------- | ------- | ------- |
| `loan_amount`              | numeric | `0`     |
| `loan_status`              | text    | NULL    |
| `loan_approved`            | boolean | `false` |
| `loan_interest`            | numeric | `0`     |
| `loan_is_active`           | boolean | `false` |
| `loan_tenure_months`       | integer | `0`     |
| `loan_applied_amount`      | numeric | `0`     |
| `loan_approved_amount`     | numeric | `0`     |
| `loan_monthly_installment` | numeric | `0`     |
| `loan_interest_rate`       | numeric | NULL    |
| `loan_total_interest`      | numeric | NULL    |
| `loan_total_payable`       | numeric | NULL    |

### Loan calculation fields

Loan system memiliki tiga field hasil perhitungan tambahan:

```text
loan_interest_rate
loan_total_interest
loan_total_payable
```

---

# 6. Bills

```text
bills JSONB NOT NULL DEFAULT []
```

`bills` bukan table terpisah.

Data bill disimpan sebagai JSONB array di:

```text
cimb_users.bills
```

Conceptual structure:

```json
[
  {
    "id": "bill_...",
    "amount": 0,
    "status": "unpaid",
    "paid_at": null,
    "bill_name": "Ansuran Bulanan",
    "is_active": true,
    "duitnow_qr": {
      "is_active": false,
      "qr_image_url": ""
    },
    "transfer_bank": {
      "bank_name": "",
      "is_active": false,
      "account_name": "",
      "account_number": "",
      "bank_image_url": ""
    }
  }
]
```

### Bill payment channels

#### DuitNow QR

Activation harus memiliki:

```text
duitnow_qr.is_active = true
```

dan:

```text
duitnow_qr.qr_image_url
```

#### Bank Transfer

Jika:

```text
transfer_bank.is_active = true
```

maka data yang diperlukan mencakup:

```text
bank_name
account_name
account_number
bank_image_url
```

---

# 7. `cimb_users` Constraints

### Primary key

```sql
PRIMARY KEY (phone)
```

### PIN validation

```sql
CHECK (
  pin IS NULL
  OR pin ~ '^[0-9]{6}$'
)
```

Artinya PIN harus:

```text
6 digit angka
```

---

# 8. `cimb_livechat`

## Columns

| Column            | Type        | Default            |
| ----------------- | ----------- | ------------------ |
| `id`              | text        | `chat_<timestamp>` |
| `user_phone`      | text        | —                  |
| `status`          | text        | `'open'`           |
| `created_at`      | timestamptz | `now()`            |
| `updated_at`      | timestamptz | `now()`            |
| `last_message_at` | timestamptz | `now()`            |

### Status

Constraint:

```text
open
closed
```

---

# 9. `cimb_messages`

## Columns

| Column            | Type        | Default              |
| ----------------- | ----------- | -------------------- |
| `id`              | text        | generated message ID |
| `conversation_id` | text        | —                    |
| `sender_type`     | text        | —                    |
| `sender_phone`    | text        | —                    |
| `message`         | text        | —                    |
| `message_type`    | text        | `'text'`             |
| `is_read`         | boolean     | `false`              |
| `created_at`      | timestamptz | `now()`              |

### Sender types

```text
user
admin
```

### Message types

Saat ini constraint hanya mengizinkan:

```text
text
```

---

# 10. `cimb_push_subscriptions`

Table ini digunakan khusus untuk **Web Push PWA CIMB**.

## Schema

| Column       | Type        | Constraint / Default    |
| ------------ | ----------- | ----------------------- |
| `id`         | uuid        | PK, `gen_random_uuid()` |
| `phone`      | text        | NOT NULL, FK            |
| `endpoint`   | text        | NOT NULL, UNIQUE        |
| `p256dh`     | text        | NOT NULL                |
| `auth`       | text        | NOT NULL                |
| `user_agent` | text        | nullable                |
| `is_active`  | boolean     | `true`                  |
| `created_at` | timestamptz | `now()`                 |
| `updated_at` | timestamptz | `now()`                 |

### Current state

```text
Rows: 0
```

Artinya belum ada browser/PWA yang terdaftar sebagai push subscriber pada saat audit.

---

# 11. Database Relationships

Relasi aktual:

```text
cimb_users
    │
    ├── phone
    │
    ├───────────────┐
    │               │
    ▼               ▼
cimb_livechat   cimb_push_subscriptions
    │
    │ id
    ▼
cimb_messages
```

---

## 11.1 User → Livechat

```sql
cimb_livechat.user_phone
    REFERENCES cimb_users(phone)
    ON DELETE CASCADE
```

Artinya:

```text
DELETE cimb_users
        ↓
DELETE cimb_livechat
```

---

## 11.2 Livechat → Messages

```sql
cimb_messages.conversation_id
    REFERENCES cimb_livechat(id)
    ON DELETE CASCADE
```

Artinya:

```text
DELETE cimb_livechat
        ↓
DELETE cimb_messages
```

---

## 11.3 User → Push Subscription

```sql
cimb_push_subscriptions.phone
    REFERENCES cimb_users(phone)
    ON DELETE CASCADE
```

Artinya:

```text
DELETE cimb_users
        ↓
DELETE cimb_push_subscriptions
```

---

# 12. Relationship Cascade

Keseluruhan dependency:

```text
cimb_users
    │
    ├── cimb_livechat
    │       │
    │       └── cimb_messages
    │
    └── cimb_push_subscriptions
```

Jika account dihapus:

```text
cimb_users
   ↓ CASCADE
cimb_livechat
   ↓ CASCADE
cimb_messages

cimb_users
   ↓ CASCADE
cimb_push_subscriptions
```

---

# 13. Indexes

## `cimb_users`

```text
cimb_users_pkey
(phone)
```

---

## `cimb_livechat`

```text
cimb_livechat_pkey
(id)

idx_cimb_livechat_last_message_at
(last_message_at DESC)

idx_cimb_livechat_status
(status)

idx_cimb_livechat_user_phone
(user_phone)
```

---

## `cimb_messages`

```text
cimb_messages_pkey
(id)

idx_cimb_messages_conversation_created
(conversation_id, created_at)

idx_cimb_messages_conversation_id
(conversation_id)

idx_cimb_messages_created_at
(created_at)

idx_cimb_messages_is_read
(is_read)
```

---

## `cimb_push_subscriptions`

```text
cimb_push_subscriptions_pkey
(id)

cimb_push_subscriptions_endpoint_key
(endpoint UNIQUE)

cimb_push_subscriptions_phone_idx
(phone)

cimb_push_subscriptions_active_idx
(is_active)
WHERE is_active = true
```

---

# 14. RLS Status

Semua table `cimb_*` saat audit memiliki:

```text
RLS = ENABLED
```

Namun policy yang ditemukan perlu dibedakan.

## `cimb_livechat`

Current policies:

```text
Public insert for cimb_livechat
Public select for cimb_livechat
Public update for cimb_livechat
```

Semua menggunakan role:

```text
public
```

dan predicate saat ini bersifat:

```text
true
```

---

## `cimb_messages`

Current policies:

```text
Public insert for cimb_messages
Public select for cimb_messages
Public update for cimb_messages
```

Predicate juga:

```text
true
```

### Security implication

RLS memang ON, tetapi policy `public ... USING true / WITH CHECK true` secara praktis membuat access control database sangat terbuka jika Data API table tersebut dapat diakses langsung.

Untuk arsitektur CIMB yang menggunakan Edge Function sebagai backend, rekomendasi arsitektural adalah:

```text
Browser
   ↓
cimb Edge Function
   ↓
service role
   ↓
Database
```

dan bukan direct public database access.

---

# 15. Realtime

Publication:

```text
supabase_realtime
```

Saat audit, table berikut terdaftar:

```text
public.cimb_livechat
public.cimb_messages
public.cimb_users
```

### Realtime topology

```text
cimb_livechat
       │
       └── Realtime
             │
             ▼
         Admin / User

cimb_messages
       │
       └── Realtime
             │
             ▼
         Chat UI

cimb_users
       │
       └── Realtime
             │
             ▼
       User data updates
```

`cimb_push_subscriptions` **belum terdaftar** pada publication `supabase_realtime` saat audit.

---

# 16. Livechat Triggers

Ada dua trigger aktif yang berkaitan dengan CIMB livechat.

---

## 16.1 `trg_cimb_livechat_touch`

Event:

```text
BEFORE UPDATE
```

Function:

```text
cimb_livechat_touch()
```

Behavior:

```sql
NEW.updated_at = now();
```

Concept:

```text
UPDATE cimb_livechat
        ↓
updated_at otomatis diperbarui
```

---

## 16.2 `trg_cimb_messages_sync_livechat`

Event:

```text
AFTER INSERT
```

Function:

```text
cimb_messages_sync_livechat()
```

Behavior:

```sql
UPDATE public.cimb_livechat
SET
  last_message_at = NEW.created_at,
  updated_at = now()
WHERE id = NEW.conversation_id;
```

Flow:

```text
INSERT cimb_messages
       ↓
trigger
       ↓
cimb_livechat.last_message_at
       ↓
Realtime update cimb_livechat
```

---

# 17. Automatic 3-Day Cleanup

`pg_cron` extension terpasang:

```text
pg_cron 1.6.4
```

Namun saat audit tidak ditemukan cron job dengan nama/command yang mengandung `cimb`.

Current state:

```text
Automatic 3-day cleanup: NOT VERIFIED / NOT CONFIGURED
```

Jadi dokumentasi tidak menganggap penghapusan otomatis 3 hari sudah aktif.

Recommended future architecture:

```text
pg_cron
   ↓
cleanup SQL
   ↓
cimb_messages
cimb_livechat
```

Dengan prinsip:

```text
messages older than 3 days
        ↓
DELETE

closed livechat older than 3 days
        ↓
DELETE
```

Implementasi harus diverifikasi terlebih dahulu sebelum dianggap production-active.

---

# 18. Edge Functions — CIMB

Edge Functions yang secara langsung terkait dengan `cimb_users`:

| Function     | Version | Status | JWT      |
| ------------ | ------: | ------ | -------- |
| `cimb`       |      20 | ACTIVE | disabled |
| `cimb2`      |       2 | ACTIVE | disabled |
| `cimb-users` |       4 | ACTIVE | disabled |
| `get-cimb`   |       3 | ACTIVE | disabled |
| `cimb-push`  |       1 | ACTIVE | disabled |

---

# 19. Main Edge Function: `cimb`

Current:

```text
Name: cimb
Version: 20
Status: ACTIVE
verify_jwt: false
```

Main database:

```text
cimb_users
```

Storage:

```text
bucketcimb
```

---

## Supported actions

```text
get
check
login
register
upload
update
delete
stream
check-pin
set-pin
withdraw
review-withdrawal
```

---

# 20. `cimb` Authentication

Current authentication model:

```text
phone
+
password
```

Tidak menggunakan Supabase Auth session sebagai authentication utama.

Flow:

```text
phone
   +
password
   ↓
cimb
   ↓
cimb_users
   ↓
role
```

Valid role:

```text
user
admin
```

---

# 21. `cimb` Register

Request concept:

```json
{
  "name": "User",
  "phone": "+6012...",
  "password": "..."
}
```

Function membuat:

```text
role = user
balance = 0
kyc_status = unverified
kyc_is_verified = false
loan defaults
bills = []
```

Password saat ini disimpan pada column:

```text
cimb_users.password
```

---

# 22. `cimb` Login

Request:

```json
{
  "phone": "+6012...",
  "password": "..."
}
```

Backend:

```text
lookup cimb_users
       ↓
compare password
       ↓
validate role
       ↓
return sanitized user
```

Function utama melakukan sanitization:

```text
password → tidak dikembalikan
pin      → tidak dikembalikan
```

dan menambahkan:

```text
has_pin
```

---

# 23. `cimb` User Access Model

### User

User dapat mengubah record miliknya sendiri.

```text
user
  ↓
own phone
  ↓
update own record
```

User tidak dapat mengubah account user lain.

---

### Admin

Admin dapat mengelola target user.

```text
admin
  ↓
target_phone
  ↓
cimb_users
```

---

# 24. Immutable Fields

`cimb` melindungi field:

```text
phone
created_at
updated_at
```

Field tersebut tidak boleh diubah melalui update API.

---

# 25. KYC Rules in `cimb`

User tidak dapat mengubah verification flags:

```text
kyc_is_verified
kyc_verification_verified_at
```

Jika KYC sudah:

```text
kyc_status = verified
```

user tidak dapat mengubah field KYC.

Admin dapat melakukan transition:

```text
verified
rejected
under_review
```

Untuk `verified`, backend memerlukan tiga dokumen:

```text
kyc_documents_id_image_url
kyc_documents_face_image_url
kyc_documents_selfie_image_url
```

Saat diverifikasi:

```text
kyc_is_verified = true
kyc_verification_verified_at = current timestamp
```

---

# 26. Bills Validation in `cimb`

Backend melakukan validasi activation.

### DuitNow QR

Tidak boleh:

```text
duitnow_qr.is_active = true
```

tanpa:

```text
duitnow_qr.qr_image_url
```

### Transfer Bank

Tidak boleh:

```text
transfer_bank.is_active = true
```

tanpa:

```text
bank_image_url
bank_name
account_name
account_number
```

---

# 27. Upload System

Supported upload fields pada `cimb` mencakup:

```text
avatar
kyc_id
kyc_face
kyc_selfie
bill_qr
bill_bank
bill_bank_image
```

Allowed MIME:

```text
image/jpeg
image/png
image/webp
```

Maximum file size:

```text
10 MB
```

---

# 28. Storage URI Handling

`cimb` mendukung URI:

```text
storage://bucket/path
```

Untuk KYC document tertentu, function dapat mengubah storage URI menjadi signed URL.

Current signed URL lifetime:

```text
3600 seconds
```

atau:

```text
1 hour
```

---

# 29. Storage Buckets

Audit menemukan bucket CIMB:

| Bucket           | Public |
| ---------------- | -----: |
| `bucketcimb`     |    YES |
| `bucketcimb_kyc` |     NO |

### `bucketcimb`

Digunakan oleh Edge Function CIMB untuk:

```text
avatar
KYC images
bill images
```

### `bucketcimb_kyc`

Bucket ditemukan pada database dan bersifat private.

Namun penggunaan aktual bucket ini oleh Edge Functions perlu diperlakukan sebagai komponen terpisah sampai penggunaan tersebut diverifikasi dalam source function.

---

# 30. Legacy CIMB Edge Functions

## `cimb2`

Current:

```text
Version: 2
Status: ACTIVE
verify_jwt: false
```

Actions:

```text
get
login
register
upload
update
delete
```

Uses:

```text
cimb_users
bucketcimb
```

`cimb2` merupakan implementation terpisah dari `cimb`.

---

## `cimb-users`

Current:

```text
Version: 4
Status: ACTIVE
verify_jwt: false
```

API memiliki section:

```text
kyc
bank
loan
bills
```

### KYC

Read/update KYC fields.

### Bank

Read/update:

```text
bank_name
bank_account_name
bank_account_number
```

### Loan

Read/update loan fields.

### Bills

Read:

```text
/bills
```

dan dapat mengelola bill melalui:

```text
POST
PATCH
```

---

## `get-cimb`

Current:

```text
Version: 3
Status: ACTIVE
verify_jwt: false
```

Behavior:

```text
GET
   ↓
cimb_users
   ↓
return data
```

Function ini adalah legacy/simple read API dan berbeda dengan sanitization behavior pada `cimb`.

---

# 31. Recommended Canonical API

Untuk CIMB CashPlus, canonical backend sebaiknya:

```text
cimb
```

Architecture:

```text
Frontend
   ↓
/functions/v1/cimb
   ↓
cimb_users
cimb_livechat
cimb_messages
cimb_push_subscriptions
Storage
```

Function legacy:

```text
cimb2
cimb-users
get-cimb
```

sebaiknya tidak menjadi source-of-truth baru.

---

# 32. `cimb-push`

Current:

```text
Name: cimb-push
Version: 1
Status: ACTIVE
verify_jwt: false
```

Purpose:

```text
Web Push Notification
```

Library:

```text
npm:web-push@3.6.7
```

Database:

```text
cimb_push_subscriptions
```

---

# 33. `cimb-push` Security Model

Walaupun:

```text
verify_jwt = false
```

function melakukan custom authorization:

```text
Authorization:
Bearer SUPABASE_SERVICE_ROLE_KEY
```

Request tanpa service-role authorization:

```text
401 Unauthorized
```

Karena itu:

```text
cimb-push
```

**tidak boleh dipanggil langsung oleh browser dengan service role key.**

Service role hanya boleh berada di server/Edge Function.

---

# 34. VAPID

`cimb-push` membutuhkan tiga environment secrets:

```text
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
```

Function menjalankan:

```ts
webpush.setVapidDetails(
  subject,
  publicKey,
  privateKey
)
```

### Current verification status

Nilai secret VAPID **tidak dibaca/ditampilkan dalam audit**.

Karena itu status aktual secret:

```text
VAPID_PUBLIC_KEY  → configured status not verified
VAPID_PRIVATE_KEY → configured status not verified
VAPID_SUBJECT     → configured status not verified
```

Function akan menghasilkan HTTP `500` jika salah satu secret tersebut tidak tersedia.

---

# 35. Web Push Subscription Flow

Expected browser flow:

```text
PWA
 ↓
Notification.permission
 ↓
Service Worker
 ↓
PushManager.subscribe()
 ↓
endpoint
p256dh
auth
 ↓
cimb_push_subscriptions
```

Database record:

```json
{
  "phone": "+6012...",
  "endpoint": "...",
  "p256dh": "...",
  "auth": "...",
  "user_agent": "...",
  "is_active": true
}
```

---

# 36. Push Targeting

`cimb-push` mendukung dua mode.

## Specific user

Request:

```json
{
  "phone": "+6012...",
  "title": "CIMB CashPlus",
  "body": "Notifikasi baru",
  "url": "/",
  "data": {}
}
```

Hanya subscription aktif user tersebut yang diproses.

---

## Broadcast

Jika:

```text
phone
```

tidak dikirim:

```text
all active cimb_push_subscriptions
```

akan diproses.

---

# 37. Push Response

Successful delivery:

```json
{
  "success": true,
  "sentCount": 1,
  "removedCount": 0,
  "targetPhone": "+6012..."
}
```

Jika tidak ada subscription:

```json
{
  "success": true,
  "sentCount": 0,
  "removedCount": 0,
  "message": "No active CIMB push subscriptions"
}
```

---

# 38. Stale Push Subscription Cleanup

Jika push provider mengembalikan:

```text
404
```

atau:

```text
410
```

endpoint dianggap stale.

Function mengubah:

```text
is_active = false
```

dan:

```text
updated_at = current timestamp
```

Subscription tidak langsung dihapus.

Flow:

```text
Push failed
    ↓
404 / 410
    ↓
is_active = false
```

---

# 39. Push Payload

Internal payload:

```json
{
  "title": "CIMB CashPlus",
  "body": "Anda memiliki notifikasi baru.",
  "icon": "/favicon.ico",
  "badge": "/favicon.ico",
  "url": "/",
  "data": {}
}
```

TTL:

```text
60 seconds
```

---

# 40. Current Push Architecture

Saat audit:

```text
cimb-push
      │
      ▼
cimb_push_subscriptions
```

sudah tersedia.

Tetapi automatic event wiring belum diverifikasi/terpasang antara:

```text
cimb_messages
       ↓
cimb-push
```

Dengan kata lain, saat audit belum dapat dianggap bahwa:

```text
new chat message
      ↓
automatic PWA push
```

sudah aktif.

---

# 41. Recommended Livechat + Push Architecture

Target architecture:

```text
User / Admin
      │
      ▼
    cimb
      │
      ├───────────────┐
      ▼               ▼
cimb_messages     cimb_livechat
      │               │
      └───────┬───────┘
              │
              ▼
       Push event
              │
              ▼
         cimb-push
              │
              ▼
cimb_push_subscriptions
              │
              ▼
       Browser Web Push
```

Realtime dan Push memiliki fungsi berbeda.

---

# 42. Realtime vs Push

## Realtime

Digunakan ketika app sedang aktif:

```text
Database change
      ↓
Realtime
      ↓
open browser
      ↓
chat UI update
```

---

## Web Push

Digunakan ketika browser/PWA tidak sedang aktif di halaman chat:

```text
Database event
      ↓
cimb-push
      ↓
Web Push
      ↓
OS/browser notification
```

### Keduanya bukan pengganti satu sama lain.

Recommended:

```text
Realtime = live UI synchronization

Web Push = out-of-app notification
```

---

# 43. Livechat Realtime Flow

Untuk chat:

```text
INSERT cimb_messages
        ↓
Supabase Realtime
        ↓
subscriber conversation_id
        ↓
append message to UI
```

Untuk conversation metadata:

```text
INSERT / UPDATE cimb_livechat
        ↓
Supabase Realtime
        ↓
conversation list update
```

---

# 44. Message → Conversation Synchronization

Saat message baru dibuat:

```text
cimb_messages
      ↓
trg_cimb_messages_sync_livechat
      ↓
cimb_livechat.last_message_at
      ↓
cimb_livechat.updated_at
```

Ini membuat daftar conversation dapat mengetahui conversation mana yang terakhir menerima message.

---

# 45. Current Realtime Tables

| Table                     | Realtime |
| ------------------------- | -------: |
| `cimb_users`              |      YES |
| `cimb_livechat`           |      YES |
| `cimb_messages`           |      YES |
| `cimb_push_subscriptions` |       NO |

---

# 46. Database Extensions Relevant to CIMB

Extension yang relevan untuk arsitektur CIMB:

```text
pg_cron
pg_net
pgcrypto
uuid-ossp
pg_graphql
pg_jsonschema
```

### `pg_cron`

Tersedia untuk scheduled jobs.

### `pg_net`

Tersedia untuk asynchronous HTTP dari PostgreSQL.

### `pgcrypto`

Tersedia untuk cryptographic functions.

### `uuid-ossp`

Tersedia untuk UUID generation.

### `pg_jsonschema`

Tersedia untuk JSON schema validation.

---

# 47. Important Security Findings

## 47.1 Service Role

Service role digunakan oleh Edge Functions.

Service role:

```text
MUST NOT
```

masuk frontend/PWA.

---

## 47.2 `verify_jwt=false`

Beberapa CIMB functions memiliki:

```text
verify_jwt=false
```

Karena authentication dilakukan secara custom.

Ini berarti security harus dipastikan di body function sendiri.

---

## 47.3 Direct Public RLS Policies

`cimb_livechat` dan `cimb_messages` saat ini memiliki public policies dengan predicate:

```text
true
```

Ini berbeda dengan model:

```text
user hanya dapat membaca conversation miliknya
```

atau:

```text
admin dapat membaca seluruh conversation
```

Jika frontend menggunakan direct Supabase Data API, policy tersebut berpotensi memberikan akses terlalu luas.

Untuk architecture yang menggunakan `cimb` sebagai backend, akses browser direct ke table sebaiknya tidak menjadi jalur aplikasi.

---

# 48. Password / PIN

Current database memiliki:

```text
password TEXT
pin TEXT
```

`cimb` melakukan sanitization sehingga response user tidak mengembalikan:

```text
password
pin
```

Sebagai gantinya:

```text
has_pin
```

dikembalikan.

### Important

Current authentication implementation membandingkan password secara langsung terhadap nilai database.

Artinya current architecture bukan password-hashing authentication seperti Supabase Auth.

---

# 49. PIN Flow

Database constraint:

```regex
^[0-9]{6}$
```

Edge Function `cimb` memiliki action:

```text
check-pin
set-pin
```

Withdrawal flow menggunakan PIN sebagai security step.

Concept:

```text
Withdraw
   ↓
check PIN
   ↓
PIN belum ada?
   ↓
set PIN
   ↓
continue withdrawal
```

---

# 50. Withdrawal

`cimb` memiliki action:

```text
withdraw
```

dan admin review:

```text
review-withdrawal
```

Architecture:

```text
User
 ↓
withdraw
 ↓
PIN verification
 ↓
withdraw request
 ↓
Admin
 ↓
review-withdrawal
```

Withdrawal-specific persistent schema harus diperlakukan berdasarkan implementation `cimb` saat ini; tidak ditemukan table `cimb_withdrawals` dalam kumpulan table `cimb_*` yang diaudit.

---

# 51. No Dedicated CIMB Transaction Tables

Current `cimb_*` database tidak memiliki table terpisah untuk:

```text
loan_transactions
withdrawals
bill_payments
notifications
push_events
```

Data utama masih berada pada:

```text
cimb_users
```

dan khusus chat:

```text
cimb_livechat
cimb_messages
```

Bills masih:

```text
cimb_users.bills JSONB
```

---

# 52. Current Data Model

```text
                    cimb_users
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      KYC fields     Bank fields     Loan fields
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                       bills
                       JSONB
                         │
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   cimb_livechat              cimb_push_subscriptions
          │
          ▼
   cimb_messages
```

---

# 53. Current Source of Truth

## Frontend

```text
GitHub
gantulu/cimb-cashplus-apps
```

## Main backend

```text
Supabase Edge Function
cimb
```

## Database

```text
public.cimb_*
```

## Realtime

```text
supabase_realtime
```

## Push

```text
cimb-push
```

## Push registration

```text
cimb_push_subscriptions
```

## Storage

```text
bucketcimb
bucketcimb_kyc
```

---

# 54. Current Backend State

| Component                       | State                         |
| ------------------------------- | ----------------------------- |
| `cimb_users`                    | ACTIVE                        |
| `cimb_livechat`                 | ACTIVE                        |
| `cimb_messages`                 | ACTIVE                        |
| `cimb_push_subscriptions`       | ACTIVE, 0 rows                |
| `cimb`                          | ACTIVE v20                    |
| `cimb2`                         | ACTIVE v2                     |
| `cimb-users`                    | ACTIVE v4                     |
| `get-cimb`                      | ACTIVE v3                     |
| `cimb-push`                     | ACTIVE v1                     |
| Realtime users                  | ACTIVE                        |
| Realtime livechat               | ACTIVE                        |
| Realtime messages               | ACTIVE                        |
| Realtime push subscriptions     | NOT ENABLED                   |
| VAPID secrets                   | NOT VERIFIED                  |
| Automatic message → push wiring | NOT VERIFIED                  |
| CIMB 3-day cron cleanup         | NOT CONFIGURED / NOT VERIFIED |

---

# 55. Recommended Target Architecture

```text
                         ┌─────────────────┐
                         │   CIMB PWA      │
                         └────────┬────────┘
                                  │
                                  │ HTTPS
                                  ▼
                         ┌─────────────────┐
                         │      cimb       │
                         │  Canonical API  │
                         └────────┬────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
          cimb_users       cimb_livechat     cimb_messages
                 │                │                │
                 │                └───────┬────────┘
                 │                        │
                 │                        ▼
                 │                   Realtime
                 │                        │
                 │                        ▼
                 │                   Chat UI
                 │
                 ▼
       cimb_push_subscriptions
                 │
                 ▲
                 │
             cimb-push
                 │
                 ▼
              VAPID
                 │
                 ▼
          Browser Web Push
```

---

# 56. Recommended Event Architecture

Untuk livechat production:

```text
INSERT cimb_messages
        │
        ├──────────────► Supabase Realtime
        │
        └──────────────► Push event
                              │
                              ▼
                         cimb-push
                              │
                              ▼
                   cimb_push_subscriptions
                              │
                              ▼
                        PWA notification
```

Realtime:

```text
low-latency UI synchronization
```

Push:

```text
background notification
```

---

# 57. Recommended Next Implementation Sequence

## Phase 1 — Push Registration

Implement PWA:

```text
Service Worker
PushManager
VAPID public key
subscription registration
```

Store subscription:

```text
cimb_push_subscriptions
```

---

## Phase 2 — Push API Integration

Keep:

```text
cimb-push
```

as dedicated push sender.

Jangan expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

ke frontend.

---

## Phase 3 — Livechat Event → Push

Connect:

```text
cimb_messages
        ↓
push event
        ↓
cimb-push
```

Recommended mechanism:

```text
Database Webhook
```

or server-side invocation dari `cimb`.

---

## Phase 4 — Realtime Security

Review policies agar model akses menjadi:

```text
User
  → own conversations/messages

Admin
  → all conversations/messages
```

bukan:

```text
public → all
```

---

## Phase 5 — Cleanup

Configure:

```text
pg_cron
```

untuk retention:

```text
3 days
```

khusus data livechat/messages sesuai requirement.

---

# 58. Final Audit Summary

Current CIMB backend sudah memiliki fondasi lengkap untuk:

```text
Account
KYC
Bank
Loan
Bills
Livechat
Messages
Realtime
Web Push
VAPID
Storage
Admin operations
Withdrawal
PIN
```

Core database relationship:

```text
cimb_users
 ├── cimb_livechat
 │    └── cimb_messages
 │
 └── cimb_push_subscriptions
```

Core backend:

```text
cimb
```

Realtime:

```text
cimb_livechat
cimb_messages
cimb_users
```

Push:

```text
cimb-push
       ↓
cimb_push_subscriptions
       ↓
VAPID
       ↓
PWA
```

Storage:

```text
bucketcimb
bucketcimb_kyc
```

### Important gaps yang masih harus dianggap belum selesai

```text
1. PWA belum memiliki subscription yang tercatat
   → cimb_push_subscriptions = 0 rows

2. VAPID secrets belum dapat diverifikasi status konfigurasinya.

3. Automatic cimb_messages → cimb-push belum terverifikasi.

4. cimb_push_subscriptions belum masuk Realtime publication.

5. RLS livechat/messages masih memiliki public policies dengan true.

6. Cron cleanup 3 hari untuk cimb_* belum terverifikasi aktif.

7. Terdapat beberapa legacy CIMB Edge Functions:
   cimb2
   cimb-users
   get-cimb

   sehingga `cimb` harus dipertahankan sebagai canonical API.

8. Password/PIN masih menggunakan custom database authentication,
   bukan Supabase Auth.
```

---

# 59. Canonical CIMB Contract

Untuk menjaga agar frontend dan backend tidak mismatch, gunakan contract berikut sebagai baseline:

```text
DATABASE
├── cimb_users
├── cimb_livechat
├── cimb_messages
└── cimb_push_subscriptions

EDGE FUNCTIONS
└── cimb
    ├── get
    ├── check
    ├── login
    ├── register
    ├── upload
    ├── update
    ├── delete
    ├── stream
    ├── check-pin
    ├── set-pin
    ├── withdraw
    └── review-withdrawal

PUSH
└── cimb-push

REALTIME
├── cimb_users
├── cimb_livechat
└── cimb_messages

STORAGE
├── bucketcimb
└── bucketcimb_kyc

VAPID
├── VAPID_PUBLIC_KEY
├── VAPID_PRIVATE_KEY
└── VAPID_SUBJECT
```

**Status dokumen:** Audit-based documentation.
**Source of truth:** live Supabase project state at audit time, not assumptions.
