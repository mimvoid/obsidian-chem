import type { ChemCore } from "./ChemCore";

import SmilesDrawer from "smiles-drawer";
import { ChemPluginSettings } from "src/settings/base";
import { DEFAULT_SD_OPTIONS } from "src/lib/core/smilesDrawerOptions";
import { getCurrentTheme } from "src/lib/themes/getCurrentTheme";

import { i18n } from "src/lib/i18n";

export default class SmilesDrawerCore implements ChemCore {
  id: "smiles-drawer";
  settings: ChemPluginSettings;
  core: SmilesDrawer.SmiDrawer;

  constructor(settings: ChemPluginSettings) {
    this.settings = settings;
    this.core = new SmilesDrawer.SmiDrawer(
      {
        ...DEFAULT_SD_OPTIONS.moleculeOptions,
        ...this.settings.smilesDrawerOptions.moleculeOptions,
      },
      {
        ...DEFAULT_SD_OPTIONS.reactionOptions,
        ...this.settings.smilesDrawerOptions.reactionOptions,
      },
    );
  }

  async draw(source: string, theme: string = getCurrentTheme(this.settings)) {
    const svg = createSvg("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("data-smiles", source);

    const errorDiv = createDiv();
    const errorCb = (error: object & { name: string; message: string }) => {
      errorDiv
        .createDiv("error-source")
        .setText(i18n.t("errors.source.title", { source }));
      errorDiv.createEl("br");
      const info = errorDiv.createEl("details");
      info.createEl("summary").setText(error.name);
      info.createEl("div").setText(error.message);

      errorDiv.style.wordBreak = `break-word`;
      errorDiv.style.userSelect = `text`;
    };

    this.core.draw(source, svg, theme, () => {}, errorCb);

    if (this.settings.commonOptions.scale == 0) {
      svg.style.width = `${
        this.settings?.commonOptions.unifiedWidth ?? "300"
      }px`;
    } else {
      const cellWidth = parseFloat(svg.style.width);
      const settingsWidth = this.settings.commonOptions?.width ?? 300;

      if (cellWidth > settingsWidth) {
        const r = cellWidth / parseFloat(svg.style.height);
        svg.style.width = `${settingsWidth}px`;
        svg.style.height = `${settingsWidth / r}px`;
      }
    }

    if (errorDiv.innerHTML) return errorDiv;
    return svg;
  }
}