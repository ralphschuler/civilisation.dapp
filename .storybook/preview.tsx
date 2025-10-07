import type { Preview, Decorator } from "@storybook/react-vite";
import React, { useEffect } from "react";
import { I18nProvider, useI18n } from "../src/providers/i18n-provider";
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
  globalTypes: {
    locale: {
      name: "Locale",
      description: "UI language",
      defaultValue: "de",
      toolbar: {
        icon: "globe",
        items: [
          { value: "de", right: "🇩🇪", title: "Deutsch" },
          { value: "en", right: "🇬🇧", title: "English" },
        ],
        showName: true,
      },
    },
  },
};

const LangSetter: React.FC<{ locale?: string }> = ({ locale }) => {
  const { setLang } = useI18n();
  useEffect(() => {
    if (locale === "en" || locale === "de") setLang(locale);
  }, [locale, setLang]);
  return null;
};

const withI18n: Decorator = (Story, context) => (
  <I18nProvider>
    <LangSetter locale={context.globals.locale} />
    <Story />
  </I18nProvider>
);

export const decorators = [withI18n];

export default preview;
