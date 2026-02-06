import { type SupportedLanguage } from "./i18n";

export type RegionOption = "US" | "UK" | "EU" | "India" | "Middle East" | "SE Asia";

const PREF_KEY = "userPreferences";

export function loadPreferences() {
  const fallback = { region: "US" as RegionOption, language: "English" as SupportedLanguage };
  const saved = localStorage.getItem(PREF_KEY);
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved);
    return {
      region: (parsed.region as RegionOption) || fallback.region,
      language: (parsed.language as SupportedLanguage) || fallback.language,
    };
  } catch {
    return fallback;
  }
}

export function savePreferences(region: RegionOption, language: SupportedLanguage) {
  localStorage.setItem(PREF_KEY, JSON.stringify({ region, language }));
}
