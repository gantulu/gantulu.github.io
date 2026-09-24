# Google Vids Animate Image + Extend Prompt Engine

## Documentation V1

> **Status:** V1  
> **Purpose:** Generate production-ready prompts for Google Vids AI video workflows  
> **Modes:** `animate_image` + `extend`  
> **Primary use case:** YouTube Shorts cinematic image-to-video pipeline

---

# 1. Overview

Dokumentasi ini mendefinisikan sistem Prompt Engine untuk menghasilkan prompt yang digunakan pada workflow AI video di **Google Vids**.

Engine memiliki dua operasi utama:

```
IMAGE
  │
  ▼
ANIMATE IMAGE
  │
  ▼
VIDEO CLIP
  │
  ▼
EXTEND
  │
  ▼
CONTINUATION CLIP
```

Kedua operasi memiliki tujuan berbeda.

### Animate Image

Mengubah gambar statis menjadi video dengan memberikan instruksi mengenai:

- action
- motion
- camera
- environment motion
- lighting
- audio

### Extend

Melanjutkan video yang sudah ada dari titik akhirnya dengan memberikan instruksi mengenai:

- next action
- next motion
- camera continuation
- environment continuation
- audio continuation

---

# 2. Core Principle

## Animate

> **Make the provided image come alive.**

Animate menggunakan gambar sebagai starting visual.

```
Source Image
+
Animation Prompt
=
Video Clip
```

---

## Extend

> **Continue what is already happening.**

Extend menggunakan video sebelumnya sebagai context.

```
Previous Video
+
Continuation Prompt
=
Extended Video
```

---

# 3. Important Distinction

Jangan memperlakukan `Animate` dan `Extend` sebagai dua prompt untuk membuat scene independen.

### Salah

```
Scene 01 → Animate
Scene 02 → Extend as completely new scene
Scene 03 → Extend as completely new scene
```

### Benar

```
Image
  ↓
Animate
  ↓
Video 01
  ↓
Extend
  ↓
Video 02
  ↓
Extend
  ↓
Video 03
```

Setiap Extend harus melanjutkan keadaan visual dan aksi dari video sebelumnya.

---

# 4. Google Vids Input Model

Google Vids AI video workflow pada dasarnya bekerja dengan:

## Animate Image

```
Image
+
Text Prompt
```

## Extend

```
Existing Video
+
Text Prompt
```

Field seperti:

```
scene_id
start_time
end_time
duration
image_url
```

bukan merupakan parameter prompt Google Vids.

Field tersebut dapat digunakan oleh aplikasi sebagai **internal metadata**, tetapi tidak boleh diperlakukan sebagai Google Vids API parameters.

---

# 5. Prompt Engine Architecture

```
                 ┌─────────────────────┐
                 │      scene[]         │
                 │   Story / Timeline   │
                 └──────────┬──────────┘
                            │
                 ┌──────────▼──────────┐
                 │   Prompt Engine     │
                 └──────────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ANIMATE IMAGE                    EXTEND
              │                           │
              ▼                           ▼
       Animate Prompt              Extend Prompt
              │                           │
              ▼                           ▼
          Google Vids                Google Vids
```

---

# 6. Prompt Engine Modes

```
{
  "mode": "animate_image"
}
```

atau:

```
{
  "mode": "extend"
}
```

---

# 7. Animate Image

## 7.1 Purpose

`animate_image` digunakan untuk memberikan gerakan pada gambar sumber.

Tujuannya bukan mendeskripsikan ulang gambar secara lengkap.

Tujuan utamanya adalah menjawab:

> Apa yang harus bergerak?

> Bagaimana gerakannya?

> Bagaimana kamera bergerak?

> Bagaimana lingkungan bereaksi?

---

# 8. Animate Image Variables

Recommended V1 schema:

```
{
  "action": "",
  "motion": "",
  "camera": "",
  "environment_motion": "",
  "lighting_motion": "",
  "audio": ""
}
```

