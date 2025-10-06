# Civilisation DApp

Civilisation DApp is a decentralized application (DApp) for a village-building game. It is designed to run within the World App WebView and provides an engaging gameplay experience with resource management, unit training, and strategic planning.

## Features

- **Frontend**: React + Vite SPA with Zustand stores backed by repository persistence.
- **Worldchain connectivity**: wagmi + viem for read-only calls, MiniKit `sendTransaction` for writes (gas-sponsored inside the World App WebView).
- **UX preferences**: Async-persisted Zustand store using IndexedDB keeps theme, tutorial state, and volume per device.
- **Smart contracts**: OpenZeppelin-powered diamond architecture deployed to Worldchain.
- **Storybook integration**: Component-driven development with Storybook.

## Project Structure

The project is organized as follows:

- **assets/**: Contains images for buildings, resources, and units.
- **configs/**: JSON configurations for game entities like buildings, resources, and units.
- **contracts/**: Smart contracts for the game, including deployment and configuration scripts.
   - `src/core`: Diamond proxy, initializer, and shared interfaces/protocols migrated from the legacy `src.bak` tree.
   - `script/`: Foundry deployment helpers wired to the new core layout.
- **public/**: Static assets for the application.
- **src/**: Source code for the frontend, including components, hooks, and state management.

## Development

To get started with development:

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start the development server:

   ```bash
   bun run dev
   ```

3. Run Storybook for component development:

   ```bash
   bun run storybook
   ```

## Deployment

The application is designed to be deployed within the World App WebView. Ensure all configurations are set correctly before deployment.

## Documentation

The complete documentation set lives in the [`docs/`](docs/index.md) directory and is mirrored to the GitHub wiki. Start with the
[documentation index](docs/index.md) and explore topic-specific guides:

- [Project overview](docs/overview.md)
- [Getting started](docs/getting-started.md)
- [Frontend architecture](docs/frontend.md)
- [Smart contracts](docs/smart-contracts.md)
- [Worldchain architecture & best practices](docs/worldchain-architecture.md)
- [CI/CD workflows](docs/workflows.md)

## Contributing

Contributions are welcome! Please follow the code of conduct and submit pull requests for review.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

