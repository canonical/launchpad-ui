/* @canonical/generator-ds 0.10.0-experimental.2 */

import { DialogContent } from "../common/DialogContent/index.js";
import { default as ModalRoot } from "./Modal.svelte";

const Modal = ModalRoot as typeof ModalRoot & {
  Content: typeof DialogContent;
};

Modal.Content = DialogContent;

export { Modal };
export * from "./types.js";
