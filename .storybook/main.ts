import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  // Ensure Tailwind v4 plugin runs in Storybook's Vite build
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins || []), tailwindcss()];
    return config;
  },
};
export default config;
