/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["fieldset"];

export interface OptionsGroupProps extends BaseProps {
  /**
   * A title for the group, which can be used to provide context for the items within the group.
   */
  groupTitle?: string;
  /**
   * Setting this to `true` will disable all options within the group, no matter their individual `disabled` state. Similarly to how `disabled` on a `<fieldset>` works.
   */
  disabled?: boolean;
}
