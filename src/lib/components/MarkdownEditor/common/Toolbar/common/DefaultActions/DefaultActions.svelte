<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
  import { useShortcuts } from "$lib/shortcuts";
  import { getMarkdownEditorContext } from "../../../../context.js";
  import { ActionButton } from "../ActionButton";
  import Group from "../Group/Group.svelte";
  import { createDefaultActions } from "./constants";

  const markdownEditorContext = getMarkdownEditorContext();
  const defaultShortcuts = createDefaultActions(
    () => markdownEditorContext?.textareaElement,
  );

  useShortcuts(() =>
    Object.values(defaultShortcuts).map((shortcut) => shortcut.shortcut),
  );
</script>

<Group>
  <ActionButton
    onclick={() => defaultShortcuts.h1.handler()}
    shortcut={defaultShortcuts.h1.shortcut}
    label="Add heading 1"
  >
    <Icon name="heading" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.bold.handler()}
    shortcut={defaultShortcuts.bold.shortcut}
    label="Add bold"
  >
    <Icon name="bold" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.italic.handler()}
    shortcut={defaultShortcuts.italic.shortcut}
    label="Add italic"
  >
    <Icon name="italic" />
  </ActionButton>
</Group>
<Group>
  <ActionButton
    onclick={() => defaultShortcuts.quote.handler()}
    shortcut={defaultShortcuts.quote.shortcut}
    label="Add quote"
  >
    <Icon name="quote" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.code.handler()}
    shortcut={defaultShortcuts.code.shortcut}
    label="Add code"
  >
    <Icon name="code" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.insertLink.handler()}
    shortcut={defaultShortcuts.insertLink.shortcut}
    label="Add link"
  >
    <Icon name="get-link" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.unorderedList.handler()}
    shortcut={defaultShortcuts.unorderedList.shortcut}
    label="Add bullet list"
  >
    <Icon name="bulleted-list" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.numberedList.handler()}
    shortcut={defaultShortcuts.numberedList.shortcut}
    label="Add numbered list"
  >
    <Icon name="numbered-list" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.numberedList.handler()}
    shortcut={defaultShortcuts.numberedList.shortcut}
    label="Add numbered list"
  >
    <Icon name="numbered-list" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.taskList.handler()}
    shortcut={defaultShortcuts.taskList.shortcut}
    label="Add task list"
  >
    <Icon name="task-list" />
  </ActionButton>
</Group>
