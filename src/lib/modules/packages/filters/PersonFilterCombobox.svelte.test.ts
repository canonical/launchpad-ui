import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult, SetupOptions } from "vitest-browser-svelte";
import type { PersonEntry } from "$lib/server/launchpad/types.js";
import { MIN_PEOPLE_SEARCH_LENGTH } from "../constants.js";
import PersonFilterCombobox from "./PersonFilterCombobox.svelte";
import FiltersFormFixture, {
  FILTER_LABEL_ID,
  submitOnChange,
} from "./test.fixtures.svelte";

type PersonFilterScreen = RenderResult<
  typeof PersonFilterCombobox,
  typeof FiltersFormFixture
>;

const { findPeople, getPersonByName, seedPerson } = vi.hoisted(() => ({
  findPeople: vi.fn(),
  getPersonByName: vi.fn(),
  seedPerson: vi.fn(),
}));

vi.mock("$lib/modules/packages/people.remote.js", () => ({
  findPeople,
  getPersonByName,
}));

/** Mimics the parts of a remote query the combobox relies on. */
function remoteQuery<T>(result: Promise<T>) {
  const state = $state({ loading: true });
  result.then(
    () => (state.loading = false),
    () => (state.loading = false),
  );
  return {
    then: result.then.bind(result),
    get loading() {
      return state.loading;
    },
    set: seedPerson,
  };
}

function person(name: string, displayName: string): PersonEntry {
  return {
    self_link: `https://launchpad.test/api/devel/~${name}`,
    resource_type_link: "https://launchpad.test/api/devel/#person",
    name,
    display_name: displayName,
    is_team: false,
    mugshot_link: `https://launchpad.test/api/devel/~${name}/mugshot`,
  };
}

const alice = person("alice", "Alice Example");
const bob = person("bob", "Bob Example");
const people: Record<string, PersonEntry> = { alice, bob };

const onchange = vi.fn(submitOnChange);

const baseProps = {
  name: "maintainer",
  searchInputProps: { name: "maintainer-search" },
  value: null,
  groupName: "maintainers",
  onchange,
  "aria-labelledby": FILTER_LABEL_ID,
} satisfies ComponentProps<typeof PersonFilterCombobox>;

let submissions: [string, string][][];
let formOptions: SetupOptions<typeof FiltersFormFixture>;

beforeEach(() => {
  submissions = [];
  formOptions = {
    wrapper: FiltersFormFixture,
    wrapperProps: { label: "Maintained by:", submissions },
  };
  onchange.mockClear();
  findPeople
    .mockReset()
    .mockImplementation(() => remoteQuery(Promise.resolve([alice, bob])));
  getPersonByName
    .mockReset()
    .mockImplementation((name: string) =>
      remoteQuery(Promise.resolve(people[name] ?? null)),
    );
  seedPerson.mockReset();
});

