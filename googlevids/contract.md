# Backend ↔ Frontend Contract V1

## Gemini Canvas Application Runtime

**Status:** V1  
**Purpose:** Single Source of Truth antara frontend Gemini Canvas Application Runtime dan backend Edge Function `yt`  
**Backend:** Supabase Edge Function `yt`  
**Database:** Supabase PostgreSQL  
**Runtime:** Gemini Canvas Application Runtime  
**API Style:** HTTP REST-like  
**Authentication:** JWT verification disabled pada Edge Function V1

---

# 1. Purpose

Dokumen ini mendefinisikan kontrak lengkap antara frontend Gemini Canvas Application Runtime dan backend `yt`.

Frontend menggunakan contract ini untuk mengetahui secara eksplisit:

- resource yang tersedia
- struktur data
- relasi antar-resource
- endpoint
- HTTP method
- query parameter
- request body
- response
- validation
- readonly fields
- error behavior
- CRUD behavior
- workflow
- aturan Animate Image
- aturan Extend
- aturan relasi Scene
- aturan delete/cascade

Frontend **tidak boleh membuat asumsi terhadap database** di luar contract ini.

---

# 2. Architecture

```text
┌──────────────────────────────────────────────┐
│ Gemini Canvas Application Runtime            │
│                                              │
│  UI / Prompt Builder / Project Editor        │
│              │                               │
│              ▼                               │
│          ytApi Client                        │
└──────────────┬───────────────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────────────────────┐
│ Supabase Edge Function                       │
│                                              │
│ /functions/v1/yt                             │
│                                              │
│ project                                      │
│ scene                                        │
│ image                                        │
│ animate_image                                │
│ extend                                       │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ Supabase PostgreSQL                          │
│                                              │
│ yt_project                                   │
│ yt_scene                                     │
│ yt_image                                     │
│ yt_animate_image                             │
│ yt_extend                                    │
└──────────────────────────────────────────────┘
```

---

# 3. Backend Endpoint

## Base URL

```text
https://oszqantvugvbvydlizix.supabase.co/functions/v1/yt
```

Frontend harus menggunakan Base URL tersebut sebagai satu-satunya entry point untuk data `yt_*`.

---

# 4. Authentication

Edge Function `yt` V1:

```text
verify_jwt = false
```

Artinya Edge Function tidak membutuhkan JWT Supabase untuk menerima request.

Namun frontend:

- tidak boleh menyimpan `SUPABASE_SERVICE_ROLE_KEY`
- tidak boleh memanggil database menggunakan service-role key
- tidak boleh menganggap endpoint ini sudah memiliki authorization user-level
- hanya boleh menggunakan endpoint `yt`

Backend menggunakan:

```text
SUPABASE_SERVICE_ROLE_KEY
```

secara internal.

### Security Status

```text
V1:
Public CRUD endpoint
        +
Service Role backend
```

Ini merupakan karakteristik backend V1 dan bukan authorization model production.

---

# 5. Resources

| Resource | Database Table | Purpose |
| --- | --- | --- |
| `project` | `yt_project` | Project YouTube Short |
| `scene` | `yt_scene` | Scene dalam project |
| `image` | `yt_image` | Starting image scene |
| `animate_image` | `yt_animate_image` | Prompt animasi starting image |
| `extend` | `yt_extend` | Prompt continuation video |

---

# 6. Database Relationship

```text
yt_project
    │
    │ 1:N
    ▼
yt_scene
    │
    ├──────────────► yt_image
    │
    ├──────────────► yt_animate_image
    │
    └──────────────► yt_extend
```

Relasi utama:

```text
yt_scene.project_id
    → yt_project.id
```

```text
yt_image.project_id
    → yt_project.id

yt_image.scene_pk
    → yt_scene.id

yt_animate_image.project_id
    → yt_project.id

yt_animate_image.scene_pk
    → yt_scene.id

yt_extend.project_id
    → yt_project.id

yt_extend.scene_pk
    → yt_scene.id
```

