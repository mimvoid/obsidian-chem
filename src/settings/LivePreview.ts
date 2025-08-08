import { ChemPluginSettings } from "./base";
import { gRenderCore } from "src/global/chemCore";

export class LivePreview {
  container: HTMLDivElement;
  lightCard: HTMLDivElement;
  darkCard: HTMLDivElement;
  settings: ChemPluginSettings;

  constructor(el: HTMLElement, argSettings: ChemPluginSettings) {
    this.container = el.createEl("div");
    this.container.style.display = `flex`;
    this.container.style.flexWrap = `wrap`;
    this.container.style.justifyContent = `center`;

    this.lightCard = this.container.createEl("div", {
      cls: "chemcard theme-light",
    });
    this.darkCard = this.container.createEl("div", {
      cls: "chemcard theme-dark",
    });

    this.settings = argSettings;
  }

  render() {
    this.lightCard.empty();
    const lightWidth = this.renderCell(
      this.settings.sample1,
      this.lightCard,
      this.settings.lightTheme,
    );

    this.darkCard.empty();
    const darkWidth = this.renderCell(
      this.settings.sample2,
      this.darkCard,
      this.settings.darkTheme,
    );

    if (this.settings.commonOptions.scale == 0)
      this.container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
        this.settings?.commonOptions.unifiedWidth ?? "300"
      }px, 1fr)`;
    else
      this.container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
        lightWidth > darkWidth ? lightWidth : darkWidth
      }px, 1fr)`;
  }

  updateSettings(newSettings: ChemPluginSettings) {
    this.settings = newSettings;
  }

  private async renderCell(source: string, target: HTMLElement, theme: string) {
    const svg = await gRenderCore.draw(source, theme);
    target.appendChild(svg);

    return parseFloat(svg.style.width);
  }
}