<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { OptionContent } from "../common/index.js";
  import type { ButtonOptionProps } from "./types.js";
  import "../option.css";

  const componentCssClassName = "ds button-option option";

  let {
    class: className,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled,
    // Override default button type, so that if used inside the form it doesn't submit it by default
    type = "button",
    ...rest
  }: ButtonOptionProps = $props();
</script>

<button
  class={[componentCssClassName, className, { disabled }]}
  {disabled}
  {type}
  {...rest}
>
  <OptionContent {text} {icon} {secondaryText} {trailingText} />
</button>

<style>
  .ds.button-option {
    inline-size: 100%;
    border: none;
  }
</style>
