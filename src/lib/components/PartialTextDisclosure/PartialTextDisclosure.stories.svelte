<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { PartialTextDisclosure } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/PartialTextDisclosure",
    tags: ["autodocs"],
    component: PartialTextDisclosure,
  });

  const longText = `A small, fast, and feature-rich library for building things.

It ships with sensible defaults and a plugin system, so you can start quickly and grow into the advanced features when you need them.

Key features:
  - Zero-config setup that works out of the box
  - Fully typed public API with great editor support
  - Pluggable architecture:
      * built-in caching
      * request batching
      * retry with backoff

Note:
    Indented blocks and blank lines are preserved exactly as written, which matters for release notes, code snippets, and formatted descriptions.`;
</script>

<Story name="Default" args={{ text: longText }} />

<Story name="Short text" args={{ text: "Lorem ipsum dolor sit amet." }} />

<Story name="Custom threshold" args={{ text: longText, maxLines: 1 }} />
