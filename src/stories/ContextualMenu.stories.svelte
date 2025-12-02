<script module lang="ts">
  import { ChevronUpIcon, InformationIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import {
    Button,
    ContextualMenuContent,
    Popover,
  } from "$lib/components/index.js";

  const { Story } = defineMeta({
    tags: ["autodocs"],
    title: "Patterns/ContextualMenu",
  });
</script>

<!--
The following Contextual Menu example can be assembled using: 
- [Popover](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-popover--docs)
- [ContextualMenuContent](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-contextualmenucontent--docs)
- [Button](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-button--docs)
- [Icon](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-icon--docs)
-->
<Story name="ContextualMenu" asChild>
  <div style="min-height: 350px;">
    <Popover>
      {#snippet trigger(triggerProps, open)}
        <Button {...triggerProps} style={open ? "border-bottom: 0;" : ""}>
          Options
          {#snippet iconRight()}
            <!-- TODO: Replace with <Chevron /> -->
            <ChevronUpIcon
              style="transform: rotate({open ? '180deg' : '0deg'});"
            />
          {/snippet}
        </Button>
      {/snippet}
      <!-- TODO(@Enzo): Add max-width tokens and replace this hardcoded value -->
      <ContextualMenuContent style="max-width: 17.38rem;">
        <ContextualMenuContent.Group groupTitle="Diff layout">
          <ContextualMenuContent.RadioItem
            name="layout"
            checked
            text="Inline"
          />
          <ContextualMenuContent.RadioItem name="layout" text="Side-by-side" />
        </ContextualMenuContent.Group>
        <ContextualMenuContent.Group groupTitle="Preferences">
          <ContextualMenuContent.CheckboxItem
            value="whitespace"
            text="Show whitespace changes"
          />
          <ContextualMenuContent.CheckboxItem
            value="single-file"
            text="Show one file at a time"
          />
          <ContextualMenuContent.CheckboxItem
            value="overflowing-lines"
            checked
            text="Show overflowing code lines"
          />
        </ContextualMenuContent.Group>
        {#snippet helper(id)}
          <ContextualMenuContent.Helper {id}>
            {#snippet icon()}
              <InformationIcon />
            {/snippet}
            Use the options above to customize the view
          </ContextualMenuContent.Helper>
        {/snippet}
      </ContextualMenuContent>
    </Popover>
  </div>
</Story>
