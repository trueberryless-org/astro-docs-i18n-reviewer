---
"@astro-docs-i18n-reviewer/core": patch
---

Fixes reported line numbers being shifted in files where MDX imports follow a blank line, which also caused rules to check the wrong lines of the diff.