---

# 7. Important ID Rules

Frontend harus membedakan:

### `id`

UUID primary key database.

Contoh:

```text
c1949dfd-b33a-43eb-bdfc-a01bc90e13f9
```

### `scene_id`

Identifier logical scene.

Contoh:

```text
scene_001
scene_002
scene_003
```

### `scene_pk`

UUID yang menunjuk ke:

```text
yt_scene.id
```

Jangan menggunakan:

```text
scene_id
```

sebagai pengganti:

```text
scene_pk
```

---

# 8. Resource Schema

## 8.1 Project

Database:

```text
yt_project
```

Schema:

```ts
type YtProject = {
  id: string
  title: string
  description: string | null
  aspect_ratio: string
  status: string
  created_at: string
  updated_at: string
}
```

Editable:

```text
title
description
aspect_ratio
status
```

Readonly:

```text
id
created_at
updated_at
```

---

# 9. Scene

Database:

```text
yt_scene
```

Schema:

```ts
type YtScene = {
  id: string
  project_id: string
  scene_id: string
  sequence: number
  start_time: string | null
  end_time: string | null
  duration: number | null
  created_at: string
  updated_at: string
}
```

Required ketika create:

```text
project_id
scene_id
sequence
```

Editable:

```text
project_id
scene_id
sequence
start_time
end_time
duration
```

Readonly:

```text
id
created_at
updated_at
```

---

# 10. Image

Database:

```text
yt_image
```

Schema:

```ts
type YtImage = {
  id: string
  project_id: string
  scene_pk: string
  prompt: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}
```

Required ketika create:

```text
scene_pk
```

`project_id` dapat dikirim, tetapi backend akan memvalidasi terhadap scene.

Editable:

```text
project_id
scene_pk
prompt
image_url
```

Readonly:

```text
id
created_at
updated_at
```

---

# 11. Animate Image

Database:

```text
yt_animate_image
```

Schema:

```ts
type YtAnimateImage = {
  id: string
  project_id: string
  scene_pk: string
  sequence: number | null
  scene_id: string | null
  animate_image: AnimateImagePayload
  prompt: string | null
  created_at: string
  updated_at: string
}
```

---

# 12. Animate Image Payload

V1:

```ts
type AnimateImagePayload = {
  motion: {
    subject: string
    secondary: string
    environment: string
  }

  camera: {
    movement: string
    direction: string
    speed: string
  }

  timing: {
    start: string
    middle: string
    end: string
  }

  audio: {
    sound: string
    ambience: string
    dialogue: string
  }
}
```

Concept:

```text
INPUT IMAGE
     │
     ▼
Animate Image Prompt
     │
     ├── Subject Motion
     ├── Secondary Motion
     ├── Environment Motion
     ├── Camera
     ├── Timing
     └── Audio
     │
     ▼
Animated Video
```

---

# 13. Animate Image Prompt

Frontend menyimpan:

```text
animate_image
```

sebagai structured JSON.

Frontend juga dapat menyimpan:

```text
prompt
```

sebagai final natural-language prompt.

Contoh:

```text
Animate the provided image naturally.

The woman gently turns her head toward the camera while
her hair and clothing move subtly in the breeze.

Leaves and small branches sway naturally.

The camera slowly pushes in toward the subject
at a cinematic pace.

Begin with a brief still moment, develop the motion smoothly,
and end in a calm pose.
```

`animate_image` adalah structured source.

`prompt` adalah generated prompt.

---

# 14. Extend

Database:

```text
yt_extend
```

Schema:

```ts
type YtExtend = {
  id: string
  project_id: string
  scene_pk: string
  sequence: number | null
  scene_id: string | null
  extend: ExtendPayload
  prompt: string | null
  created_at: string
  updated_at: string
}
```

---

# 15. Extend Payload

V1:

```ts
type ExtendPayload = {
  continuation: string
  action: string
  subject_motion: string
  environment_motion: string
  camera: string
  ending: string
  audio: string
}
```

