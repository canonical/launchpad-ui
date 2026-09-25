<script lang="ts" module>
  // TODO: Fetch series from Launchpad
  const seriesGroups = [
    {
      label: "Active development",
      options: [{ value: "stonking", label: "26.10 (Stonking Stingray)" }],
    },
    {
      label: "Latest LTS",
      options: [{ value: "resolute", label: "26.04 LTS (Resolute Raccoon)" }],
    },
    {
      label: "Supported",
      options: [
        { value: "questing", label: "25.10 (Questing Quokka)" },
        { value: "noble", label: "24.04 LTS (Noble Numbat)" },
        { value: "jammy", label: "22.04 LTS (Jammy Jellyfish)" },
        { value: "focal", label: "20.04 LTS (Focal Fossa)" },
        { value: "bionic", label: "18.04 LTS (Bionic Beaver)" },
        { value: "xenial", label: "16.04 LTS (Xenial Xerus)" },
        { value: "trusty", label: "14.04 LTS (Trusty Tahr)" },
      ],
    },
  ] as const;

  const seriesLabels = Object.fromEntries(
    seriesGroups.flatMap((group) =>
      group.options.map((option) => [option.value, option.label] as const),
    ),
  ) as Record<string, string>;
</script>

<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";

  const {
    form,
    inputName,
    value,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    value: string | null;
    "aria-labelledby": string;
  } = $props();
</script>

<Popover>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {value && seriesLabels[value] ? seriesLabels[value] : "All"}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Series">
      <ContextualMenuContent.RadioItem
        name={inputName}
        value=""
        text="All"
        checked={!value}
        {form}
        onchange={(e) => e.currentTarget.form?.requestSubmit()}
      />
    </ContextualMenuContent.Group>
    {#each seriesGroups as group (group.label)}
      <ContextualMenuContent.Group groupTitle={group.label}>
        {#each group.options as option (option.value)}
          <ContextualMenuContent.RadioItem
            name={inputName}
            value={option.value}
            text={option.label}
            checked={value === option.value}
            {form}
            onchange={(e) => e.currentTarget.form?.requestSubmit()}
          />
        {/each}
      </ContextualMenuContent.Group>
    {/each}
  </ContextualMenuContent>
</Popover>