---

# 9. Animate Variable Specification

## `action`

Menentukan tindakan utama subject.

Contoh:

```
The woman slowly walks toward the ocean.
```

Contoh lain:

```
The man turns his head toward the approaching train.
```

---

## `motion`

Menentukan karakteristik gerakan.

Contoh:

```
Her hair and clothing move gently in the wind.
```

```
The character moves naturally and subtly.
```

```
Dust particles drift through the air.
```

---

## `camera`

Menentukan camera movement.

Contoh:

```
slowly pushes forward
```

```
gently tracks alongside the subject
```

```
slowly pans to the right
```

```
gradually pulls back
```

Prompt hasil:

```
The camera slowly pushes forward.
```

---

## `environment_motion`

Menentukan gerakan lingkungan.

Contoh:

```
Small waves continuously move toward the shore.
```

```
Tree branches sway gently in the wind.
```

```
Steam slowly rises from the cup.
```

---

## `lighting_motion`

Menentukan perubahan atau dinamika cahaya.

Contoh:

```
Warm sunlight softly flickers through the leaves.
```

```
City lights create subtle reflections on the wet street.
```

---

## `audio`

Menentukan audio ambience atau sound effect yang diinginkan.

Contoh:

```
Gentle ocean waves and soft coastal ambience.
```

```
Subtle city traffic and distant street ambience.
```

Audio sebaiknya digunakan ketika memang relevan terhadap scene.

---

# 10. Animate Image Prompt Template

Recommended V1:

```
Animate the provided image into a cinematic video.

{{action}}.

{{motion}}

The camera {{camera}}.

{{environment_motion}}

{{lighting_motion}}

{{audio}}

Preserve the original subject identity, appearance, composition, environment, objects, colors, lighting, and visual style.

Keep all movement natural, physically believable, and continuous with the source image.
Avoid unnecessary changes or new objects.
```

---

# 11. Animate Prompt Rules

## Rule 1 — Jangan mendeskripsikan ulang gambar

Jika gambar sudah menunjukkan:

```
A woman standing on a beach at sunset.
```

Jangan mengulang:

```
A beautiful young woman with long brown hair wearing a white dress stands on a sandy beach during a golden sunset...
```

Lebih baik:

```
She slowly walks toward the water.

Her dress and hair move gently in the ocean breeze.

The camera slowly tracks alongside her.
```

---

# 12. Rule 2 — Fokus pada perubahan

Animate prompt harus menjelaskan:

```
WHAT CHANGES
```

bukan:

```
WHAT ALREADY EXISTS
```

### Good

```
The character slowly raises her hand.
```

### Less useful

```
A woman with long hair stands in a beautiful landscape.
```

---

# 13. Rule 3 — Pertahankan visual identity

Tambahkan preservation instruction:

```
Preserve the original subject identity, appearance, composition, environment, objects, colors, lighting, and visual style.
```

Tujuannya mengurangi perubahan yang tidak diperlukan.

---

# 14. Rule 4 — Gerakan harus physically coherent

Gunakan:

```
natural
subtle
smooth
continuous
physically believable
```

Hindari instruksi yang saling bertentangan.

### Bad

```
The camera rapidly spins around the subject while the subject remains perfectly still and the environment changes dramatically.
```

### Better

```
The camera slowly arcs around the subject while the subject remains naturally still.
```

---

# 15. Rule 5 — Jangan menambahkan objek tanpa alasan

Gunakan:

```
Avoid unnecessary changes or new objects.
```

Ini membantu menjaga kontinuitas dari source image.

---

# 16. Animate Example

## Input

```
{
  "action": "The woman slowly walks toward the ocean",
  "motion": "Her hair and dress move gently in the ocean breeze",
  "camera": "slowly tracks alongside her",
  "environment_motion": "Small waves continuously roll toward the shore",
  "lighting_motion": "Warm sunset light softly reflects across the water",
  "audio": "Gentle ocean waves and coastal ambience"
}
```

