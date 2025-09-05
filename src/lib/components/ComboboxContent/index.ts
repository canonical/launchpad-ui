/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as ComboboxContentRoot } from "./ComboboxContent.svelte";
import { Footer, Group, Helper, NoResults } from "./common/index.js";

const ComboboxContent = ComboboxContentRoot as typeof ComboboxContentRoot & {
  Helper: typeof Helper;
  Footer: typeof Footer;
  Group: typeof Group;
  NoResults: typeof NoResults;
};

ComboboxContent.Footer = Footer;
ComboboxContent.Helper = Helper;
ComboboxContent.Group = Group;
ComboboxContent.NoResults = NoResults;

export { ComboboxContent };
export * from "./types.js";
export type {
  FooterProps as ComboboxContentFooterProps,
  GroupProps as ComboboxContentGroupProps,
  HelperProps as ComboboxContentHelperProps,
} from "./common/index.js";