Konsep Extend:

```text
EXISTING VIDEO
      │
      ▼
CURRENT ENDING
      │
      ▼
CONTINUATION
      │
      ▼
NEXT ACTION
      │
      ▼
EXTENDED VIDEO
```

Extend bukan membuat scene baru.

Extend merupakan kelanjutan dari video yang sudah ada.

---

# 16. Extend Prompt

Template V1:

```text
Continue the video naturally from its current ending.

{{continuation}}

Then, {{action}}.

{{subject_motion}}

{{environment_motion}}

The camera {{camera}}.

{{ending}}

{{audio}}
```

Frontend boleh menggunakan template tersebut untuk menghasilkan:

```text
extend.prompt
```

---

# 17. Multiple Extend

Satu scene dapat memiliki beberapa Extend.

Contoh:

```text
scene_001
│
├── image
│
├── animate_image
│
├── extend #1
│
└── extend #2
```

Database:

```text
yt_extend
```

menggunakan:

```text
sequence
```

untuk membedakan urutan Extend.

Contoh:

```text
sequence = 1
sequence = 2
sequence = 3
```

Frontend tidak perlu membuat schema baru untuk setiap Extend.

---

# 18. Complete Content Pipeline

Workflow utama Gemini Canvas Application:

```text
CREATE PROJECT
      │
      ▼
CREATE SCENE
      │
      ▼
GENERATE IMAGE PROMPT
      │
      ▼
GENERATE IMAGE
      │
      ▼
SAVE IMAGE
      │
      ▼
GENERATE ANIMATE IMAGE PROMPT
      │
      ▼
ANIMATE IMAGE
      │
      ▼
SAVE ANIMATE DATA
      │
      ▼
GENERATE EXTEND #1 PROMPT
      │
      ▼
EXTEND VIDEO
      │
      ▼
SAVE EXTEND #1
      │
      ▼
GENERATE EXTEND #2 PROMPT
      │
      ▼
EXTEND VIDEO
      │
      ▼
SAVE EXTEND #2
```

---

# 19. GET Contract

## Get Everything

```http
GET /functions/v1/yt?resource=all
```

Response:

```json
{
  "data": {
    "projects": [],
    "scenes": [],
    "images": [],
    "animate_images": [],
    "extends": []
  }
}
```

Digunakan ketika Canvas perlu melakukan initial data load.

---

# 20. Get Projects

```http
GET /functions/v1/yt?resource=project
```

Response:

```json
{
  "data": [
    {
      "id": "PROJECT_UUID",
      "title": "The Woman in the Forest",
      "description": "...",
      "aspect_ratio": "9:16",
      "status": "draft",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "count": 1
}
```

---

# 21. Get Single Project

```http
GET /functions/v1/yt?resource=project&id=PROJECT_UUID
```

Response:

```json
{
  "data": {
    "id": "PROJECT_UUID",
    "title": "The Woman in the Forest",
    "description": "...",
    "aspect_ratio": "9:16",
    "status": "draft",
    "created_at": "...",
    "updated_at": "..."
  },
  "count": 1
}
```

---

# 22. Get Scenes by Project

```http
GET /functions/v1/yt?resource=scene&project_id=PROJECT_UUID
```

Response:

```json
{
  "data": [
    {
      "id": "SCENE_UUID",
      "project_id": "PROJECT_UUID",
      "scene_id": "scene_001",
      "sequence": 1,
      "start_time": "00:00",
      "end_time": "00:05",
      "duration": 5,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "count": 1
}
```

---

# 23. Get Image by Scene

```http
GET /functions/v1/yt?resource=image&scene_pk=SCENE_UUID
```

---

# 24. Get Animate Image by Scene

```http
GET /functions/v1/yt?resource=animate_image&scene_pk=SCENE_UUID
```

---

# 25. Get Extend by Scene

```http
GET /functions/v1/yt?resource=extend&scene_pk=SCENE_UUID
```

