<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import { UserAvatar } from "../UserAvatar/index.js";
  import { ComboboxContent } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/ComboboxContent",
    tags: ["autodocs"],
    component: ComboboxContent,
    argTypes: {
      helper: {
        control: false,
      },
      footer: {
        control: false,
      },
    },
  });
</script>

<script lang="ts">
  const users1 = [
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
  ];

  const users2 = [
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
  ];
</script>

<Story name="Multi selection">
  {#snippet template({ search: _, ...args })}
    <ComboboxContent {...args}>
      {#snippet search()}
        <ComboboxContent.Search
          label="Merge Proposal reviewers"
          placeholder="Search users..."
        />
      {/snippet}
      <ComboboxContent.Group groupTitle="Most Recent">
        <ComboboxContent.Group>
          {#each users2 as user (user.id)}
            <ComboboxContent.Item
              text={user.userName}
              name="user"
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              >{#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}</ComboboxContent.Item
            >
          {/each}
        </ComboboxContent.Group>
      </ComboboxContent.Group>
      <ComboboxContent.Group groupTitle="Contributors">
        {#each users1 as user (user.id)}
          <ComboboxContent.Item
            text={user.userName}
            name="user"
            value={user.id}
            secondaryText={user.admin ? "administrator" : undefined}
          >
            {#snippet icon()}
              <UserAvatar
                userName={user.userName}
                userAvatarUrl={user.userAvatarUrl}
                aria-hidden="true"
              />
            {/snippet}
          </ComboboxContent.Item>
        {/each}
      </ComboboxContent.Group>
      {#snippet helper(id)}
        <ComboboxContent.Helper {id}>
          {#snippet icon()}
            <Icon name="information" />
          {/snippet}
          Select reviewers for the project
        </ComboboxContent.Helper>
      {/snippet}
      {#snippet footer()}
        <ComboboxContent.Footer>
          <Button modifiers={{ severity: "base", density: "dense" }}>
            Cancel
          </Button>
          <Button modifiers={{ density: "dense" }}>Save</Button>
        </ComboboxContent.Footer>
      {/snippet}
    </ComboboxContent>
  {/snippet}
</Story>

<Story name="Single selection">
  {#snippet template({ search: _, ...args })}
    <ComboboxContent {...args}>
      {#snippet search()}
        <ComboboxContent.Search
          label="Project's owner"
          placeholder="Search users..."
        />
      {/snippet}
      <ComboboxContent.Group groupTitle="Most Recent">
        <ComboboxContent.Group>
          {#each users2 as user (user.id)}
            <ComboboxContent.Item
              text={user.userName}
              name="user"
              value={user.id}
              secondaryText={user.admin ? "administrator" : undefined}
              >{#snippet icon()}
                <UserAvatar
                  userName={user.userName}
                  userAvatarUrl={user.userAvatarUrl}
                  aria-hidden="true"
                />
              {/snippet}</ComboboxContent.Item
            >
          {/each}
        </ComboboxContent.Group>
      </ComboboxContent.Group>
      <ComboboxContent.Group groupTitle="Contributors">
        {#each users1 as user (user.id)}
          <ComboboxContent.Item
            text={user.userName}
            name="user"
            value={user.id}
            secondaryText={user.admin ? "administrator" : undefined}
          >
            {#snippet icon()}
              <UserAvatar
                userName={user.userName}
                userAvatarUrl={user.userAvatarUrl}
                aria-hidden="true"
              />
            {/snippet}
          </ComboboxContent.Item>
        {/each}
      </ComboboxContent.Group>
      {#snippet helper(id)}
        <ComboboxContent.Helper {id}>
          {#snippet icon()}
            <Icon name="information" />
          {/snippet}
          Select the project's owner
        </ComboboxContent.Helper>
      {/snippet}
      {#snippet footer()}
        <ComboboxContent.Footer>
          <Button modifiers={{ severity: "base", density: "dense" }}>
            Cancel
          </Button>
          <Button modifiers={{ density: "dense" }}>Save</Button>
        </ComboboxContent.Footer>
      {/snippet}
    </ComboboxContent>
  {/snippet}
</Story>

<Story name="Empty">
  {#snippet template({ search: _, ...args })}
    <ComboboxContent {...args}>
      {#snippet search()}
        <ComboboxContent.Search
          label="Favorite sport"
          placeholder="Search sports..."
          value="Soccer"
        />
      {/snippet}
      <ComboboxContent.NoResults />
    </ComboboxContent>
  {/snippet}
</Story>
