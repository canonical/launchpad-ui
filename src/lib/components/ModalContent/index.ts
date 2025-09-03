/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as ModalContentRoot } from "./ModalContent.svelte";
import { Body, Footer, Header } from "./common/index.js";

const ModalContent = ModalContentRoot as typeof ModalContentRoot & {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
};

ModalContent.Header = Header;
ModalContent.Body = Body;
ModalContent.Footer = Footer;

export { ModalContent };
export * from "./types.js";
export type {
  BodyProps,
  CloseButtonProps,
  FooterProps,
  HeaderProps,
} from "./common/index.js";
