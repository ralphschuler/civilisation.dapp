import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { en } from '@/i18n/locales/en';
import { de } from '@/i18n/locales/de';

type Locale = 'en' | 'de';
type Messages = typeof en;

const messagesByLocale: Record<Locale, Messages> = { en, de };

type I18nContextValue = {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const isMergeableObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function deepMerge<T extends Record<string, unknown>>(base: T, extra?: DeepPartial<T>): T {
  if (!extra) {
    return base;
  }

  const result: Record<string, unknown> = { ...base };

  for (const [key, extraValue] of Object.entries(extra as Record<string, unknown>)) {
    if (extraValue === undefined) {
      continue;
    }

    const currentValue = result[key];

    if (isMergeableObject(currentValue) && isMergeableObject(extraValue)) {
      result[key] = deepMerge(
        currentValue as Record<string, unknown>,
        extraValue as DeepPartial<Record<string, unknown>>,
      );
      continue;
    }

    result[key] = extraValue;
  }

  return result as T;
}

export function I18nProvider({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: DeepPartial<Messages>;
}) {
  const initial =
    (typeof window !== 'undefined' && (localStorage.getItem('lang') as Locale)) ||
    'de';
  const [lang, setLangState] = useState<Locale>(initial);

  const setLang = (l: Locale) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
    // Toggle html lang and dark variant compatibility
    if (typeof document !== 'undefined') document.documentElement.lang = l;
  };

  const dict = useMemo(() => deepMerge(messagesByLocale[lang], overrides), [lang, overrides]);

  const t = useMemo(() => {
    const resolve = (path: string, obj: unknown): unknown =>
      path.split('.').reduce<unknown>((acc, segment) => {
        if (isMergeableObject(acc) && segment in acc) {
          return acc[segment];
        }
        return undefined;
      }, obj);

    return (key: string, fallback?: string) => {
      const v = resolve(key, dict);
      if (typeof v === 'string') return v;
      return fallback ?? key;
    };
  }, [dict]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export const T = ({ k, f }: { k: string; f?: string }) => {
  const { t } = useI18n();
  return <>{t(k, f)}</>;
};