describe("PersonFilterCombobox", () => {
  it("names the trigger All when nobody is selected", async () => {
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);

    await screen.getByRole("button", { name: "Maintained by: All" }).click();

    await expect
      .element(screen.getByRole("option", { name: "All" }))
      .toHaveAttribute("aria-selected", "true");
    expect(getPersonByName).not.toHaveBeenCalled();
  });

  it("names the trigger after the selected person and lists them as selected", async () => {
    const screen = await render(
      PersonFilterCombobox,
      {
        ...baseProps,
        value: "alice",
      },
      formOptions,
    );

    await screen
      .getByRole("button", { name: "Maintained by: Alice Example" })
      .click();

    await expect
      .element(screen.getByRole("option", { name: /Alice Example/ }))
      .toHaveAttribute("aria-selected", "true");
    await expect
      .element(screen.getByRole("option", { name: "All" }))
      .toHaveAttribute("aria-selected", "false");
    expect(getPersonByName).toHaveBeenCalledWith("alice");
  });

  it("lists search results without repeating the selected person", async () => {
    const screen = await render(
      PersonFilterCombobox,
      {
        ...baseProps,
        value: "alice",
      },
      formOptions,
    );
    await openAndSearch(screen, "example");

    const results = screen.getByRole("group", { name: "Search results" });
    await expect
      .element(results.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    expect(results.getByRole("option").elements()).toHaveLength(1);
    expect(findPeople).toHaveBeenCalledExactlyOnceWith({ text: "example" });
  });

  const tooShort = "a".repeat(MIN_PEOPLE_SEARCH_LENGTH - 1);
  it.each([tooShort, `  ${tooShort}  `])(
    "does not search for fewer non-blank characters than the minimum (%j)",
    async (text) => {
      const screen = await render(PersonFilterCombobox, baseProps, formOptions);
      await openAndSearch(screen, text);

      await expect
        .element(searchBox(screen))
        .toHaveAccessibleDescription(
          `Enter at least ${MIN_PEOPLE_SEARCH_LENGTH} characters`,
        );
      await expect
        .element(screen.getByRole("group", { name: "Search results" }))
        .not.toBeInTheDocument();
      expect(findPeople).not.toHaveBeenCalled();
    },
  );

  it("shows a loading state instead of the previous results on every search", async () => {
    const first = Promise.withResolvers<PersonEntry[]>();
    findPeople.mockImplementation(() => remoteQuery(first.promise));
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await openAndSearch(screen, "example");

    await expect.element(screen.getByText("Loading…")).toBeVisible();
    first.resolve([bob]);
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    await expect.element(screen.getByText("Loading…")).not.toBeInTheDocument();

    const second = Promise.withResolvers<PersonEntry[]>();
    findPeople.mockImplementation(() => remoteQuery(second.promise));
    await searchFor(screen, "alice");

    await expect.element(screen.getByText("Loading…")).toBeVisible();
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .not.toBeInTheDocument();
    second.resolve([alice]);
    await expect
      .element(screen.getByRole("option", { name: /Alice Example/ }))
      .toBeVisible();
  });

  it("shows when nobody matches the search", async () => {
    findPeople.mockImplementation(() => remoteQuery(Promise.resolve([])));
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await openAndSearch(screen, "nobody");

    await expect.element(screen.getByText("No results.")).toBeVisible();
  });

  it("shows a failed search and recovers on the next search", async () => {
    const message = "Failed to load search results.";
    vi.spyOn(console, "error").mockImplementation(() => {});
    findPeople.mockImplementationOnce(() =>
      remoteQuery(Promise.reject(new Error("Launchpad is down"))),
    );
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await openAndSearch(screen, "example");

    await expect.element(screen.getByText(message)).toBeVisible();
    await expect
      .element(screen.getByRole("listbox"))
      .toHaveAttribute("aria-busy", "false");

    await searchFor(screen, "bob example");
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    await expect.element(screen.getByText(message)).not.toBeInTheDocument();
  });

  it("submits the chosen person and seeds its lookup with the search result", async () => {
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await openAndSearch(screen, "example");

    await choose(screen, screen.getByRole("option", { name: /Bob Example/ }));

    expect(onchange).toHaveBeenCalledExactlyOnceWith(expect.any(Event), "bob");
    expect(submissions).toEqual([[["maintainer", "bob"]]]);
    expect(getPersonByName).toHaveBeenLastCalledWith("bob");
    expect(seedPerson).toHaveBeenCalledExactlyOnceWith(bob);
  });

  it("submits an empty value when All is chosen", async () => {
    const screen = await render(
      PersonFilterCombobox,
      {
        ...baseProps,
        value: "alice",
      },
      formOptions,
    );
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();
    await searchBox(screen).click();

    await choose(screen, screen.getByRole("option", { name: "All" }));

    expect(onchange).toHaveBeenCalledExactlyOnceWith(expect.any(Event), null);
    expect(submissions).toEqual([[["maintainer", ""]]]);
    expect(seedPerson).not.toHaveBeenCalled();
  });

  it("searches again on Enter once Escape clears the active option", async () => {
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await openAndSearch(screen, "example");
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    await userEvent.keyboard("{ArrowDown}");
    await searchBox(screen).fill("alice");

    await userEvent.keyboard("{Escape}");
    await expect
      .element(searchBox(screen))
      .not.toHaveAttribute("aria-activedescendant");
    await expect.element(searchBox(screen)).toHaveValue("alice");
    await userEvent.keyboard("{Enter}");

    expect(findPeople).toHaveBeenLastCalledWith({ text: "alice" });
    expect(onchange).not.toHaveBeenCalled();
  });

  it("searches with the search button", async () => {
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();
    await searchBox(screen).fill("example");

    await screen.getByRole("button", { name: "Search maintainers" }).click();

    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    expect(findPeople).toHaveBeenCalledExactlyOnceWith({ text: "example" });
  });

  it("keeps an unfinished search out of the form's submissions", async () => {
    const screen = await render(PersonFilterCombobox, baseProps, formOptions);
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();
    await searchBox(screen).fill("ab");

    const form = screen
      .getByRole("form", {
        name: "Maintained by:",
      })
      .element() as HTMLFormElement;
    form.requestSubmit();

    expect(submissions).toEqual([[["maintainer", ""]]]);
  });

  it("starts with a search submitted without JavaScript", async () => {
    const screen = await render(
      PersonFilterCombobox,
      {
        ...baseProps,
        searchInputProps: { name: "maintainer-search", value: "example" },
      },
      formOptions,
    );
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();

    await expect.element(searchBox(screen)).toHaveValue("example");
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    expect(findPeople).toHaveBeenCalledWith({ text: "example" });
  });

  it("keeps an invalid submitted search without running it", async () => {
    const screen = await render(
      PersonFilterCombobox,
      {
        ...baseProps,
        searchInputProps: {
          name: "maintainer-search",
          value: "ab",
          "aria-invalid": "true",
        },
      },
      formOptions,
    );
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();

    await expect.element(searchBox(screen)).toHaveValue("ab");
    await expect
      .element(screen.getByRole("group", { name: "Search results" }))
      .not.toBeInTheDocument();
    expect(findPeople).not.toHaveBeenCalled();
  });
});

function searchBox(screen: PersonFilterScreen): Locator {
  return screen.getByRole("combobox", { name: "Search maintainers" });
}

async function searchFor(
  screen: PersonFilterScreen,
  text: string,
): Promise<void> {
  await searchBox(screen).fill(text);
  await userEvent.keyboard("{Enter}");
}

async function openAndSearch(
  screen: PersonFilterScreen,
  text: string,
): Promise<void> {
  await screen.getByRole("button", { name: /^Maintained by:/ }).click();
  await searchFor(screen, text);
}

async function choose(
  screen: PersonFilterScreen,
  option: Locator,
): Promise<void> {
  const optionId = option.element().id;
  const search = searchBox(screen).element();
  for (let step = 0; step < 10; step++) {
    if (search.getAttribute("aria-activedescendant") === optionId) break;
    await userEvent.keyboard("{ArrowDown}");
  }
  await userEvent.keyboard("{Enter}");
}
