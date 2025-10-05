import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { en } from "@/i18n/locales/en";
import { de } from "@/i18n/locales/de";

type Locale = "en" | "de";
type Messages = typeof en;

const messagesByLocale: Record<Locale, Messages> = { en, de };

type I18nContextValue = {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type I18nOverrides = Record<string, any> | undefined;

function deepMerge(base: any, extra: any) {
  if (!extra) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(extra)) {
    const bv = (base || {})[k];
    const ev = extra[k];
    if (bv && typeof bv === 'object' && ev && typeof ev === 'object' && !Array.isArray(bv) && !Array.isArray(ev)) {
      out[k] = deepMerge(bv, ev);
    } else {
      out[k] = ev;
    }
  }
  return out;
}

export function I18nProvider({ children, overrides }: { children: ReactNode; overrides?: I18nOverrides }) {
  const initial =
    (typeof window !== "undefined" &&
      (localStorage.getItem("lang") as Locale)) ||
    "de";
  const [lang, setLangState] = useState<Locale>(initial);

  const setLang = (l: Locale) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    // Toggle html lang and dark variant compatibility
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const dict = useMemo(() => deepMerge(messagesByLocale[lang], overrides || {}), [lang, overrides]);

  const t = useMemo(() => {
    const resolve = (path: string, obj: any): any => {
      return path
        .split(".")
        .reduce((acc, p) => (acc && acc[p] != null ? acc[p] : undefined), obj);
    };
    return (key: string, fallback?: string) => {
      const v = resolve(key, dict);
      if (typeof v === "string") return v;
      return fallback ?? key;
    };
  }, [dict]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export const T = ({ k, f }: { k: string; f?: string }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useI18n();
  return <>{t(k, f)}</>;
};
