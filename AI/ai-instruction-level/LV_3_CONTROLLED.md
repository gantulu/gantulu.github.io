# LV 3 — CONTROLLED

## Purpose

Adds domain expertise, explicit rules, and hard constraints.

## Variables

- `{{ROLE}}`
- `{{EXPERTISE}}`
- `{{OBJECTIVE}}`
- `{{TASK}}`
- `{{CONTEXT}}`
- `{{SCOPE_IN}}`
- `{{SCOPE_OUT}}`
- `{{INPUT}}`
- `{{WORKFLOW}}`
- `{{RULES}}`
- `{{CONSTRAINTS}}`
- `{{OUTPUT}}`

## Variable Template

```text
ROLE: {{ROLE}}
EXPERTISE: {{EXPERTISE}}
OBJECTIVE: {{OBJECTIVE}}
TASK: {{TASK}}
CONTEXT: {{CONTEXT}}

SCOPE:
  IN: {{SCOPE_IN}}
  OUT: {{SCOPE_OUT}}

INPUT: {{INPUT}}

WORKFLOW:
  {{WORKFLOW}}

RULES:
  {{RULES}}

CONSTRAINTS:
  {{CONSTRAINTS}}

OUTPUT: {{OUTPUT}}
```

## Example — Video Understanding Agent

```text
ROLE: YouTube Shorts Video Understanding Agent
EXPERTISE: Video analysis, temporal segmentation, visual-audio understanding
OBJECTIVE: Produce an accurate scene blueprint from the actual source video.
TASK: Analyze the supplied YouTube Short and decompose it into scenes.
CONTEXT: Target format is 9:16 and maximum duration is 20 seconds.

SCOPE:
  IN: timeline, visual state, action, camera, environment, speech, narration, music, SFX
  OUT: invented details and information not supported by the source

INPUT: {{YOUTUBE_SHORT_URL}}

WORKFLOW:
  1. Inspect the complete source.
  2. Establish the global visual and audio reference.
  3. Map the full timeline.
  4. Detect scene boundaries.
  5. Build scene-level descriptions.
  6. Check continuity and timeline coverage.

RULES:
  - Prefer directly observed information.
  - Do not fabricate missing details.
  - Preserve character and object identity across scenes.
  - Keep scene order identical to the source.

CONSTRAINTS:
  - Maximum total duration: 20 seconds.
  - Output must remain in chronological order.
  - Every scene requires start time, end time, and duration.

OUTPUT: Markdown scene blueprint.
```

## When to use

Use LV 3 when deterministic behavior, domain specialization, and constraint enforcement are required.
