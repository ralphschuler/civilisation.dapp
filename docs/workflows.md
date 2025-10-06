# Continuous Integration & Deployment

GitHub Actions automate quality checks, deployments, and documentation updates for the Civilisation DApp. This page summarises each workflow and how to operate them.

## Workflow overview

| Workflow | File | Trigger | Purpose |
| -------- | ---- | ------- | ------- |
| Lint | `.github/workflows/lint.yml` | Push / PR | Run ESLint, TypeScript checks, and Vitest to guarantee code quality. |
| Deploy App | `.github/workflows/deploy-app.yml` | Manual / Release | Builds the frontend and deploys static assets. |
| Deploy Contracts | `.github/workflows/deploy-contracts.yml` | Manual | Broadcasts Foundry deployment scripts to Worldchain. |
| Create Pre-release | `.github/workflows/create-prerelease.yml` | Manual | Generates tagged pre-releases for testers. |
| Codex Auto-Fix | `.github/workflows/codex-autofix.yml` | On failed workflows | Invokes Codex to propose fixes when CI breaks. |
| Codex Review | `.github/workflows/codex-review.yml` | Pull requests | Uses Codex to provide automated review feedback. |
| Codex Triage | `.github/workflows/codex-triage.yml` | New issues | Drafts issue summaries and labels via Codex. |
| Codex Document | `.github/workflows/codex-document.yml` | Manual / PR label | Generates or updates missing docs with Codex assistance. |
| Wiki Deploy | `.github/workflows/wiki-deploy.yml` | Push to `main` / Manual | Syncs the `docs/` directory to the GitHub wiki repository. |

## Operating guidelines

- **Manual runs**: Use `workflow_dispatch` for tasks that require human approval, like deployments or documentation updates.
- **Secrets management**: Store API keys (OpenAI, RPC endpoints, deployer keys) in repository secrets. Workflows fail fast if secrets are missing.
- **Environments**: Protect production deployments via GitHub Environments with required reviewers.

## Adding new workflows

1. Create the workflow file under `.github/workflows/` following the naming convention `snake-case.yml`.
2. Define the trigger (`on:`) and minimal permissions required.
3. Document the workflow here and in the relevant README or wiki section.
4. When automation relies on Codex, reuse prompts from existing Codex workflows and keep prompts concise with clear deliverables.

## Troubleshooting

- Check the Actions run logs for step-level failures.
- Confirm secrets are configured whenever a workflow complains about missing tokens.
- For documentation sync issues, ensure the wiki repository is initialised and that the `GITHUB_TOKEN` has write permissions.

## Release checklist

1. Run `bun run lint` and `bun run build` locally.
2. Execute Storybook smoke tests if UI changes were made.
3. Deploy contracts to a staging environment and update `.env` values.
4. Trigger the `wiki-deploy` workflow after merging documentation changes.
