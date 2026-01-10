#!/usr/bin/env node

/**
 * ClaudeSurf CLI
 */

import { installHooks } from '../src/install-hooks.js';
import { loadConfig, validateConfig } from '../src/config.js';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'setup':
  case 'install-hooks':
    const force = args.includes('--force');
    const glue = args.includes('--glue');
    const targetIdx = args.indexOf('--target');
    const targetDir = targetIdx >= 0 ? args[targetIdx + 1] : undefined;
    installHooks({ force, glue, targetDir });
    break;

  case 'validate':
    const config = loadConfig();
    const errors = validateConfig(config);
    if (errors.length > 0) {
      console.error('Configuration errors:');
      errors.forEach(e => console.error(`  - ${e}`));
      process.exit(1);
    } else {
      console.log('Configuration is valid');
    }
    break;

  case 'help':
  default:
    console.log(`
ClaudeSurf - Windsurf-like memory and compaction for Claude Code CLI

Usage:
  claudesurf setup [--force] [--glue] [--target <dir>]
    Install hooks to your project

  claudesurf validate
    Validate your claudesurf.config.json

  claudesurf help
    Show this help message

Options:
  --force    Overwrite existing hooks
  --glue     Configure for Glue MCP integration
  --target   Specify custom hooks directory
`);
}