## Generated Prompt

```
Animate the provided image into a cinematic video.

The woman slowly walks toward the ocean.

Her hair and dress move gently in the ocean breeze.

The camera slowly tracks alongside her.

Small waves continuously roll toward the shore.

Warm sunset light softly reflects across the water.

Gentle ocean waves and coastal ambience.

Preserve the original subject identity, appearance, composition, environment, objects, colors, lighting, and visual style.

Keep all movement natural, physically believable, and continuous with the source image.
Avoid unnecessary changes or new objects.
```

---

# 17. Extend

## 17.1 Purpose

`extend` digunakan setelah video pertama dibuat.

Extend tidak perlu mendeskripsikan ulang scene sebelumnya.

Extend harus menjawab:

> Apa yang terjadi selanjutnya?

---

# 18. Extend Variables

Recommended V1:

```
{
  "next_action": "",
  "next_motion": "",
  "camera_continuation": "",
  "environment_continuation": "",
  "audio_continuation": ""
}
```

---

# 19. Extend Variable Specification

## `next_action`

Aksi berikutnya.

Contoh:

```
she stops at the edge of the water and looks toward the horizon
```

---

## `next_motion`

Gerakan lanjutan.

Contoh:

```
Her hair continues to move gently in the breeze.
```

---

## `camera_continuation`

Gerakan kamera berikutnya.

Contoh:

```
slowly moves behind her
```

Prompt:

```
The camera slowly moves behind her.
```

---

## `environment_continuation`

Pergerakan environment yang tetap konsisten.

Contoh:

```
The waves continue moving gently around her feet.
```

---

## `audio_continuation`

Audio yang melanjutkan ambience sebelumnya.

Contoh:

```
Continue the sound of gentle ocean waves and coastal ambience.
```

---

# 20. Extend Prompt Template

Recommended V1:

```
Continue naturally from the end of the previous video.

Then {{next_action}}.

{{next_motion}}

The camera {{camera_continuation}}.

{{environment_continuation}}

{{audio_continuation}}

Maintain the same subject identity, appearance, environment, lighting, color palette, visual style, and cinematic continuity.

Make the continuation feel like one uninterrupted sequence.
```

---

# 21. Extend Rules

## Rule 1 — Mulai dari akhir video

Gunakan:

```
Continue naturally from the end of the previous video.
```

---

## Rule 2 — Gunakan `Then`

Contoh:

```
Then the character slowly turns toward the doorway.
```

Ini memberikan hubungan temporal yang jelas.

---

## Rule 3 — Jangan reset scene

### Bad

```
A woman stands on a beach at sunset.
```

### Better

```
Then she stops walking and looks toward the horizon.
```

Extend harus menganggap keadaan sebelumnya masih berlangsung.

---

# 22. Extend Example

## Previous Video

Ending:

```
The woman reaches the shoreline.
```

## Variables

```
{
  "next_action": "she stops at the edge of the water and looks toward the horizon",
  "next_motion": "Her hair and dress continue moving gently in the ocean breeze",
  "camera_continuation": "slowly moves behind her",
  "environment_continuation": "Small waves continue reaching her feet",
  "audio_continuation": "Continue the sound of gentle ocean waves and coastal ambience"
}
```

## Generated Prompt

```
Continue naturally from the end of the previous video.

Then she stops at the edge of the water and looks toward the horizon.

Her hair and dress continue moving gently in the ocean breeze.

The camera slowly moves behind her.

Small waves continue reaching her feet.

Continue the sound of gentle ocean waves and coastal ambience.

Maintain the same subject identity, appearance, environment, lighting, color palette, visual style, and cinematic continuity.

Make the continuation feel like one uninterrupted sequence.
```

---

# 23. Animate vs Extend

