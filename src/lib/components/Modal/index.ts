/* @canonical/generator-ds 0.10.0-experimental.2 */

import { ModalContent } from "../ModalContent/index.js";
import { default as ModalRoot } from "./Modal.svelte";

const Modal = ModalRoot as typeof ModalRoot & {
  Content: typeof ModalContent;
};

Modal.Content = ModalContent;

export { Modal };
export * from "./types.js";
