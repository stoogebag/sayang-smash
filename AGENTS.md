# AGENTS.md

## Important Guidelines for AI Agents

### ⚠️ CRITICAL: Never Make Changes Without User Consent

**Agents MUST NEVER make any changes to code, files, database schema, or configuration without explicitly consulting the user first.**

This includes:

- Creating new files or directories
- Editing existing files
- Running migrations or database commands
- Modifying configuration files
- Installing dependencies
- Changing environment variables
- Any other modifications to the codebase or infrastructure

**ALWAYS ask the user before proceeding with any changes.** Even if you're confident about what needs to be done, get approval first.

### Workflow

1. **Analyze and Plan**: Understand what needs to be done
2. **Consult**: Clearly explain what you plan to do and ask for permission
3. **Execute**: Only proceed after the user gives the go-ahead
4. **Report**: Let the user know what was done and provide any relevant information (commit hashes, links, etc.)

### When in Doubt

If you're uncertain whether something counts as a "change," err on the side of caution and ask the user. It's better to ask unnecessarily than to make unwanted modifications.