| Feature | Animate Image | Extend |
|---|---|---|
| Starting input | Image | Existing video |
| Main purpose | Animate image | Continue video |
| Action | Initial action | Next action |
| Motion | Initial motion | Continuation motion |
| Camera | Initial camera | Camera continuation |
| Environment | Initial motion | Environment continuation |
| Audio | Initial audio | Audio continuation |
| Identity preservation | Required | Required |
| Continuity | From image | From previous video |
| Scene reset | No | No |
| New visual context | Source image | Existing video |

---

# 24. Prompt Length Strategy

Prompt tidak harus panjang.

Prioritaskan:

```
ACTION
+
MOTION
+
CAMERA
+
CONTINUITY
```

Contoh minimal:

```
The woman slowly turns toward the ocean.

Her hair moves gently in the breeze.

The camera slowly pushes forward.

Maintain the original visual identity and environment.
```

Prompt ini lebih berguna daripada paragraf panjang yang mengulang isi image.

---

# 25. Cinematography Vocabulary

Prompt Engine dapat menggunakan vocabulary berikut.

## Camera Movement

```
slow push-in
slow pull-back
gentle pan left
gentle pan right
slow tilt up
slow tilt down
tracking shot
dolly forward
dolly backward
arc around the subject
camera follows the subject
camera remains static
subtle handheld movement
```

---

# 26. Subject Motion Vocabulary

```
walks slowly
turns naturally
looks around
raises a hand
lowers a hand
takes a step forward
leans forward
turns toward the camera
looks toward the horizon
breathes naturally
moves gently
reaches forward
```

---

# 27. Environmental Motion Vocabulary

```
wind moves the leaves
water ripples gently
waves roll toward the shore
smoke rises slowly
steam drifts upward
dust particles float through the air
rain falls gently
clouds move slowly
grass sways in the wind
fabric moves naturally
```

---

# 28. Lighting Motion Vocabulary

```
sunlight shifts subtly
warm light reflects on the water
soft shadows move naturally
city lights shimmer
light flickers gently
reflections move across the surface
```

---

# 29. Audio Vocabulary

```
soft ambient sound
gentle ocean waves
light wind ambience
distant city traffic
subtle room ambience
natural environmental sound
soft footsteps
gentle rain
```

---

# 30. Internal JSON Model

Prompt Engine dapat menggunakan:

```
{
  "google_vids_prompt": {
    "mode": "animate_image",
    "variables": {
      "action": "",
      "motion": "",
      "camera": "",
      "environment_motion": "",
      "lighting_motion": "",
      "audio": ""
    },
    "generated_prompt": ""
  }
}
```

Extend:

```
{
  "google_vids_prompt": {
    "mode": "extend",
    "variables": {
      "next_action": "",
      "next_motion": "",
      "camera_continuation": "",
      "environment_continuation": "",
      "audio_continuation": ""
    },
    "generated_prompt": ""
  }
}
```

---

# 31. Recommended Scene Relationship

`scene[]` tetap berfungsi sebagai master storyboard.

Contoh:

```
{
  "scene_id": 1,
  "action": "The woman walks toward the ocean",
  "video_operation": "animate_image"
}
```

Kemudian:

```
{
  "scene_id": 2,
  "action": "She stops and looks toward the horizon",
  "video_operation": "extend"
}
```

Kemudian:

```
{
  "scene_id": 3,
  "action": "She turns toward the camera",
  "video_operation": "extend"
}
```

---

# 32. Pipeline

```
                  SCRIPT
                    │
                    ▼
                  SCENE[]
                    │
                    ▼
              IMAGE GENERATION
                    │
                    ▼
               SOURCE IMAGE
                    │
                    ▼
             ANIMATE IMAGE
                    │
                    ▼
                 VIDEO 1
                    │
                    ▼
                 EXTEND
                    │
                    ▼
                 VIDEO 2
                    │
                    ▼
                 EXTEND
                    │
                    ▼
                 VIDEO 3
                    │
                    ▼
                FFmpeg
                    │
                    ▼
              FINAL SHORT
```

