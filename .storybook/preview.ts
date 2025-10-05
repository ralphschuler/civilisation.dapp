import type { Preview } from '@storybook/react-vite'
// Import global styles so Tailwind and design tokens apply in stories
import "../src/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
