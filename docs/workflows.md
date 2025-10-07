# Continuous Integration & Deployment

GitHub Actions automate quality checks, deployments, and documentation updates for the Civilisation DApp. This page summarises each workflow and how to operate them.

## Workflow overview

| Workflow           | File                                      | Trigger                           | Purpose |
| ------------------ | ----------------------------------------- | --------------------------------- | ------- |
| Lint App           | `.github/workflows/lint-app.yml`          | Push / PR / Manual                | Run the frontend ESLint suite against `src/` changes. |
| Lint Contracts     | `.github/workflows/lint-contracts.yml`    | Push / PR / Manual                | Run Solidity linters against the Foundry project. |
| Test Web App       | `.github/workflows/test-app.yml`          | Push / PR / Manual                | Install Bun dependencies and execute the Vitest suite for the React client. |
| Test Smart Contracts | `.github/workflows/test-contracts.yml`  | Push / PR / Manual                | Provision Foundry and run the `forge test` suite for Solidity contracts. |
| Deploy App         | `.github/workflows/deploy-app.yml`        | Manual / Release                  | Build the frontend and deploy static assets. |
| Deploy Contract    | `.github/workflows/deploy-contract.yml`   | Manual                            | Broadcast Foundry deployment scripts to Worldchain. |
| Deploy Wiki        | `.github/workflows/deploy-wiki.yml`       | Push to `main` / Manual           | Sync the `docs/` directory to the GitHub wiki repository. |
| Auto Prerelease    | `.github/workflows/auto-prerelease.yml`   | Workflow run / Manual (dispatch)  | Create prerelease tags when automated QA succeeds. |
| AI Auto-Fix        | `.github/workflows/ai-autofix.yml`        | Failed workflow_run completion    | Use the OpenAI Codex action to remediate CI failures and raise a PR. |
| AI Review          | `.github/workflows/ai-review.yml`         | Pull requests                     | Provide automated review feedback using the OpenAI Codex action. |
| AI Triage          | `.github/workflows/ai-triage.yml`         | New issues                        | Draft issue summaries and labels via the OpenAI Codex action. |
| AI Document        | `.github/workflows/ai-document.yml`       | Push (excluding AI branches) / Manual | Refresh project documentation with the OpenAI Codex action. |

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