Response data diurutkan berdasarkan:

```text
sequence ASC
```

---

# 26. POST Contract

## Create Project

```http
POST /functions/v1/yt?resource=project
Content-Type: application/json
```

Body:

```json
{
  "title": "The Woman in the Forest",
  "description": "Cinematic YouTube Short",
  "aspect_ratio": "9:16",
  "status": "draft"
}
```

Response:

```http
201 Created
```

```json
{
  "data": {
    "id": "PROJECT_UUID",
    "title": "The Woman in the Forest",
    "description": "Cinematic YouTube Short",
    "aspect_ratio": "9:16",
    "status": "draft",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

# 27. Create Scene

```http
POST /functions/v1/yt?resource=scene
Content-Type: application/json
```

Body minimum:

```json
{
  "project_id": "PROJECT_UUID",
  "scene_id": "scene_001",
  "sequence": 1
}
```

Optional:

```json
{
  "project_id": "PROJECT_UUID",
  "scene_id": "scene_001",
  "sequence": 1,
  "start_time": "00:00",
  "end_time": "00:05",
  "duration": 5
}
```

---

# 28. Create Image

```http
POST /functions/v1/yt?resource=image
Content-Type: application/json
```

Body:

```json
{
  "scene_pk": "SCENE_UUID",
  "prompt": "A cinematic woman standing in a dense forest...",
  "image_url": "https://..."
}
```

Backend:

```text
scene_pk
    │
    ▼
yt_scene
    │
    ├── validate scene exists
    ├── obtain project_id
    └── create yt_image
