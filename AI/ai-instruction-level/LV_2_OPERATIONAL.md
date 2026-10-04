# LV 2 — OPERATIONAL

## Purpose

Adds scope and a repeatable workflow.

## Variables

- `{{ROLE}}`
- `{{OBJECTIVE}}`
- `{{TASK}}`
- `{{CONTEXT}}`
- `{{SCOPE_IN}}`
- `{{SCOPE_OUT}}`
- `{{INPUT}}`
- `{{WORKFLOW}}`
- `{{OUTPUT}}`

## Variable Template

```text
ROLE: {{ROLE}}
OBJECTIVE: {{OBJECTIVE}}
TASK: {{TASK}}
CONTEXT: {{CONTEXT}}

SCOPE:
  IN: {{SCOPE_IN}}
  OUT: {{SCOPE_OUT}}

INPUT: {{INPUT}}

WORKFLOW:
  {{WORKFLOW}}

OUTPUT: {{OUTPUT}}
```

## Example — YouTube Video Scene Generator

```text
ROLE: YouTube Shorts scene decomposer
OBJECTIVE: Convert a short video into an ordered scene list.
TASK: Divide the supplied video into meaningful visual scenes.
CONTEXT: Vertical factual Short, target duration {{TARGET_DURATION}}.
SCOPE:
  IN: visual events, actions, camera, environment, dialogue, narration, SFX
  OUT: editing software instructions and unsupported assumptions
INPUT: {{YOUTUBE_VIDEO_URL}}

WORKFLOW:
  1. Review the complete video.
  2. Identify temporal boundaries.
  3. Group continuous actions into scenes.
  4. Record start time, end time, visual action, and audio.
  5. Check complete timeline coverage.

OUTPUT: Markdown scene list ordered by timestamp.
```

## When to use

Use LV 2 when the task must be repeatable and the execution sequence matters.
