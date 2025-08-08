import { refreshBlocks } from "src/global/blocks";

export const themeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const target = mutation.target as HTMLElement;
    const hassDark = mutation.oldValue?.contains("theme-dark");
    const hasLight = mutation.oldValue?.contains("theme-light");

    if (
      // dark -> dark & light -> light
      hassDark &&
      !hasLight && // key line, avoid calling twice
      target.classList.value.contains("theme-light")
    ) {
      refreshBlocks();
    } else if (
      // light -> empty -> dark
      hasLight && // key line, avoid calling twice
      !hassDark &&
      target.classList.value.contains("theme-dark")
    ) {
      refreshBlocks();
    }
  });
});

export function setObserver() {
  themeObserver.observe(document.body, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["class"],
  });
}

export function detachObserver() {
  themeObserver.disconnect();
}