---

# 33. Recommended Application Architecture

```
Prompt Engine
│
├── Animate Prompt Generator
│   ├── Action
│   ├── Motion
│   ├── Camera
│   ├── Environment Motion
│   ├── Lighting Motion
│   └── Audio
│
└── Extend Prompt Generator
    ├── Next Action
    ├── Next Motion
    ├── Camera Continuation
    ├── Environment Continuation
    └── Audio Continuation
```

---

# 34. Generator Algorithm

## Animate

```
INPUT:
source_image
action
motion
camera
environment_motion
lighting_motion
audio

PROCESS:

1. Read animation variables.
2. Remove empty variables.
3. Build natural-language sentences.
4. Add preservation instructions.
5. Add motion coherence instructions.
6. Output final prompt.
```

---

## Extend

```
INPUT:
previous_video
next_action
next_motion
camera_continuation
environment_continuation
audio_continuation

PROCESS:

1. Read continuation variables.
2. Remove empty variables.
3. Start with continuation instruction.
4. Describe next action.
5. Describe continuation motion.
6. Describe camera continuation.
7. Describe environment continuation.
8. Preserve visual continuity.
9. Output final prompt.
```

---

# 35. Empty Variable Handling

Jangan menghasilkan:

```
The camera .

.
```

Jika variable kosong, bagian tersebut harus dihapus.

Contoh:

```
{
  "action": "The character walks forward",
  "motion": "",
  "camera": "slowly pushes forward"
}
```

Output:

```
The character walks forward.

The camera slowly pushes forward.

Preserve the original visual identity, environment, and composition.
```

---

# 36. Prompt Validation

Sebelum prompt dikirim ke Google Vids, engine harus memeriksa:

```
[ ] Action exists
[ ] Motion is coherent
[ ] Camera does not contradict action
[ ] Environment remains consistent
[ ] No unnecessary scene reset
[ ] No unnecessary object introduction
[ ] Continuity instruction exists
```

---

# 37. Animate Validation

Minimum:

```
action != ""
```

Recommended:

```
action
+
motion OR camera
```

Contoh valid:

```
The character slowly turns toward the camera.

The camera gently pushes forward.
```

---

# 38. Extend Validation

Minimum:

```
next_action != ""
```

Recommended:

```
next_action
+
next_motion OR camera_continuation
```

Contoh valid:

```
Then she walks toward the doorway.

The camera slowly follows behind her.
```

---

# 39. Continuity Rules

Untuk Extend:

```
Subject identity → preserve
Clothing → preserve
Environment → preserve
Lighting → preserve
Color palette → preserve
Objects → preserve
Visual style → preserve
Spatial relationship → preserve
```

Perubahan hanya dilakukan apabila memang merupakan bagian dari aksi.

---

# 40. Scene Transition Rules

Jika scene berikutnya masih berada di environment yang sama:

```
Use Extend.
```

Jika membutuhkan environment baru secara fundamental:

```
Generate a new image.
Then use Animate Image.
```

Contoh:

```
Beach → Ocean
```

masih dapat menggunakan Extend.

Tetapi:

```
Beach → Tokyo city
```

dapat lebih tepat dibuat sebagai:

```
New Image
+
Animate Image
```

daripada memaksa Extend melakukan perubahan environment besar.

---

# 41. Decision Tree

```
Do we already have a video?
        │
        ├── NO
        │    │
        │    ▼
        │  Do we have an image?
        │    │
        │    └── YES
        │         │
        │         ▼
        │    ANIMATE IMAGE
        │
        └── YES
             │
             ▼
       Is the next action
       continuous?
             │
        ┌────┴────┐
        │         │
       YES        NO
        │         │
        ▼         ▼
      EXTEND   NEW IMAGE
                   │
                   ▼
                ANIMATE
```

---

