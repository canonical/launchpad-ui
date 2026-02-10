<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import { JumpToElementIcon } from "$lib/components/icons/index.js";
  import { JobStatusIcon } from "$lib/launchpad-components/JobStatusIcon/index.js";
  import type { CommandProps } from "./types.js";

  let { status, command, href, ...props }: CommandProps = $props();
</script>

<li {...props}>
  <div class="box">
    <div class="icon-aligner">
      <JobStatusIcon {status} />
    </div>
    <code>{command}</code>
  </div>
  <ButtonPrimitive
    class="jump-to-element"
    {href}
    disabled={!href}
    aria-label="Jump to command"
  >
    <JumpToElementIcon />
  </ButtonPrimitive>
</li>

<!-- @component
`Command` represents a single command entry with its status and an optional link to jump to the corresponding line in a log or output.

## Example Usage
```svelte
<Command status="FINISHED" command="make all" href="#line-42" />
```
-->

<style>
  li {
    display: flex;
    align-items: start;
    --box-block-padding: var(--lp-dimension-spacing-block-xs);

    > .box {
      display: flex;
      flex-grow: 1;

      font: var(--lp-typography-code-s);
      gap: var(--lp-dimension-spacing-inline-xs);
      padding: var(--box-block-padding) var(--lp-dimension-spacing-inline-m);
      /* TODO(@Enzo): Missing token */
      --lp-color-background-code: rgb(
        from var(--lp-color-text-default) r g b / 0.03
      );
      background-color: var(--lp-color-background-code);

      .icon-aligner {
        height: 1lh;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      code {
        /* TODO(@Enzo): Discuss wrapping/preserving white-space */
        word-break: break-word;
      }
    }

    :global(.jump-to-element) {
      /* Make sure it is of the same height as one command line */
      font: inherit;
      height: calc(1lh + 2 * var(--box-block-padding));
      flex-shrink: 0;
      display: grid;
      place-items: center;
    }
  }
</style>
