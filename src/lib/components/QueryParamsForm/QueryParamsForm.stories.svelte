<script module lang="ts">
  import { numCodec, strCodec, superhref } from "@canonical/superhref";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { QueryParamsForm } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/QueryParamsForm",
    tags: ["autodocs"],
    component: QueryParamsForm,
    argTypes: {
      schema: { control: false },
      url: { control: false },
      replaceParams: { control: false },
      children: { control: false },
    },
  });

  const schema = superhref({
    q: strCodec(),
    page: numCodec({ default: 1, integer: true, min: 1 }),
  });
  const url = new URL("https://launchpad.test/ubuntu/+source?q=zsh&page=3");
  let submitted = $state("");
</script>

<Story name="Default">
  {#snippet template({
    schema: _,
    url: __,
    replaceParams: ___,
    children: ____,
    ...args
  })}
    <QueryParamsForm
      {...args}
      {schema}
      {url}
      replaceParams={["page"]}
      onsubmit={(event) => {
        event.preventDefault();
        submitted = String(
          new URLSearchParams(
            Array.from(new FormData(event.currentTarget), ([name, value]) => [
              name,
              String(value),
            ]),
          ),
        );
      }}
    >
      <label>
        Page
        <input
          name="page"
          type="number"
          min="1"
          value={url.searchParams.get("page")}
        />
      </label>
      <button type="submit">Go</button>
    </QueryParamsForm>
    <p>Submitted query: <code>{submitted}</code></p>
  {/snippet}
</Story>
