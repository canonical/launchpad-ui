import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { Component as SvelteComponent } from "svelte";
import { describe, expect, it } from "vitest";
import ReorderableList from "./ReorderableList.svelte";
import {
  extraContentSnippet,
  itemSnippet,
  threeItems,
} from "./test.fixtures.svelte";
import type { TestItem } from "./test.fixtures.svelte";
import type { ReorderableListProps } from "./types.js";

// `render` cannot infer the `generics="T"` parameter, so pin it to the fixture type.
const Component = ReorderableList as unknown as SvelteComponent<
  ReorderableListProps<TestItem>
>;

const baseProps = {
  items: threeItems.slice(),
  label: "Test list",
  key: (item: TestItem) => item.id,
  itemLabel: (item: TestItem) => item.name,
  item: itemSnippet,
  duration: 0,
};

describe("ReorderableList SSR", () => {
  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: baseProps });
      }).not.toThrow();
    });

    it("uses an ordered list as the root", () => {
      const page = render(Component, { props: baseProps });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLOListElement,
      );
    });

    it("renders every item in order", () => {
      const page = render(Component, { props: baseProps });
      expect(
        Array.from(
          componentLocator(page).querySelectorAll(".content span"),
        ).map((node) => node.textContent),
      ).toEqual(["Alpha", "Bravo", "Charlie"]);
    });

    it("renders the keyboard instructions and the live region", () => {
      const page = render(Component, { props: baseProps });
      const root = componentLocator(page);
      const describedBy = root
        .querySelector("button")
        ?.getAttribute("aria-describedby");

      expect(page.getByRole("status")).toBeDefined();
      expect(
        root.ownerDocument.getElementById(describedBy ?? "")?.textContent,
      ).toContain("Press Enter or Space to pick up the item");
    });

    it("renders extra content per item", () => {
      const page = render(Component, {
        props: { ...baseProps, extraContent: extraContentSnippet },
      });
      expect(componentLocator(page).textContent).toContain("Extra Bravo");
    });

    it("labels the controls of every item", () => {
      const page = render(Component, { props: baseProps });
      const root = componentLocator(page);

      expect(
        Array.from(root.querySelectorAll("button")).map((node) =>
          node.getAttribute("aria-label"),
        ),
      ).toEqual(["Reorder Alpha", "Reorder Bravo", "Reorder Charlie"]);
      expect(
        Array.from(root.querySelectorAll("input")).map((node) =>
          node.getAttribute("aria-label"),
        ),
      ).toEqual([
        "Position of Alpha",
        "Position of Bravo",
        "Position of Charlie",
      ]);
    });

    it("renders the position of every item", () => {
      const page = render(Component, { props: baseProps });
      expect(
        Array.from(componentLocator(page).querySelectorAll("input")).map(
          (node) => node.getAttribute("value"),
        ),
      ).toEqual(["1", "2", "3"]);
    });
  });

  describe("attributes", () => {
    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const root = componentLocator(page);
      expect(root.classList).toContain("ds");
      expect(root.classList).toContain("reorderable-list");
      expect(root.classList).toContain("test-class");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });

    it("forwards id to the root", () => {
      const page = render(Component, {
        props: { ...baseProps, id: "test-id" },
      });
      expect(componentLocator(page).getAttribute("id")).toBe("test-id");
    });

    it("disables the controls when disabled", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      const root = componentLocator(page);
      expect(root.querySelectorAll("button[disabled]")).toHaveLength(3);
      expect(root.querySelectorAll("input[disabled]")).toHaveLength(3);
    });
  });
});

function componentLocator(page: RenderResult): HTMLOListElement {
  return page.getByRole("list") as HTMLOListElement;
}
