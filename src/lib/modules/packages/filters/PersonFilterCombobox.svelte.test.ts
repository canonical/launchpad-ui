import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { PersonEntry } from "$lib/server/launchpad/types.js";
import PersonFilterCombobox from "./PersonFilterCombobox.svelte";
import {
  FILTERS_FORM_ID,
  FILTER_LABEL_ID,
  mountFiltersForm,
} from "./test.fixtures.js";
import { goto } from "$app/navigation";
import { page } from "$app/state";

const { findPeople, getPersonByName, seedPerson } = vi.hoisted(() => ({
  findPeople: vi.fn(),
  getPersonByName: vi.fn(),
  seedPerson: vi.fn(),
}));

vi.mock("$lib/modules/people/people.remote.js", () => ({
  findPeople,
  getPersonByName,
}));

vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: { url: new SvelteURL("https://launchpad.test/ubuntu/+source") },
  };
});

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

const baseProps = {
  form: FILTERS_FORM_ID,
  inputName: "maintainer",
  selectedPersonName: null,
  groupName: "maintainers",
  "aria-labelledby": FILTER_LABEL_ID,
};

let submissions: [string, string][][];

beforeEach(() => {
  page.url.search = "";
  submissions = mountFiltersForm("Maintained by:");
  findPeople
    .mockReset()
    .mockImplementation(() => remoteQuery(Promise.resolve([alice, bob])));
  getPersonByName
    .mockReset()
    .mockImplementation(({ text }: { text: string }) =>
      remoteQuery(Promise.resolve(people[text] ?? null)),
    );
  seedPerson.mockReset();
  vi.mocked(goto).mockReset();
});

describe("PersonFilterCombobox", () => {
  it("names the trigger All when nobody is selected", async () => {
    const screen = await render(PersonFilterCombobox, baseProps);

    await screen.getByRole("button", { name: "Maintained by: All" }).click();

    await expect
      .element(screen.getByRole("option", { name: "All" }))
      .toHaveAttribute("aria-selected", "true");
    expect(getPersonByName).not.toHaveBeenCalled();
    expect(goto).not.toHaveBeenCalled();
  });

  it("names the trigger after the selected person and lists them as selected", async () => {
    const screen = await render(PersonFilterCombobox, {
      ...baseProps,
      selectedPersonName: "alice",
    });

    await screen
      .getByRole("button", { name: "Maintained by: Alice Example" })
      .click();

    await expect
      .element(screen.getByRole("option", { name: /Alice Example/ }))
      .toHaveAttribute("aria-selected", "true");
    await expect
      .element(screen.getByRole("option", { name: "All" }))
      .toHaveAttribute("aria-selected", "false");
    expect(getPersonByName).toHaveBeenCalledWith({ text: "alice" });
  });

  it("lists search results without repeating the selected person", async () => {
    const screen = await render(PersonFilterCombobox, {
      ...baseProps,
      selectedPersonName: "alice",
    });
    await openAndSearch(screen, "example");

    const results = screen.getByRole("group", { name: "Search results" });
    await expect
      .element(results.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    expect(results.getByRole("option").elements()).toHaveLength(1);
    expect(findPeople).toHaveBeenCalledExactlyOnceWith({ text: "example" });
  });

  it.each(["ab", "  ab  "])(
    "does not search for fewer than 3 non-blank characters (%j)",
    async (text) => {
      const screen = await render(PersonFilterCombobox, baseProps);
      await openAndSearch(screen, text);

      await expect
        .element(searchBox(screen))
        .toHaveAccessibleDescription("Enter at least 3 characters");
      await expect
        .element(screen.getByRole("group", { name: "Search results" }))
        .not.toBeInTheDocument();
      expect(findPeople).not.toHaveBeenCalled();
    },
  );

  it("shows a loading state instead of the previous results on every search", async () => {
    const first = Promise.withResolvers<PersonEntry[]>();
    findPeople.mockImplementation(() => remoteQuery(first.promise));
    const screen = await render(PersonFilterCombobox, baseProps);
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
    const screen = await render(PersonFilterCombobox, baseProps);
    await openAndSearch(screen, "nobody");

    await expect.element(screen.getByText("No results.")).toBeVisible();
  });

  it("shows a failed search and recovers on the next search", async () => {
    const message = "Failed to load search results.";
    vi.spyOn(console, "error").mockImplementation(() => {});
    findPeople.mockImplementationOnce(() =>
      remoteQuery(Promise.reject(new Error("Launchpad is down"))),
    );
    const screen = await render(PersonFilterCombobox, baseProps);
    await openAndSearch(screen, "example");

    await expect.element(screen.getByText(message)).toBeVisible();
    await expect
      .element(screen.getByRole("listbox"))
      .toHaveAttribute("aria-busy", "false");

    await searchFor(screen, "bob");
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    await expect.element(screen.getByText(message)).not.toBeInTheDocument();
  });

  it("submits the chosen person and seeds its lookup with the search result", async () => {
    const screen = await render(PersonFilterCombobox, baseProps);
    await openAndSearch(screen, "example");

    await choose(screen, screen.getByRole("option", { name: /Bob Example/ }));

    expect(submissions).toEqual([[["maintainer", "bob"]]]);
    expect(getPersonByName).toHaveBeenLastCalledWith({ text: "bob" });
    expect(seedPerson).toHaveBeenCalledExactlyOnceWith(bob);
  });

  it("submits an empty value when All is chosen", async () => {
    const screen = await render(PersonFilterCombobox, {
      ...baseProps,
      selectedPersonName: "alice",
    });
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();
    await searchBox(screen).click();

    await choose(screen, screen.getByRole("option", { name: "All" }));

    expect(submissions).toEqual([[["maintainer", ""]]]);
    expect(seedPerson).not.toHaveBeenCalled();
  });

  it("restores a search submitted without JavaScript and drops it from the URL", async () => {
    page.url.search = "?page=2&maintainer-combobox-search=example";
    const screen = await render(PersonFilterCombobox, baseProps);
    await screen.getByRole("button", { name: /^Maintained by:/ }).click();

    await expect.element(searchBox(screen)).toHaveValue("example");
    await expect
      .element(screen.getByRole("option", { name: /Bob Example/ }))
      .toBeVisible();
    expect(findPeople).toHaveBeenCalledWith({ text: "example" });
    expect(goto).toHaveBeenCalledExactlyOnceWith(
      new URL("https://launchpad.test/ubuntu/+source?page=2"),
      { replaceState: true, keepFocus: true, noScroll: true },
    );
  });
});

function searchBox(screen: RenderResult<typeof PersonFilterCombobox>): Locator {
  return screen.getByRole("combobox", { name: "Search maintainers" });
}

async function searchFor(
  screen: RenderResult<typeof PersonFilterCombobox>,
  text: string,
): Promise<void> {
  await searchBox(screen).fill(text);
  await userEvent.keyboard("{Enter}");
}

async function openAndSearch(
  screen: RenderResult<typeof PersonFilterCombobox>,
  text: string,
): Promise<void> {
  await screen.getByRole("button", { name: /^Maintained by:/ }).click();
  await searchFor(screen, text);
}

async function choose(
  screen: RenderResult<typeof PersonFilterCombobox>,
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
