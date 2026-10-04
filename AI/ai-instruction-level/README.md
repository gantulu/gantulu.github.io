# AI Instruction Level

Standardized instruction architecture from minimal prompts to production-grade AI agents.

## Levels

| Level | Name | Purpose |
|---|---|---|
| LV 0 | Minimal | Smallest usable instruction |
| LV 1 | Basic | Adds objective, input, and output |
| LV 2 | Operational | Adds scope and workflow |
| LV 3 | Controlled | Adds expertise, rules, and constraints |
| LV 4 | Reliable | Adds source-of-truth, evidence, and validation |
| LV 5 | Production Agent | Adds tools, safety, state, memory, quality, error handling, and finalization |

## Design principle

Progressive expansion: use the lowest level that can reliably satisfy the task. Do not add complexity without an operational need.

## Structure

Each level defines a reusable instruction contract rather than a domain-specific prompt.