# 42. Recommended Prompt Style

Gunakan gaya:

```
Direct
Visual
Temporal
Action-oriented
Cinematic
Concise
```

Hindari:

```
Abstract
Overly descriptive
Repeated image description
Contradictory instructions
Unnecessary technical parameters
```

---

# 43. Anti-Patterns

## Jangan

```
Duration: 8 seconds
```

dianggap sebagai parameter prompt Animate.

---

## Jangan

```
Aspect ratio: 9:16
```

dianggap sebagai prompt variable.

---

## Jangan

```
scene_id: 03
start_time: 00:16
end_time: 00:24
```

dimasukkan ke prompt kecuali memang dibutuhkan oleh aplikasi internal.

---

## Jangan

```
Generate a completely different scene.
```

dalam Extend jika tujuan sebenarnya adalah continuity.

---

# 44. Internal Metadata vs Google Vids Prompt

Pemisahan ini wajib dipertahankan.

## Application metadata

```
{
  "scene_id": 3,
  "start_time": "00:16",
  "end_time": "00:24",
  "duration": 8,
  "video_operation": "extend"
}
```

## Google Vids prompt

```
Continue naturally from the end of the previous video.

Then the character turns toward the doorway.

The camera slowly follows behind her.

Maintain visual and cinematic continuity.
```

Metadata tidak perlu masuk ke prompt.

---

# 45. Recommended V1 Schema

```
{
  "video_operation": "animate_image",
  "source_image": "",
  "variables": {
    "action": "",
    "motion": "",
    "camera": "",
    "environment_motion": "",
    "lighting_motion": "",
    "audio": ""
  },
  "generated_prompt": ""
}
```

Extend:

```
{
  "video_operation": "extend",
  "source_video": "",
  "variables": {
    "next_action": "",
    "next_motion": "",
    "camera_continuation": "",
    "environment_continuation": "",
    "audio_continuation": ""
  },
  "generated_prompt": ""
}
```

---

# 46. Final Animate Template

```
Animate the provided image into a cinematic video.

{{action}}.

{{motion}}

The camera {{camera}}.

{{environment_motion}}

{{lighting_motion}}

{{audio}}

Preserve the original subject identity, appearance, composition, environment, objects, colors, lighting, and visual style.

Keep all movement natural, physically believable, and continuous with the source image.
Avoid unnecessary changes or new objects.
```

---

# 47. Final Extend Template

```
Continue naturally from the end of the previous video.

Then {{next_action}}.

{{next_motion}}

The camera {{camera_continuation}}.

{{environment_continuation}}

{{audio_continuation}}

Maintain the same subject identity, appearance, environment, lighting, color palette, visual style, and cinematic continuity.

Make the continuation feel like one uninterrupted sequence.
```

---

# 48. Example Complete Workflow

## Step 1 — Source Image

```
Woman walking on a beach at sunset.
```

---

## Step 2 — Animate

Variables:

```
{
  "action": "The woman slowly walks toward the ocean",
  "motion": "Her hair and dress move gently in the breeze",
  "camera": "slowly tracks alongside her",
  "environment_motion": "Small waves continuously move toward the shore",
  "lighting_motion": "Warm sunset reflections shimmer across the water",
  "audio": "Gentle ocean waves and coastal ambience"
}
```

Output:

```
Animate the provided image into a cinematic video.

The woman slowly walks toward the ocean.

Her hair and dress move gently in the breeze.

The camera slowly tracks alongside her.

Small waves continuously move toward the shore.

Warm sunset reflections shimmer across the water.

Gentle ocean waves and coastal ambience.

Preserve the original subject identity, appearance, composition, environment, objects, colors, lighting, and visual style.

Keep all movement natural, physically believable, and continuous with the source image.
Avoid unnecessary changes or new objects.
```

---

## Step 3 — Extend

Variables:

