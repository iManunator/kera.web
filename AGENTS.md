# kera.web

## Cursor Cloud specific instructions

As of this setup, the repository contains only `README.md` (a single heading, `# kera.web`). There is no application source code, dependency manifest, or build/lint/test tooling yet, so there is nothing to install, run, lint, test, or build.

Guidance for future agents:
- Once real code lands, re-run environment setup so the update script and this section reflect the actual stack (the repo name suggests a web project, likely Node/TypeScript, but nothing is committed yet — do not assume).
- The configured startup update script installs Node dependencies only if a `package.json` exists (`if [ -f package.json ]; then npm install; fi`). It is a safe no-op while the repo is empty. Update it to match the real package manager (npm/pnpm/yarn) and any additional ecosystems once tooling is added.
