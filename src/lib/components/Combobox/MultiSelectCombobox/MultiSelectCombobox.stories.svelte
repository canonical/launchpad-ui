<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import { MultiSelectCombobox } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/MultiSelectCombobox",
    tags: ["autodocs"],
    component: MultiSelectCombobox,
    argTypes: {
      helper: {
        control: false,
      },
      footer: {
        control: false,
      },
      trigger: {
        control: false,
      },
      search: {
        control: false,
      },
    },
  });
</script>

<script lang="ts">
  type User = {
    id: number;
    userName: string;
    admin?: boolean;
    userAvatarUrl: string;
    selected?: boolean;
  };

  const users1 = $state<User[]>([
    {
      id: 1,
      userName: "Wade Cooper",
      admin: true,
      userAvatarUrl: "https://i.pravatar.cc/150?img=48",
    },
    {
      id: 2,
      userName: "Arlene Mccoy",
      userAvatarUrl: "https://i.pravatar.cc/150?img=49",
    },
    {
      id: 3,
      userName: "Devon Webb",
      userAvatarUrl: "https://i.pravatar.cc/150?img=50",
    },
  ]);

  const users2 = $state<User[]>([
    {
      id: 4,
      userName: "Tom Cook",
      userAvatarUrl: "https://i.pravatar.cc/150?img=51",
    },
    {
      id: 5,
      userName: "Tanya Fox",
      admin: true,
      userAvatarUrl: "https://i.pravatar.cc/150?img=52",
    },
    {
      id: 6,
      userName: "Hellen Schmidt",
      userAvatarUrl: "https://i.pravatar.cc/150?img=53",
    },
    {
      id: 7,
      userName: "Ralph Edwards",
      admin: true,
      userAvatarUrl: "https://i.pravatar.cc/150?img=60",
    },
    {
      id: 8,
      userName: "Esther Howard",
      userAvatarUrl: "https://i.pravatar.cc/150?img=61",
    },
    {
      id: 9,
      userName: "Cameron Williamson",
      admin: true,
      userAvatarUrl: "https://i.pravatar.cc/150?img=56",
    },
    {
      id: 10,
      userName: "Brooklyn Simmons",
      userAvatarUrl: "https://i.pravatar.cc/150?img=57",
    },
    {
      id: 11,
      userName: "Jenny Wilson",
      userAvatarUrl: "https://i.pravatar.cc/150?img=58",
    },
    {
      id: 12,
      userName: "Kristin Watson",
      admin: true,
      userAvatarUrl: "https://i.pravatar.cc/150?img=59",
    },
    {
      id: 13,
      userName: "Darlene Robertson",
      userAvatarUrl: "https://i.pravatar.cc/150?img=62",
    },
    {
      id: 14,
      userName: "Guy Hawkins",
      userAvatarUrl: "https://i.pravatar.cc/150?img=63",
    },
    {
      id: 15,
      userName: "Jacob Jones",
      admin: true,
      userAvatarUrl: "https://i.pravatar.cc/150?img=64",
    },
    {
      id: 16,
      userName: "Eleanor Pena",
      userAvatarUrl: "https://i.pravatar.cc/150?img=65",
    },
  ]);

  const users1Filtered = $derived(
    users1.filter((user) =>
      user.userName.toLowerCase().includes(query.toLowerCase()),
    ),
  );
  const users2Filtered = $derived(
    users2.filter((user) =>
      user.userName.toLowerCase().includes(query.toLowerCase()),
    ),
  );

  let query = $state("");
</script>

<Story name="Default">
  {#snippet template({ search: _, children: __, trigger: ___, ...args })}
    <MultiSelectCombobox {...args}>
      {#snippet trigger(popovertarget)}
        <Button {popovertarget}>Open</Button>
      {/snippet}
      {#snippet search()}
        <MultiSelectCombobox.Search
          label="Merge Proposal reviewers"
          placeholder="Search users..."
          autofocus
          bind:value={query}
        />
      {/snippet}
      <div style="max-height: 350px; overflow: auto;">
        <MultiSelectCombobox.Group groupTitle="Most Recent">
          {#each users1Filtered as user (user.id)}
            <MultiSelectCombobox.Item
              text={user.userName}
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              checked={user.selected}
              onchange={(e) =>
                (users1.find((u) => u.id === user.id)!.selected = (
                  e.target as HTMLInputElement
                ).checked)}
              >{#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}
            </MultiSelectCombobox.Item>
          {:else}
            <MultiSelectCombobox.NoResults />
          {/each}
        </MultiSelectCombobox.Group>
        <MultiSelectCombobox.Group groupTitle="Contributors">
          {#each users2Filtered as user (user.id)}
            <MultiSelectCombobox.Item
              text={user.userName}
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              checked={user.selected}
              onchange={(e) =>
                (users2.find((u) => u.id === user.id)!.selected = (
                  e.target as HTMLInputElement
                ).checked)}
            >
              {#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}
            </MultiSelectCombobox.Item>
          {:else}
            <MultiSelectCombobox.NoResults />
          {/each}
        </MultiSelectCombobox.Group>
      </div>
      {#snippet helper(id)}
        <MultiSelectCombobox.Helper {id}>
          {#snippet icon()}
            <Icon name="information" />
          {/snippet}
          Select reviewers for the project
        </MultiSelectCombobox.Helper>
      {/snippet}
      {#snippet footer(popovertarget)}
        <MultiSelectCombobox.Footer>
          <Button
            modifiers={{ severity: "base", density: "dense" }}
            {popovertarget}
          >
            Cancel
          </Button>
          <Button modifiers={{ density: "dense" }} {popovertarget}>Save</Button>
        </MultiSelectCombobox.Footer>
      {/snippet}
    </MultiSelectCombobox>
  {/snippet}
</Story>