```
{
  "next_action": "she stops at the water and looks toward the horizon",
  "next_motion": "Her hair continues moving gently in the breeze",
  "camera_continuation": "slowly moves behind her",
  "environment_continuation": "Small waves continue reaching her feet",
  "audio_continuation": "Continue the gentle ocean waves and coastal ambience"
}
```

Output:

```
Continue naturally from the end of the previous video.

Then she stops at the water and looks toward the horizon.

Her hair continues moving gently in the breeze.

The camera slowly moves behind her.

Small waves continue reaching her feet.

Continue the gentle ocean waves and coastal ambience.

Maintain the same subject identity, appearance, environment, lighting, color palette, visual style, and cinematic continuity.

Make the continuation feel like one uninterrupted sequence.
```

---

# 49. Recommended V1 Product Contract

Prompt Engine menerima:

```
mode
+
variables
```

dan mengembalikan:

```
generated_prompt
```

### Animate

```
mode = animate_image
```

### Extend

```
mode = extend
```

---

# 50. Final Design Principle

Arsitektur V1 harus mempertahankan pemisahan berikut:

```
                STORY
                  │
                  ▼
               scene[]
                  │
                  ▼
          Prompt Engine
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
     ANIMATE              EXTEND
        │                   │
        ▼                   ▼
      IMAGE              VIDEO
        │                   │
        ▼                   ▼
     VIDEO 1            VIDEO N+1
```

Dengan prinsip:

```
ANIMATE
= Image → First Video

EXTEND
= Existing Video → Continuation
```

dan:

```
scene[]
= Storyboard / Timeline

animate_prompt
= Motion instruction for source image

extend_prompt
= Continuation instruction for existing video
```

---

# 51. V1 Locked Prompt Templates

## Animate Image

```
Animate the provided image into a cinematic video.

{{action}}.

{{motion}}

The camera {{camera}}.

{{environment_motion}}

{{lighting_motion}}

{{audio}}

Preserve the original subject identity, appearance, composition, environment, objects, colors, lighting, and visual style.

Keep all movement natural, physically believable, and continuous with the source image.
Avoid unnecessary changes or new objects.
```

## Extend

```
Continue naturally from the end of the previous video.

Then {{next_action}}.

{{next_motion}}

The camera {{camera_continuation}}.

{{environment_continuation}}

{{audio_continuation}}

Maintain the same subject identity, appearance, environment, lighting, color palette, visual style, and cinematic continuity.

Make the continuation feel like one uninterrupted sequence.
```

---

# 52. V1 Variable Contract

## Animate

```
{
  "action": "",
  "motion": "",
  "camera": "",
  "environment_motion": "",
  "lighting_motion": "",
  "audio": ""
}
```

## Extend

```
{
  "next_action": "",
  "next_motion": "",
  "camera_continuation": "",
  "environment_continuation": "",
  "audio_continuation": ""
}
```

---

# 53. Source of Truth

Untuk implementasi aplikasi, gunakan dokumentasi resmi Google sebagai source of truth untuk behavior Google Vids:

- Google Docs Editors Help — AI video clips in Google Vids
- Google Cloud — Veo prompting documentation

**Catatan:** field internal Prompt Engine dalam dokumentasi ini adalah desain aplikasi, bukan klaim bahwa Google Vids mengekspos field-field tersebut sebagai parameter API.

Referensi resmi:

- Google Vids — AI video clips: https://support.google.com/docs/answer/16143507
- Google Cloud — Veo prompting guide: https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1

---

# 54. Versioning

## V1

```
animate_image
extend
```

Animate variables:

```
action
motion
camera
environment_motion
lighting_motion
audio
```

Extend variables:

```
next_action
next_motion
camera_continuation
environment_continuation
audio_continuation
```

Template V1 tidak boleh diubah secara diam-diam.

Perubahan struktur harus menjadi:

```
V2
V3
...
```

sehingga kompatibilitas dengan pipeline sebelumnya tetap terjaga.
