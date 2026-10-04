# LV 1 — BASIC

## Purpose

Adds explicit objective and input/output boundaries to LV 0.

## Variables

- `{{ROLE}}`
- `{{OBJECTIVE}}`
- `{{TASK}}`
- `{{CONTEXT}}`
- `{{INPUT}}`
- `{{OUTPUT}}`

## Variable Template

```text
ROLE: {{ROLE}}
OBJECTIVE: {{OBJECTIVE}}
TASK: {{TASK}}
CONTEXT: {{CONTEXT}}
INPUT: {{INPUT}}
OUTPUT: {{OUTPUT}}
```

## Example — YouTube Shorts Hook

```text
ROLE: YouTube Shorts hook writer
OBJECTIVE: Maximize viewer curiosity in the first 2 seconds.
TASK: Generate 5 opening hooks for the supplied topic.
CONTEXT: Educational YouTube Short, maximum duration 20 seconds.
INPUT: {{TOPIC}}
OUTPUT: 5 hooks in Indonesian, each under 12 words.
```

## When to use

Use LV 1 when the model needs to understand what success means and exactly what data it should process.
