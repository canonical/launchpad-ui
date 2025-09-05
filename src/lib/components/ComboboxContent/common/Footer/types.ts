/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { SvelteHTMLElements } from "svelte/elements";

/*
  For components that render specific HTML elements with extended prop sets,
  make sure to change `"div"` to the appropriate HTML element type.
*/
type BaseProps = SvelteHTMLElements["div"];

export interface FooterProps extends BaseProps {
  // Define additional props specific to Footer here
}

/*
  ...or consider using appropriate interfaces directly exported from `svelte/elements`.

  For example:
  - `HTMLButtonAttributes` (provides `disabled`, `type`, etc.)
  - `HTMLAnchorAttributes` (provides `href`, `target`, etc.)
  - `HTMLInputAttributes` (provides `type`, `checked`, `value`, etc.)
  - `HTMLFormAttributes` (provides `action`, `method`, etc.)

  ```typescript
  import type { HTMLButtonAttributes } from "svelte/elements";

  export interface MyButtonProps extends HTMLButtonAttributes {
    // Your custom props here
  }
  ```
  
  See Svelte documentation on typing wrapper components:
  https://svelte.dev/docs/svelte/typescript#Typing-wrapper-components
*/