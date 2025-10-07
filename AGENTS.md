# Agent Onboarding

Welcome to the Civilization DApp repository. Please keep the following guidelines in mind whenever you work in this tree:

1. **Plan & Communicate**
   - Review the `roadmap/` milestone briefs to understand current priorities and progress expectations before making changes.
   - Document any meaningful scope or dependency shifts directly in the relevant roadmap milestone so the plan stays accurate.

2. **Documentation Discipline**
   - Any code, configuration, or workflow change must be reflected in the appropriate docs under `docs/` (and wiki mirrors when applicable) and, if relevant, in the roadmap milestone summaries.
   - Keep changelog-style notes concise and actionable so follow-up contributors can quickly absorb context.

3. **Quality Gates**
   - Run the full lint suite with `bun run lint`.
   - Execute the web tests via `bun run test:web` and the smart contract suite with `bun run test:contracts`.
   - Only ship changes once all linters and tests pass locally or in CI.

4. **Pull Request Hygiene**
   - Provide clear PR summaries that link implemented work to roadmap milestones.
   - Highlight any manual steps required for reviewers (migrations, environment variables, etc.).

Thanks for keeping the project healthy!
