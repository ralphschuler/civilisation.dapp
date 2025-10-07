import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public", "../assets"],
  // Ensure Tailwind v4 plugin runs in Storybook's Vite build
  viteFinal: async (config) => {
    // Dynamically import Tailwind's Vite plugin to avoid CJS export issues
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    config.plugins = [...(config.plugins || []), tailwindcss()];
    // Mirror Vite alias used in the app
    config.resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        "@": path.resolve(__dirname, "../src"),
      },
    };
    return config;
  },
};
export default config;
