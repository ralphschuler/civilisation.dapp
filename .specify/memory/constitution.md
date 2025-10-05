# Civilisation DApp Constitution

## Core Principles

### I. Library-First
Every feature starts as a standalone library. Libraries must be self-contained, independently testable, and documented. Clear purpose required—no organizational-only libraries.

### II. CLI Interface
Every library exposes functionality via CLI. Text in/out protocol: stdin/args → stdout, errors → stderr. Support JSON + human-readable formats.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced.

### IV. Integration Testing
Focus areas requiring integration tests: New library contract tests, contract changes, inter-service communication, shared schemas.

### V. Observability
Text I/O ensures debuggability. Structured logging required.

## Additional Constraints

### Technology Stack Requirements
- **Frontend**: React, TypeScript, Vite
- **State Management**: Zustand
- **UI Components**: Radix UI, TailwindCSS
- **Blockchain Interaction**: Viem, @worldcoin/minikit-js, @worldcoin/minikit-react
- **Smart Contracts**: Solidity, OpenZeppelin Contracts, Forge

### Compliance Standards
- Adhere to EIP-2535 Diamond Standard for modular contract architecture.
- Ensure all contracts are audited and verified on-chain.
- Follow best practices for secure Solidity development (e.g., reentrancy guards, access control).

### Deployment Policies
- Deploy contracts to EVM-compatible blockchains (e.g., Ethereum, Layer 2 solutions).
- Use CI/CD pipelines for automated testing and deployment.
- Maintain versioning for all deployed contracts and frontend builds.

## Development Workflow

TODO(SECTION_3_CONTENT): Define code review requirements, testing gates, and deployment approval process.

## Governance

Constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All PRs/reviews must verify compliance. Complexity must be justified. Use runtime development guidance for adherence.

**Version**: 1.0.1 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-10-05