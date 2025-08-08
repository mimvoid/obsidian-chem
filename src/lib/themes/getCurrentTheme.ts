import { ChemPluginSettings } from "src/settings/base";

export function getCurrentTheme(settings: ChemPluginSettings) {
  return document.body.hasClass("theme-dark") &&
    !document.body.hasClass("theme-light")
    ? settings.darkTheme
    : settings.lightTheme;
}