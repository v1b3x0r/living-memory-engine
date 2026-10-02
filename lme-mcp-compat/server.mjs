#!/usr/bin/env node
// Preserve the old package's developer .env precedence before delegation.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const env = fileURLToPath(new URL('.env', import.meta.url));
if (process.env.LME_CONFIG_ISOLATED !== '1' && existsSync(env)) process.loadEnvFile(env);
await import('@nature-labs/living-memory-mcp');
