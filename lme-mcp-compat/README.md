# @nature-labs/lme-mcp — compatibility package

Version 0.1.3 delegates to exactly `@nature-labs/living-memory-mcp@0.1.3`.
The canonical name is now **@nature-labs/living-memory-mcp**.

Existing `npx -y @nature-labs/lme-mcp` registrations can keep their command.
Both names start the same server, use the same environment configuration and
store path, and expose the same tools. They do not copy or migrate memory.

Read [the canonical package guide](https://github.com/v1b3x0r/living-memory-engine/tree/main/lme-mcp).
Node >=20.12 is required. The upgrade adds private storage checks, operation
locking and embedding identity checks: legacy stores need explicit adoption,
and unsafe permissions need correction before writing. Do not interpret a
refused operation as an empty store or create a replacement over your memories.

For reproducible client configuration, pin `@nature-labs/lme-mcp@0.1.3`.
For new installations, use `@nature-labs/living-memory-mcp@0.1.3`.
