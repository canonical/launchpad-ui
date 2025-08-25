/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["li"];

export interface EventProps extends BaseProps {
  /**
   * Marker displayed over the timeline's line. If not specified, a default marker will be used.
   */
  marker?: Snippet;
  /**
   * Content to be displayed in the event's title row. Consider using `<Timeline.TitleRow>`.
   */
  titleRow?: Snippet;
  /**
   * Content to be displayed in the event's body.
   */
  children?: Snippet;
}
