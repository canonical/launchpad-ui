import { MediaQuery } from "svelte/reactivity";
import { browser } from "$app/environment";

/* 
  There is a bug in Chrome, that makes it ignore `scroll-margin` for global scroll on elements that have a parent with non-visible overflow. https://issues.chromium.org/issues/40074749
  
  This makes the first three lines of log hidden behind the sticky header when scrolling to top of log in mobile view with line wrapping disabled (log container overflow needed).

  As a workaround, we detect this case and instead of scrolling to the top of the log, we scroll to the log header above it, which is outside of the overflow container.

  TODO: This can be removed once the bug is fixed in Chrome.

  Update 2026-04-30: Fixed in Chrome 146;
*/
export function useNeedsFallbackScrollMarginFix(fullScreen: {
  isEnabled: boolean;
}) {
  const needsFix = $derived(
    browser &&
      (window as { chrome?: unknown })?.chrome &&
      parseInt(
        navigator.userAgent.match(/Chrom(e|ium)\/(\d+)/)?.[2] ?? "0",
        10,
      ) < 146 &&
      !fullScreen.isEnabled &&
      new MediaQuery("max-width: 1036px").current,
  );

  return () => needsFix;
}
