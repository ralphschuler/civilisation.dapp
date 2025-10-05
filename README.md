# Civilisation DApp

Civilisation DApp is a decentralized application (DApp) for a village-building game. It is designed to run within the World App WebView and provides an engaging gameplay experience with resource management, unit training, and strategic planning.

## Features

- **Frontend**: Built with React, Vite, and Zustand for state management.
- **Custom Hooks**: Includes a `useGameState` hook for managing game logic.
- **Persistence**: Game progress is saved using Web `localStorage`.
- **Smart Contracts**: Utilizes OpenZeppelin libraries for secure and upgradeable contracts.
- **Storybook Integration**: Component-driven development with Storybook.

## Project Structure

The project is organized as follows:

- **assets/**: Contains images for buildings, resources, and units.
- **configs/**: JSON configurations for game entities like buildings, resources, and units.
- **contracts/**: Smart contracts for the game, including deployment and configuration scripts.
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

## Contributing

Contributions are welcome! Please follow the code of conduct and submit pull requests for review.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

