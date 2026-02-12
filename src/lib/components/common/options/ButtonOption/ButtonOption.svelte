<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { ButtonPrimitive } from "../../ButtonPrimitive/index.js";
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
    ...rest
  }: ButtonOptionProps = $props();
</script>

<ButtonPrimitive
  class={[componentCssClassName, className, { disabled }]}
  {disabled}
  {...rest}
>
  <OptionContent {text} {icon} {secondaryText} {trailingText} />
</ButtonPrimitive>