```

---

# 29. Create Animate Image

```http
POST /functions/v1/yt?resource=animate_image
Content-Type: application/json
```

Body:

```json
{
  "scene_pk": "SCENE_UUID",
  "sequence": 1,
  "animate_image": {
    "motion": {
      "subject": "The woman gently turns her head toward the camera.",
      "secondary": "Her hair and clothing move subtly in the breeze.",
      "environment": "Leaves sway naturally."
    },
    "camera": {
      "movement": "slow push in",
      "direction": "toward the subject",
      "speed": "slow and cinematic"
    },
    "timing": {
      "start": "The woman remains still briefly.",
      "middle": "The head turn develops smoothly.",
      "end": "The woman settles into a calm pose."
    },
    "audio": {
      "sound": "soft natural movement sounds",
      "ambience": "quiet forest ambience",
      "dialogue": ""
    }
  },
  "prompt": "Animate the provided image naturally..."
}
```

Backend automatically validates:

```text
scene_pk
```

and derives:

```text
project_id
scene_id
```

when necessary.

---

# 30. Create Extend

```http
POST /functions/v1/yt?resource=extend
Content-Type: application/json
```

Body:

```json
{
  "scene_pk": "SCENE_UUID",
  "sequence": 1,
  "extend": {
    "continuation": "Continue naturally from the current ending.",
    "action": "The woman begins walking toward the clearing.",
    "subject_motion": "She walks slowly and naturally.",
    "environment_motion": "Leaves continue moving in the breeze.",
    "camera": "slowly follows behind the subject",
    "ending": "End with the woman approaching the brighter clearing.",
    "audio": "Continue the natural forest ambience."
  },
  "prompt": "Continue the video naturally from its current ending..."
}
```

---

# 31. Update Contract

Both methods are supported:

```http
PATCH /functions/v1/yt?resource={resource}&id={UUID}
```

and:

```http
PUT /functions/v1/yt?resource={resource}&id={UUID}
```

V1 behavior:

```text
PATCH = partial update
PUT   = accepted update using supplied editable fields
```

Frontend should prefer:

```http
PATCH
```

untuk perubahan field individual.

---

# 32. Update Example

```http
PATCH /functions/v1/yt?resource=project&id=PROJECT_UUID
```

Body:

```json
{
  "title": "Updated Project Title"
}
```

Response:

```json
{
  "data": {
    "id": "PROJECT_UUID",
    "title": "Updated Project Title",
    "description": "...",
    "aspect_ratio": "9:16",
    "status": "draft",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

# 33. Delete Contract

```http
DELETE /functions/v1/yt?resource={resource}&id={UUID}
```

Example:

```http
DELETE /functions/v1/yt?resource=extend&id=EXTEND_UUID
```

Response:

```json
{
  "data": {
    "id": "EXTEND_UUID",
    "...": "..."
  }
}
```

---

# 34. Cascade Delete

Database menggunakan:

```text
ON DELETE CASCADE
```

untuk relasi child.

Jika:

```text
DELETE project
```

maka child records terkait akan ikut terhapus:

```text
project
 └── scenes
      ├── images
      ├── animate_images
      └── extends
```

Frontend tidak perlu menghapus child records satu per satu ketika menghapus project.

---

# 35. Editable Fields

## project

```text
title
description
aspect_ratio
status
```

## scene

```text
project_id
scene_id
sequence
start_time
end_time
duration
```

## image

```text
project_id
scene_pk
prompt
image_url
```

## animate_image

```text
project_id
scene_pk
sequence
scene_id
animate_image
prompt
```

## extend

```text
project_id
scene_pk
sequence
scene_id
extend
prompt
```

---

# 36. Readonly Fields

Frontend tidak boleh mencoba mengubah:

```text
id
created_at
updated_at
```

Backend akan mengontrol field tersebut.

---

# 37. Backend Validation

Untuk:

```text
image
animate_image
extend
```

`scene_pk` wajib tersedia.

Backend akan:

```text
1. mencari yt_scene berdasarkan scene_pk
2. memastikan scene ada
3. mengambil project_id
4. memvalidasi project_id jika frontend mengirimkannya
5. mengisi project_id dari scene
6. untuk animate_image / extend:
   mengisi scene_id jika belum dikirim
```

---

# 38. Project ID Consistency

Frontend boleh mengirim:

```json
{
  "scene_pk": "SCENE_UUID",
  "project_id": "PROJECT_UUID"
}
```

Tetapi:

```text
project_id
```

harus sama dengan project milik:

```text
scene_pk
```

Jika tidak:

```http
400 Bad Request
```

dengan error:

```json
{
  "error": "project_id does not match scene_pk"
}
```

---

# 39. Scene Validation

Create scene membutuhkan:

```text
project_id
scene_id
sequence
```

Jika salah satu tidak ada:

```http
400 Bad Request
```

---

# 40. Request Body Validation

Body harus berupa JSON object.

Tidak valid:

```json
[]
```

Tidak valid:

```json
"hello"
```

Valid:

```json
{
  "title": "My Project"
}
```

---

# 41. Unknown Fields

Frontend boleh mengirim data tambahan, tetapi backend hanya mengambil field yang terdapat dalam daftar editable.

Contoh:

```json
{
  "title": "Project",
  "random_field": "ignored"
}
```

Backend hanya memproses:

```text
title
```

Frontend tetap harus mengikuti contract dan **tidak bergantung pada unknown-field behavior**.

---

# 42. Error Contract

General error:

```json
{
  "error": "Error message"
}
```

Invalid resource:

```json
{
  "error": "Invalid resource",
  "allowed": [
    "project",
    "scene",
    "image",
    "animate_image",
    "extend"
  ]
}
```

---

# 43. HTTP Status

| Status | Meaning |
| --- | --- |
| `200` | Successful GET / UPDATE / DELETE |
| `201` | Successful CREATE |
| `400` | Invalid request / validation / database error |
| `404` | Resource tidak ditemukan |
| `405` | HTTP method tidak didukung |
| `500` | Internal backend error |

---

# 44. No Editable Fields

Jika PATCH/PUT tidak memiliki editable field:

```json
{
  "error": "No editable fields supplied"
}
```

Status:

```http
400
```

---

# 45. Missing ID

PATCH/PUT/DELETE membutuhkan:

```text
id
```

Jika tidak diberikan:

```json
{
  "error": "id is required"
}
```

Status:

```http
400
```

---

# 46. Frontend TypeScript Contract

Frontend dapat menggunakan tipe berikut sebagai source of truth:

```ts
type UUID = string

type YtProject = {
  id: UUID
  title: string
  description: string | null
  aspect_ratio: string
  status: string
  created_at: string
  updated_at: string
}

type YtScene = {
  id: UUID
  project_id: UUID
  scene_id: string
  sequence: number
  start_time: string | null
  end_time: string | null
  duration: number | null
  created_at: string
  updated_at: string
}

type YtImage = {
  id: UUID
  project_id: UUID
  scene_pk: UUID
  prompt: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

type AnimateImagePayload = {
  motion: {
    subject: string
    secondary: string
    environment: string
  }
  camera: {
    movement: string
    direction: string
    speed: string
  }
  timing: {
    start: string
    middle: string
    end: string
  }
  audio: {
    sound: string
    ambience: string
    dialogue: string
  }
}

type YtAnimateImage = {
  id: UUID
  project_id: UUID
  scene_pk: UUID
  sequence: number | null
  scene_id: string | null
  animate_image: AnimateImagePayload
  prompt: string | null
  created_at: string
  updated_at: string
}

type ExtendPayload = {
  continuation: string
  action: string
  subject_motion: string
  environment_motion: string
  camera: string
  ending: string
  audio: string
}

type YtExtend = {
  id: UUID
  project_id: UUID
  scene_pk: UUID
  sequence: number | null
  scene_id: string | null
  extend: ExtendPayload
  prompt: string | null
  created_at: string
  updated_at: string
}
```

---

# 47. API Response Types

```ts
type ApiResponse<T> = {
  data: T
}

type ApiListResponse<T> = {
  data: T[]
  count: number
}

type ApiError = {
  error: string
}
```

Untuk:

```text
resource=all
```

gunakan:

```ts
type YtAllResponse = {
  data: {
    projects: YtProject[]
    scenes: YtScene[]
    images: YtImage[]
    animate_images: YtAnimateImage[]
    extends: YtExtend[]
  }
}
```

---

# 48. Frontend API Mapping

Recommended API abstraction:

```text
ytApi
│
├── projects
│   ├── list()
│   ├── get(id)
│   ├── create(data)
│   ├── update(id, data)
│   └── delete(id)
│
├── scenes
│   ├── list(projectId)
│   ├── get(id)
│   ├── create(data)
│   ├── update(id, data)
│   └── delete(id)
│
├── images
│   ├── list(scenePk)
│   ├── get(id)
│   ├── create(data)
│   ├── update(id, data)
│   └── delete(id)
│
├── animateImages
│   ├── list(scenePk)
│   ├── get(id)
│   ├── create(data)
│   ├── update(id, data)
│   └── delete(id)
│
└── extends
    ├── list(scenePk)
    ├── get(id)
    ├── create(data)
    ├── update(id, data)
    └── delete(id)
```

---

# 49. Gemini Canvas Runtime Rule

Frontend Gemini Canvas Application harus memperlakukan backend sebagai:

```text
SOURCE OF TRUTH
```

Canvas boleh meng-generate:

```text
project data
scene data
image prompt
animate_image prompt
extend prompt
```

tetapi hasil yang akan disimpan harus mengikuti schema contract.

---

# 50. Gemini Generation vs Persistence

Pisahkan:

```text
AI Generation
```

dari:

```text
Persistence
```

Flow:

```text
Gemini
  │
  │ generate
  ▼
Structured JSON
  │
  │ validate
  ▼
Frontend State
  │
  │ POST/PATCH
  ▼
yt Edge Function
  │
  ▼
Supabase
```

Jangan:

```text
Gemini
  │
  └── direct database access
```

---

# 51. Image Generation Flow

```text
Scene
 │
 ▼
Generate Image Prompt
 │
 ▼
Gemini Image Generation
 │
 ▼
Image Result
 │
 ├── image_url
 └── prompt
 │
 ▼
POST yt_image
```

Database menyimpan:

```text
prompt
image_url
```

---

# 52. Animate Image Flow

```text
yt_image
 │
 ▼
Generate Animate Image JSON
 │
 ▼
Animate Image Prompt
 │
 ▼
Google Vids / Video Generation Workflow
 │
 ▼
Video
 │
 ▼
POST yt_animate_image
```

`animate_image` menyimpan structured prompt data.

`prompt` menyimpan final natural-language prompt.

---

# 53. Extend Flow

```text
Existing Video
      │
      ▼
Generate Extend JSON
      │
      ▼
Generate Extend Prompt
      │
      ▼
Google Vids Extend
      │
      ▼
Extended Video
      │
      ▼
POST yt_extend
```

---

# 54. Multiple Extend Flow

```text
Animate Video
     │
     ▼
Extend #1
     │
     ▼
Extended Video #1
     │
     ▼
Extend #2
     │
     ▼
Extended Video #2
     │
     ▼
Extend #3
     │
     ▼
...
```

Database:

```text
yt_extend
```

```text
scene_pk = SCENE_UUID

sequence = 1
sequence = 2
sequence = 3
```

---

# 55. Recommended Frontend State

Frontend state dapat mengikuti:

```ts
type CanvasProjectState = {
  project: YtProject | null

  scenes: YtScene[]

  images: YtImage[]

  animate_images: YtAnimateImage[]

  extends: YtExtend[]
}
```

Tetapi state frontend boleh dinormalisasi sesuai kebutuhan UI.

Database relationship tetap mengikuti backend contract.

---

# 56. Scene-Centric UI Model

Untuk UI, frontend dapat membangun derived model:

```text
Project
│
├── Scene 001
│    ├── Image
│    ├── Animate Image
│    ├── Extend 1
│    └── Extend 2
│
├── Scene 002
│    ├── Image
│    ├── Animate Image
│    ├── Extend 1
│    └── Extend 2
│
└── Scene 003
     ├── Image
     ├── Animate Image
     ├── Extend 1
     └── Extend 2
```

Ini adalah **UI representation**, bukan perubahan schema database.

---

# 57. Initial Load Recommendation

Untuk membuka project:

```text
GET project
        │
        ▼
GET scenes
        │
        ├── GET images
        ├── GET animate_images
        └── GET extends
```

Alternatif initial hydration:

```text
GET resource=all
```

`resource=all` cocok untuk initial load kecil/menengah.

---

# 58. Save Strategy

Frontend sebaiknya menggunakan:

```text
Create
→ POST

Edit
→ PATCH

Delete
→ DELETE
```

Tidak perlu mengirim seluruh object jika hanya satu field berubah.

Contoh:

```http
PATCH /functions/v1/yt?resource=extend&id=EXTEND_UUID
```

```json
{
  "prompt": "Updated prompt..."
}
```

---

# 59. Frontend Must Not

Frontend tidak boleh:

```text
❌ mengakses yt_* langsung untuk workflow normal
❌ menggunakan service_role key
❌ membuat FK sendiri
❌ menganggap scene_id adalah UUID
❌ membuat project_id secara manual
❌ mengubah id
❌ mengubah created_at
❌ mengubah updated_at
❌ membuat schema Extend berbeda untuk setiap Extend
❌ mengasumsikan field database yang tidak ada
```

---

# 60. Frontend May

Frontend boleh:

```text
✓ membuat UI state
✓ membuat derived scene model
✓ generate prompt dengan Gemini
✓ generate image
✓ generate video
✓ menyusun timeline
✓ membuat preview
✓ mengurutkan scene
✓ mengurutkan Extend
✓ melakukan validation sebelum request
✓ menyimpan hasil melalui Edge Function
```

---

# 61. Canonical Workflow

Contract V1 mendefinisikan workflow canonical:

```text
PROJECT
  ↓
SCENE
  ↓
IMAGE
  ↓
ANIMATE IMAGE
  ↓
VIDEO
  ↓
EXTEND #1
  ↓
EXTENDED VIDEO
  ↓
EXTEND #2
  ↓
EXTENDED VIDEO
  ↓
FINAL VIDEO
```

---

# 62. Source of Truth

| Layer | Source of Truth |
| --- | --- |
| UI behavior | Frontend application |
| AI generation | Gemini Canvas |
| API behavior | Edge Function `yt` |
| Relationship | PostgreSQL FK |
| Persistent data | `yt_*` tables |
| Structured Animate data | `yt_animate_image.animate_image` |
| Structured Extend data | `yt_extend.extend` |
| Final prompt | `prompt` column |

---

# 63. V1 Scope

Included:

```text
✓ Project CRUD
✓ Scene CRUD
✓ Image CRUD
✓ Animate Image CRUD
✓ Extend CRUD
✓ Scene relationship validation
✓ Project relationship validation
✓ Multiple Extend
✓ Cascade delete
✓ JSONB prompt payload
✓ Natural-language prompt storage
✓ Gemini Canvas frontend integration contract
```

Not included in V1:

```text
✗ User authentication
✗ Project ownership
✗ API keys
✗ Role authorization
✗ Video file storage
✗ Video rendering backend
✗ Gemini API backend
✗ Google Vids API integration
✗ FFmpeg backend
✗ Realtime synchronization
```

---

# 64. V1 Contract Principle

Frontend harus mengikuti prinsip:

```text
Generate
   ↓
Validate
   ↓
Preview
   ↓
Persist
```

Backend mengikuti:

```text
Receive
   ↓
Validate
   ↓
Normalize relationship
   ↓
Persist
   ↓
Return canonical row
```

Dengan demikian:

```text
Gemini Canvas
      ↓
Frontend
      ↓
yt Edge Function
      ↓
Supabase
```

menjadi satu contract yang konsisten.

---

# 65. Canonical Endpoint Summary

```text
BASE
/functions/v1/yt
```

### GET

```text
GET ?resource=all

GET ?resource=project
GET ?resource=project&id={UUID}

GET ?resource=scene
GET ?resource=scene&id={UUID}
GET ?resource=scene&project_id={UUID}

GET ?resource=image
GET ?resource=image&id={UUID}
GET ?resource=image&scene_pk={UUID}

GET ?resource=animate_image
GET ?resource=animate_image&id={UUID}
GET ?resource=animate_image&scene_pk={UUID}

GET ?resource=extend
GET ?resource=extend&id={UUID}
GET ?resource=extend&scene_pk={UUID}
```

### POST

```text
POST ?resource=project
POST ?resource=scene
POST ?resource=image
POST ?resource=animate_image
POST ?resource=extend
```

### PATCH

```text
PATCH ?resource={resource}&id={UUID}
```

### PUT

```text
PUT ?resource={resource}&id={UUID}
```

### DELETE

```text
DELETE ?resource={resource}&id={UUID}
```

---

# 66. Final Contract

The Gemini Canvas frontend should treat the following as the canonical backend model:

```text
yt_project
    │
    └── yt_scene
          │
          ├── yt_image
          │
          ├── yt_animate_image
          │
          └── yt_extend[]
```

Dengan pipeline:

```text
Scene
  ↓
Image
  ↓
Animate Image
  ↓
Video
  ↓
Extend[]
  ↓
Final Video
```

Dan komunikasi:

```text
Gemini Canvas Application
          │
          ▼
       ytApi
          │
          ▼
/functions/v1/yt
          │
          ▼
   Supabase PostgreSQL
```

**Contract ini adalah boundary antara frontend dan backend V1.**

Perubahan backend yang memengaruhi endpoint, field, relationship, validation, request/response, atau workflow harus dianggap sebagai **contract change** dan sebaiknya dinaikkan menjadi versi berikutnya, misalnya `V2`, bukan diam-diam mengubah perilaku V1.
