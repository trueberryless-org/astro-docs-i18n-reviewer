---
"@astro-docs-i18n-reviewer/core": patch
---

Fixes lines starting with inline code wrapped in three backticks (e.g. ```` ```foo``` ````) being treated as the start of a code block, which hid all following content from the checks.
