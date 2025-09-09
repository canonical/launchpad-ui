<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { OptionContent } from "../common/index.js";
  import type { LinkOptionProps } from "./types.js";
  import "../option.css";

  const componentCssClassName = "ds link-option option";

  let {
    class: className,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled,
    href,
    ...rest
  }: LinkOptionProps = $props();
</script>

<a
  class={[componentCssClassName, className, { disabled }]}
  href={disabled ? undefined : href}
  role={disabled ? "link" : undefined}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
  {...rest}
>
  <OptionContent {text} {icon} {secondaryText} {trailingText} />
</a>

<style>
  .ds.link-option {
    text-decoration: none;
  }
</style>
