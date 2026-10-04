# LV 0 — MINIMAL

## Purpose

The smallest instruction contract for a simple, deterministic task.

## Variables

- `{{ROLE}}`
- `{{TASK}}`
- `{{CONTEXT}}`
- `{{OUTPUT}}`

## Variable Template

```text
ROLE: {{ROLE}}
TASK: {{TASK}}
CONTEXT: {{CONTEXT}}
OUTPUT: {{OUTPUT}}
```

## Example — YouTube Shorts Title

```text
ROLE: YouTube Shorts title writer
TASK: Create 5 short titles for the provided topic.
CONTEXT: The content is a factual 20-second YouTube Short.
OUTPUT: Return 5 titles, each under 60 characters.
```

## When to use

Use LV 0 when the task is simple and does not require explicit workflow, validation, evidence handling, or complex constraints.
