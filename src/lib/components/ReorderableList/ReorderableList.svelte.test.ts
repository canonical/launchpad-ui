import type { Component as SvelteComponent } from "svelte";
import { tick } from "svelte";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { Component, RenderResult } from "vitest-browser-svelte";
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
  key: (item: TestItem) => item.id,
  itemLabel: (item: TestItem) => item.name,
  item: itemSnippet,
  duration: 0,
} as const satisfies ReorderableListProps<TestItem>;

const initialOrder = ["Reorder Alpha", "Reorder Bravo", "Reorder Charlie"];

describe("ReorderableList component", () => {
  describe("markup", () => {
    it("renders a labelled list of items in order", async () => {
      const page = render(Component, baseProps);
      await expect.element(page.getByRole("list")).toBeInTheDocument();
      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("describes every handle with the shared instructions", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const describedBy = handle.element().getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy ?? "")?.textContent).toContain(
        "Press Enter or Space to pick up the item",
      );
    });

    it("exposes a position input per item", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Bravo" });
      await expect.element(input).toHaveValue(2);
      await expect.element(input).toHaveAttribute("max", "3");
    });

    it("renders extra content per item", async () => {
      const page = render(Component, {
        ...baseProps,
        extraContent: extraContentSnippet,
      });
      await expect.element(page.getByText("Extra Bravo")).toBeInTheDocument();
    });

    it("re-renders when the items change from the outside", async () => {
      const props = $state({ ...baseProps });
      const page = render(Component, props);

      props.items = [threeItems[2], threeItems[0]];
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Charlie", "Reorder Alpha"]);
      await expect
        .element(page.getByRole("spinbutton", { name: "Position of Alpha" }))
        .toHaveAttribute("max", "2");
    });
  });

  describe("binding", () => {
    it("writes the new order back to the bound items", async () => {
      const props = $state({ ...baseProps });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");

      await expect
        .poll(() => props.items.map((item) => item.name))
        .toEqual(["Bravo", "Alpha", "Charlie"]);
    });
  });

  describe("keyboard reordering", () => {
    it("picks up, moves and drops an item", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}");
      await expect.element(handle).toHaveAttribute("aria-pressed", "true");
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Picked up Alpha. Position 1 of 3.");

      await userEvent.keyboard("{ArrowDown}");
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha moved to position 2 of 3.");

      await userEvent.keyboard("{Enter}");
      await expect.element(handle).toHaveAttribute("aria-pressed", "false");
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha dropped at position 2 of 3.");
    });

    it("moves to the end with End and keeps focus on the handle", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}{End}");
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Charlie", "Reorder Alpha"]);
      expect(document.activeElement).toBe(handle.element());
    });

    it("restores the original order when cancelled with Escape", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}{ArrowDown}");
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      await userEvent.keyboard("{Escape}");
      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent(
          "Reordering cancelled. Alpha returned to position 1 of 3.",
        );
    });

    it("moves an item without picking it up using Alt and an arrow key", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Charlie" });

      focus(handle.element());
      await userEvent.keyboard("{Alt>}{ArrowUp}{/Alt}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Alpha", "Reorder Charlie", "Reorder Bravo"]);
      await expect.element(handle).toHaveAttribute("aria-pressed", "false");
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Charlie moved to position 2 of 3.");
    });

    it("moves to the start with Home", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Charlie" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}{Home}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Charlie", "Reorder Alpha", "Reorder Bravo"]);
    });

    it("keeps the item in place when moved past the list bounds", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}{ArrowUp}{Home}");

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Picked up Alpha. Position 1 of 3.");
    });

    it("drops a grabbed item when the handle loses focus", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}");
      await expect.element(handle).toHaveAttribute("aria-pressed", "true");

      handle.element().blur();

      await expect.element(handle).toHaveAttribute("aria-pressed", "false");
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha dropped at position 1 of 3.");
    });

    it("keeps focus on the handle it moves across items", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
      expect(document.activeElement).toBe(handle.element());
    });
  });

  describe("position input", () => {
    it("moves the item on Enter", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Alpha" });

      await input.fill("3");
      await userEvent.keyboard("{Enter}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Charlie", "Reorder Alpha"]);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha moved to position 3 of 3.");
    });

    it("clamps out of range positions", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Alpha" });

      await input.fill("99");
      await userEvent.keyboard("{Enter}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Charlie", "Reorder Alpha"]);
      await expect.element(input).toHaveValue(3);
    });

    it("reverts the typed value on Escape", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Alpha" });

      await input.fill("3");
      await userEvent.keyboard("{Escape}");

      await expect.element(input).toHaveValue(1);
      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("moves the item on blur", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Alpha" });

      await input.fill("2");
      (input.element() as HTMLInputElement).blur();

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
    });

    it("clamps positions below the start of the list", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", {
        name: "Position of Charlie",
      });

      await input.fill("0");
      await userEvent.keyboard("{Enter}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Charlie", "Reorder Alpha", "Reorder Bravo"]);
      await expect.element(input).toHaveValue(1);
    });

    it("ignores an empty value", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Alpha" });

      await input.fill("");
      await userEvent.keyboard("{Enter}");

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect.element(input).toHaveValue(1);
    });

    it("keeps focus in the input after a move", async () => {
      const page = render(Component, baseProps);
      const input = page.getByRole("spinbutton", { name: "Position of Alpha" });

      await input.fill("3");
      await userEvent.keyboard("{Enter}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Charlie", "Reorder Alpha"]);
      expect(document.activeElement).toBe(input.element());
    });
  });

  describe("pointer dragging", () => {
    it("reorders when dragged past the next item", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", to + 2));

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);

      window.dispatchEvent(pointerEvent("pointerup", to + 2));
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha dropped at position 2 of 3.");
      // Let the drop's post-tick settle animation run before unmount tears down the drag session.
      await tick();
    });

    it("does not start a drag below the movement threshold", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", from + 3));
      window.dispatchEvent(pointerEvent("pointerup", from + 3));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      expect(page.getByRole("status").element().textContent?.trim()).toBe("");
    });

    it("restores the original order when Escape is pressed mid drag", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", to + 2));
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Reordering cancelled.");
      // Let the cancel's post-tick settle animation run before unmount tears down the drag session.
      await tick();
    });

    it("restores the original order when the pointer is cancelled", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", to + 2));
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      window.dispatchEvent(pointerEvent("pointercancel", to + 2));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Reordering cancelled.");
      // Let the cancel's post-tick settle animation run before unmount tears down the drag session.
      await tick();
    });

    it("ignores a non primary button", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle
        .element()
        .dispatchEvent(pointerEvent("pointerdown", from, { button: 2 }));
      window.dispatchEvent(pointerEvent("pointermove", to + 2));
      window.dispatchEvent(pointerEvent("pointerup", to + 2));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("ignores moves from another pointer", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(
        pointerEvent("pointermove", to + 2, { pointerId: 2 }),
      );
      window.dispatchEvent(pointerEvent("pointerup", to + 2));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });
  });

  describe("input method exclusivity", () => {
    it("does not start a drag while an item is grabbed with the keyboard", async () => {
      const page = render(Component, baseProps);
      const grabbed = page.getByRole("button", { name: "Reorder Alpha" });
      const dragged = page.getByRole("button", { name: "Reorder Charlie" });
      const [, , from] = centres(page);

      focus(grabbed.element());
      await userEvent.keyboard("{Enter}");

      dragged.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", from - 100));
      window.dispatchEvent(pointerEvent("pointerup", from - 100));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("does not grab with the keyboard while dragging", async () => {
      const page = render(Component, baseProps);
      const dragged = page.getByRole("button", { name: "Reorder Alpha" });
      const other = page.getByRole("button", { name: "Reorder Charlie" });
      const [from, to] = centres(page);

      dragged.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", to + 2));
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      focus(other.element());
      await userEvent.keyboard("{Enter}");
      await expect.element(other).toHaveAttribute("aria-pressed", "false");

      window.dispatchEvent(pointerEvent("pointerup", to + 2));
      // Let the drop's post-tick settle animation run before unmount tears down the drag session.
      await tick();
    });
  });

  describe("disabled", () => {
    const disabledProps = { ...baseProps, disabled: true } as const;

    it("disables every control", async () => {
      const page = render(Component, disabledProps);
      await expect
        .element(page.getByRole("button", { name: "Reorder Alpha" }))
        .toBeDisabled();
      await expect
        .element(page.getByRole("spinbutton", { name: "Position of Alpha" }))
        .toBeDisabled();
    });

    it("does not reorder with the keyboard", async () => {
      const page = render(Component, disabledProps);
      const handle = page.getByRole("button", { name: "Reorder Charlie" });

      handle.element().dispatchEvent(keydownEvent("Enter"));
      handle.element().dispatchEvent(keydownEvent("ArrowUp", { altKey: true }));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect.element(handle).toHaveAttribute("aria-pressed", "false");
      expect(page.getByRole("status").element().textContent?.trim()).toBe("");
    });

    it("does not reorder with the pointer", async () => {
      const page = render(Component, disabledProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      window.dispatchEvent(pointerEvent("pointermove", to + 2));
      window.dispatchEvent(pointerEvent("pointerup", to + 2));

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });
  });
});

function handleLabels(page: RenderResult<Component>): (string | null)[] {
  return page
    .getByRole("button")
    .elements()
    .map((handle) => handle.getAttribute("aria-label"));
}

function focus(element: Element): void {
  (element as HTMLElement).focus();
}

function pointerEvent(
  type: string,
  clientY: number,
  { button = 0, pointerId = 1 }: { button?: number; pointerId?: number } = {},
): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    button,
    buttons: type === "pointerup" ? 0 : 1,
    clientY,
  });
}

function keydownEvent(
  key: string,
  init: KeyboardEventInit = {},
): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key,
    ...init,
  });
}

function centres(page: RenderResult<Component>) {
  const items = page.getByRole("listitem").elements();
  return items.map((item) => {
    const rect = item.getBoundingClientRect();
    return rect.top + rect.height / 2;
  });
}
