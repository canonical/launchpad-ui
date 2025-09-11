<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import { Combobox } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Combobox",
    tags: ["autodocs"],
    component: Combobox,
    argTypes: {
      helper: {
        control: false,
      },
      footer: {
        control: false,
      },
      search: {
        control: false,
      },
      type: {
        control: false,
      },
    },
    args: {
      inputsName: "user",
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

  const users1: User[] = [
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
  ];

  const users2: User[] = [
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
  ];

  const users1MultiSelect = $state(users1);
  const users2MultiSelect = $state(users2);

  let queryMultiSelect = $state("");

  const users1MultiSelectFiltered = $derived(
    users1MultiSelect.filter((user) =>
      user.userName.toLowerCase().includes(queryMultiSelect.toLowerCase()),
    ),
  );
  const users2MultiSelectFiltered = $derived(
    users2MultiSelect.filter((user) =>
      user.userName.toLowerCase().includes(queryMultiSelect.toLowerCase()),
    ),
  );

  const users1SingleSelect = $state(users1);
  const users2SingleSelect = $state(users2);

  let querySingleSelect = $state("");

  const users1SingleSelectFiltered = $derived(
    users1SingleSelect.filter((user) =>
      user.userName.toLowerCase().includes(querySingleSelect.toLowerCase()),
    ),
  );
  const users2SingleSelectFiltered = $derived(
    users2SingleSelect.filter((user) =>
      user.userName.toLowerCase().includes(querySingleSelect.toLowerCase()),
    ),
  );
</script>

<Story name="Multi Select" args={{ type: "multi" }}>
  {#snippet template({
    search: _,
    children: __,
    footer: ___,
    helper: ____,
    ...args
  })}
    <Combobox {...args}>
      {#snippet search()}
        <Combobox.Search
          label="Merge Proposal reviewers"
          placeholder="Search users..."
          bind:value={queryMultiSelect}
        />
      {/snippet}
      <div style="max-height: 350px; overflow: auto;">
        <Combobox.Group groupTitle="Most Recent">
          {#each users1MultiSelectFiltered as user (user.id)}
            <Combobox.CheckboxOption
              text={user.userName}
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              checked={user.selected}
              onchange={(e) =>
                (users1MultiSelect.find((u) => u.id === user.id)!.selected = (
                  e.target as HTMLInputElement
                ).checked)}
              >{#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}
            </Combobox.CheckboxOption>
          {:else}
            <Combobox.NoResults />
          {/each}
        </Combobox.Group>
        <Combobox.Group groupTitle="Contributors">
          {#each users2MultiSelectFiltered as user (user.id)}
            <Combobox.CheckboxOption
              text={user.userName}
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              checked={user.selected}
              onchange={(e) =>
                (users2MultiSelect.find((u) => u.id === user.id)!.selected = (
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
            </Combobox.CheckboxOption>
          {:else}
            <Combobox.NoResults />
          {/each}
        </Combobox.Group>
      </div>
      {#snippet helper(id)}
        <Combobox.Helper {id}>
          {#snippet icon()}
            <Icon name="information" />
          {/snippet}
          Select reviewers for the project
        </Combobox.Helper>
      {/snippet}
      {#snippet footer()}
        <Combobox.Footer>
          <Button modifiers={{ severity: "base", density: "dense" }}>
            Cancel
          </Button>
          <Button modifiers={{ density: "dense" }}>Save</Button>
        </Combobox.Footer>
      {/snippet}
    </Combobox>
  {/snippet}
</Story>

<Story name="Single Select" args={{ type: "single" }}>
  {#snippet template({
    search: _,
    children: __,
    footer: ___,
    helper: ____,
    ...args
  })}
    <Combobox {...args}>
      {#snippet search()}
        <Combobox.Search
          label="Project owner"
          placeholder="Search users..."
          bind:value={querySingleSelect}
        />
      {/snippet}
      <div style="max-height: 350px; overflow: auto;">
        <Combobox.Group groupTitle="Most Recent">
          {#each users1SingleSelectFiltered as user (user.id)}
            <Combobox.RadioOption
              text={user.userName}
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              checked={user.selected}
              onchange={() => {
                [...users1SingleSelect, ...users2SingleSelect].forEach((u) => {
                  u.selected = u.id === user.id;
                });
              }}
              >{#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}
            </Combobox.RadioOption>
          {:else}
            <Combobox.NoResults />
          {/each}
        </Combobox.Group>
        <Combobox.Group groupTitle="Contributors">
          {#each users2SingleSelectFiltered as user (user.id)}
            <Combobox.RadioOption
              text={user.userName}
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              checked={user.selected}
              onchange={() => {
                [...users1SingleSelect, ...users2SingleSelect].forEach((u) => {
                  u.selected = u.id === user.id;
                });
              }}
            >
              {#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}
            </Combobox.RadioOption>
          {:else}
            <Combobox.NoResults />
          {/each}
        </Combobox.Group>
      </div>
      {#snippet helper(id)}
        <Combobox.Helper {id}>
          {#snippet icon()}
            <Icon name="information" />
          {/snippet}
          Select the owner for the project
        </Combobox.Helper>
      {/snippet}
      {#snippet footer()}
        <Combobox.Footer>
          <Button modifiers={{ severity: "base", density: "dense" }}>
            Cancel
          </Button>
          <Button modifiers={{ density: "dense" }}>Save</Button>
        </Combobox.Footer>
      {/snippet}
    </Combobox>
  {/snippet}
</Story>
