import type { Component as SvelteComponent } from "svelte";
import { tick } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { Component, RenderResult } from "vitest-browser-svelte";
import ReorderableList from "./ReorderableList.svelte";
import { itemSnippet, threeItems } from "./test.fixtures.svelte";
import type { TestItem } from "./test.fixtures.svelte";
import type { ReorderableListProps } from "./types.js";
import { listCoordinates } from "./utils/listCoordinates.js";

// `render` cannot infer the `generics="T"` parameter, so pin it to the fixture type.
const Component = ReorderableList as unknown as SvelteComponent<
  ReorderableListProps<TestItem>
>;

const baseProps = {
  items: threeItems.slice(),
  key: (item: TestItem) => item.id,
  itemLabel: (item: TestItem) => item.name,
  item: itemSnippet,
  animationDuration: 0,
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

    it("leaves the bound items untouched until a pointer drag is dropped", async () => {
      const props = $state({ ...baseProps });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
      expect(props.items.map((item) => item.name)).toEqual([
        "Alpha",
        "Bravo",
        "Charlie",
      ]);

      dispatchListPointerEvent(page, "pointerup", to + 2);
      await expect
        .poll(() => props.items.map((item) => item.name))
        .toEqual(["Bravo", "Alpha", "Charlie"]);
      await tick();
    });

    it("leaves the bound items untouched until a keyboard grab is dropped", async () => {
      const props = $state({ ...baseProps });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}{ArrowDown}");

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
      expect(props.items.map((item) => item.name)).toEqual([
        "Alpha",
        "Bravo",
        "Charlie",
      ]);

      await userEvent.keyboard("{Enter}");
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

    it("publishes throttled move announcements with the current item count", async () => {
      const props = $state({ ...baseProps });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);

      props.items = [threeItems[1], threeItems[0]];

      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha moved to position 2 of 2.");
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

    it("releases keyboard activity when the grabbed item is removed", async () => {
      const props = $state({ ...baseProps });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });

      focus(handle.element());
      await userEvent.keyboard("{Enter}");
      await expect.element(handle).toHaveAttribute("aria-pressed", "true");

      props.items = threeItems.slice(1);
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Charlie"]);

      const nextHandle = page.getByRole("button", { name: "Reorder Bravo" });
      const [from, to] = centres(page);

      nextHandle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Charlie", "Reorder Bravo"]);

      dispatchListPointerEvent(page, "pointerup", to + 2);
      await tick();
    });
  });

  describe("position input", () => {
    describe.each(["Enter", "blur"] as const)("committing on %s", (commit) => {
      it.each([
        { value: "1e2", position: 3, expected: ["Bravo", "Charlie", "Alpha"] },
        {
          value: "20e-1",
          position: 2,
          expected: ["Bravo", "Alpha", "Charlie"],
        },
      ])(
        "interprets $value as a number",
        async ({ value, position, expected }) => {
          const props = $state({ ...baseProps });
          const page = render(Component, props);
          const input = page.getByRole("spinbutton", {
            name: "Position of Alpha",
          });

          await input.fill(value);
          if (commit === "Enter") await userEvent.keyboard("{Enter}");
          else (input.element() as HTMLInputElement).blur();

          await expect
            .poll(() => props.items.map((item) => item.name))
            .toEqual(expected);
          await expect.element(input).toHaveValue(position);
        },
      );

      it.each(["2.5", "1e-1"])(
        "rejects fractional position %s",
        async (value) => {
          const props = $state({ ...baseProps });
          const page = render(Component, props);
          const input = page.getByRole("spinbutton", {
            name: "Position of Bravo",
          });

          await input.fill(value);
          if (commit === "Enter") await userEvent.keyboard("{Enter}");
          else (input.element() as HTMLInputElement).blur();

          await expect.element(input).toHaveValue(2);
          expect(props.items.map((item) => item.name)).toEqual([
            "Alpha",
            "Bravo",
            "Charlie",
          ]);
        },
      );
    });

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

  describe("drop indicator mode", () => {
    const indicatorProps = {
      ...baseProps,
      dragMode: "drop-indicator",
    } as const;

    it.each([
      { from: 0, to: 1, expected: ["Bravo", "Alpha", "Charlie"] },
      { from: 0, to: 2, expected: ["Bravo", "Charlie", "Alpha"] },
      { from: 1, to: 0, expected: ["Bravo", "Alpha", "Charlie"] },
      { from: 1, to: 2, expected: ["Alpha", "Charlie", "Bravo"] },
      { from: 2, to: 0, expected: ["Charlie", "Alpha", "Bravo"] },
      { from: 2, to: 1, expected: ["Alpha", "Charlie", "Bravo"] },
    ])(
      "keeps rows fixed until dropping from $from to $to",
      async ({ from, to, expected }) => {
        const props = $state({ ...indicatorProps });
        const page = render(Component, props);
        const rows = page.getByRole("listitem").elements() as HTMLElement[];
        // Exercise unequal row heights as well as jumps across multiple rows.
        rows.forEach(
          (row, index) => (row.style.height = `${50 + index * 25}px`),
        );
        const positions = centres(page);
        const destination = positions[to] + (to > from ? 2 : -2);
        page
          .getByRole("button", { name: initialOrder[from] })
          .element()
          .dispatchEvent(pointerEvent("pointerdown", positions[from]));
        dispatchListPointerEvent(page, "pointermove", destination);
        await tick();

        expect(handleLabels(page)).toEqual(initialOrder);
        expect(page.getByRole("listitem").elements()).toEqual(rows);
        expect(centres(page)).toEqual(positions);
        expect(props.items.map((item) => item.name)).toEqual([
          "Alpha",
          "Bravo",
          "Charlie",
        ]);
        const line = page
          .getByRole("list")
          .element()
          .querySelector("[data-dropindicator]");
        expect(line).toBe(rows[to]);
        expect(line?.getAttribute("data-dropindicator")).toBe(
          to > from ? "after" : "before",
        );
        expect(getComputedStyle(rows[to], "::after").borderTopStyle).toBe(
          "solid",
        );

        dispatchListPointerEvent(page, "pointerup", destination);
        await expect
          .poll(() => props.items.map((item) => item.name))
          .toEqual(expected);
        expect(
          page
            .getByRole("list")
            .element()
            .querySelector("[data-dropindicator]"),
        ).toBeNull();
        await tick();
      },
    );

    it("hides both adjacent insertion edges when returning to the original position", async () => {
      const props = $state({ ...indicatorProps });
      const page = render(Component, props);
      const list = page.getByRole("list").element();
      const positions = centres(page);
      page
        .getByRole("button", { name: "Reorder Bravo" })
        .element()
        .dispatchEvent(pointerEvent("pointerdown", positions[1]));
      for (const destination of [positions[1] - 6, positions[1] + 6]) {
        dispatchListPointerEvent(page, "pointermove", destination);
        await tick();
        expect(list.querySelector("[data-dropindicator]")).toBeNull();
      }
      dispatchListPointerEvent(page, "pointermove", positions[2] + 2);
      await tick();
      expect(list.querySelector("[data-dropindicator]")).not.toBeNull();
      dispatchListPointerEvent(page, "pointermove", positions[1]);
      await tick();
      expect(list.querySelector("[data-dropindicator]")).toBeNull();
      dispatchListPointerEvent(page, "pointerup", positions[1]);
      await tick();
      expect(props.items.map((item) => item.name)).toEqual([
        "Alpha",
        "Bravo",
        "Charlie",
      ]);
    });

    it.each([
      "pointercancel",
      "lostpointercapture",
      "Escape",
      "disable",
      "remove",
    ])("clears the indicator without committing on %s", async (reason) => {
      const props = $state({ ...indicatorProps, disabled: false });
      const page = render(Component, props);
      const list = page.getByRole("list").element();
      const [from, to] = centres(page);
      page
        .getByRole("button", { name: "Reorder Alpha" })
        .element()
        .dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await tick();
      expect(list.querySelector("[data-dropindicator]")).not.toBeNull();

      if (reason === "disable") props.disabled = true;
      else if (reason === "remove") props.items = props.items.slice(1);
      else if (reason === "Escape")
        window.dispatchEvent(keydownEvent("Escape"));
      else dispatchListPointerEvent(page, reason, to + 2);
      await tick();

      expect(list.querySelector("[data-dropindicator]")).toBeNull();
      expect(props.items.map((item) => item.name)).toEqual(
        reason === "remove"
          ? ["Bravo", "Charlie"]
          : ["Alpha", "Bravo", "Charlie"],
      );
    });

    it("still previews keyboard reordering immediately", async () => {
      const props = $state({ ...indicatorProps });
      const page = render(Component, props);
      focus(page.getByRole("button", { name: "Reorder Alpha" }).element());
      await userEvent.keyboard("{Enter}{ArrowDown}");
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
      expect(
        page.getByRole("list").element().querySelector("[data-dropindicator]"),
      ).toBeNull();
      expect(props.items.map((item) => item.name)).toEqual([
        "Alpha",
        "Bravo",
        "Charlie",
      ]);
      await userEvent.keyboard("{Enter}");
      expect(props.items.map((item) => item.name)).toEqual([
        "Bravo",
        "Alpha",
        "Charlie",
      ]);
    });
  });

  describe("pointer dragging", () => {
    it.each([
      { endEvent: "pointerup", dragMode: "preview" },
      { endEvent: "pointercancel", dragMode: "preview" },
      { endEvent: "pointerup", dragMode: "drop-indicator" },
      { endEvent: "pointercancel", dragMode: "drop-indicator" },
    ] as const)(
      "settles the $dragMode overlay without a shadow after $endEvent",
      async ({ endEvent, dragMode }) => {
        const page = render(Component, {
          ...baseProps,
          animationDuration: 200,
          dragMode,
        });
        const list = page.getByRole("list").element();
        const [from, to] = centres(page);
        page
          .getByRole("button", { name: "Reorder Alpha" })
          .element()
          .dispatchEvent(pointerEvent("pointerdown", from));
        dispatchListPointerEvent(page, "pointermove", to + 2);
        await tick();
        const overlay = list.querySelector<HTMLElement>(".drag-overlay")!;
        expect(getComputedStyle(overlay).boxShadow).not.toBe("none");

        dispatchListPointerEvent(page, endEvent, to + 2);
        await tick();
        expect(overlay.isConnected).toBe(true);
        expect(overlay).toHaveClass("overlay-settling");
        await expect.poll(() => overlay.isConnected).toBe(false);
        await expect
          .poll(() => handleLabels(page))
          .toEqual(
            endEvent === "pointerup"
              ? ["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]
              : initialOrder,
          );
      },
    );

    it.each([0.5, 1, 2])(
      "converts row positions in both directions at scale %s",
      (scale) => {
        const page = render(Component, {
          ...baseProps,
          style: `transform: scale(${scale}); transform-origin: top left; border: 4px solid; padding: 8px; height: 80px; overflow: auto; scroll-behavior: auto;`,
        });
        const list = page.getByRole("list").element() as HTMLElement;
        list.scrollTop = 8;
        const coordinates = listCoordinates(list);

        for (const element of page.getByRole("listitem").elements()) {
          const row = element as HTMLElement;
          const viewportTop = row.getBoundingClientRect().top;
          expect(coordinates.listToViewport(row.offsetTop)).toBeCloseTo(
            viewportTop,
          );
          expect(coordinates.viewportToList(viewportTop)).toBeCloseTo(
            row.offsetTop,
          );
        }
      },
    );

    it.each([
      {
        scale: 0.5,
        fromIndex: 0,
        direction: 1,
        name: "Alpha",
        expected: ["Bravo", "Alpha", "Charlie"],
      },
      {
        scale: 2,
        fromIndex: 0,
        direction: 1,
        name: "Alpha",
        expected: ["Bravo", "Alpha", "Charlie"],
      },
      {
        scale: 0.5,
        fromIndex: 2,
        direction: -1,
        name: "Charlie",
        expected: ["Alpha", "Charlie", "Bravo"],
      },
      {
        scale: 2,
        fromIndex: 2,
        direction: -1,
        name: "Charlie",
        expected: ["Alpha", "Charlie", "Bravo"],
      },
    ])(
      "moves $name one slot with ancestor scale $scale",
      async ({ scale, fromIndex, direction, name, expected }) => {
        const props = $state({
          ...baseProps,
          style:
            "border: 4px solid; padding: 8px; height: 80px; overflow: auto; scroll-behavior: auto;",
        });
        const page = render(Component, props);
        const list = page.getByRole("list").element() as HTMLElement;
        const container = list.parentElement!;
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = "top left";
        list.scrollTop = 8;
        const positions = centres(page);
        // Pick up away from the centre to exercise conversion of the grab offset too.
        const grabOffset = 3 * scale;
        const from = positions[fromIndex] + grabOffset;
        const to = positions[1] + grabOffset + direction * 2;

        page
          .getByRole("button", { name: `Reorder ${name}` })
          .element()
          .dispatchEvent(pointerEvent("pointerdown", from));
        dispatchListPointerEvent(page, "pointermove", to);
        await expect
          .poll(() => handleLabels(page))
          .toEqual(expected.map((label) => `Reorder ${label}`));
        dispatchListPointerEvent(page, "pointerup", to);
        await expect
          .poll(() => props.items.map((item) => item.name))
          .toEqual(expected);
        await tick();
      },
    );

    it.each(["pointerup", "pointercancel", "lostpointercapture"] as const)(
      "preserves dragging and forwards consumer handlers when ending with %s",
      async (endEvent) => {
        const onpointermove = vi.fn();
        const onend = vi.fn();
        const props = $state({
          ...baseProps,
          onpointermove,
          [`on${endEvent}`]: onend,
        });
        const page = render(Component, props);
        const list = page.getByRole("list").element();
        const [from, to] = centres(page);
        const moveEvent = pointerEvent("pointermove", to + 2);
        const finishEvent = pointerEvent(endEvent, to + 2);

        page
          .getByRole("button", { name: "Reorder Alpha" })
          .element()
          .dispatchEvent(pointerEvent("pointerdown", from));
        list.dispatchEvent(moveEvent);

        await expect
          .poll(() => handleLabels(page))
          .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);
        expect(onpointermove).toHaveBeenCalledExactlyOnceWith(moveEvent);
        expect(props.items.map((item) => item.name)).toEqual([
          "Alpha",
          "Bravo",
          "Charlie",
        ]);

        list.dispatchEvent(finishEvent);

        await expect
          .poll(() => props.items.map((item) => item.name))
          .toEqual(
            endEvent === "pointerup"
              ? ["Bravo", "Alpha", "Charlie"]
              : ["Alpha", "Bravo", "Charlie"],
          );
        await expect
          .element(page.getByRole("status"))
          .toHaveTextContent(
            endEvent === "pointerup"
              ? "Alpha dropped at position 2 of 3."
              : "Reordering cancelled. Alpha returned to position 1 of 3.",
          );
        expect(onend).toHaveBeenCalledExactlyOnceWith(finishEvent);
        await tick();
      },
    );

    it("reorders when dragged past the next item", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);

      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);

      dispatchListPointerEvent(page, "pointerup", to + 2);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Alpha dropped at position 2 of 3.");

      await tick();
    });

    it("does not start a drag below the movement threshold", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", from + 3);
      dispatchListPointerEvent(page, "pointerup", from + 3);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      expect(page.getByRole("status").element().textContent?.trim()).toBe("");
    });

    it("restores the original order when Escape is pressed mid drag", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Reordering cancelled.");

      await tick();
    });

    it("restores the original order when the pointer is cancelled", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      dispatchListPointerEvent(page, "pointercancel", to + 2);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect
        .element(page.getByRole("status"))
        .toHaveTextContent("Reordering cancelled.");

      await tick();
    });

    it("cancels the drag and releases activity when pointer capture is lost", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      dispatchListPointerEvent(page, "lostpointercapture", to + 2);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      focus(handle.element());
      await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);

      await tick();
    });

    it("ignores a non primary button", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle
        .element()
        .dispatchEvent(pointerEvent("pointerdown", from, { button: 2 }));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      dispatchListPointerEvent(page, "pointerup", to + 2);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("ignores moves from another pointer", async () => {
      const page = render(Component, baseProps);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2, { pointerId: 2 });
      dispatchListPointerEvent(page, "pointerup", to + 2);

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
      dispatchListPointerEvent(page, "pointermove", from - 100);
      dispatchListPointerEvent(page, "pointerup", from - 100);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("does not grab with the keyboard while dragging", async () => {
      const page = render(Component, baseProps);
      const dragged = page.getByRole("button", { name: "Reorder Alpha" });
      const other = page.getByRole("button", { name: "Reorder Charlie" });
      const [from, to] = centres(page);

      dragged.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      focus(other.element());
      await userEvent.keyboard("{Enter}");
      await expect.element(other).toHaveAttribute("aria-pressed", "false");

      dispatchListPointerEvent(page, "pointerup", to + 2);

      await tick();
    });

    it("ignores the position input of another item while dragging", async () => {
      const page = render(Component, baseProps);
      const dragged = page.getByRole("button", { name: "Reorder Alpha" });
      const input = page.getByRole("spinbutton", {
        name: "Position of Charlie",
      });
      const [from, to] = centres(page);
      const draggedOrder = [
        "Reorder Bravo",
        "Reorder Alpha",
        "Reorder Charlie",
      ];

      dragged.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).toEqual(draggedOrder);

      const node = input.element() as HTMLInputElement;
      node.value = "1";
      node.dispatchEvent(keydownEvent("Enter"));

      await expect.poll(() => handleLabels(page)).toEqual(draggedOrder);
      await expect.element(input).toHaveValue(3);

      dispatchListPointerEvent(page, "pointerup", to + 2);

      await tick();
    });

    it("ignores an Alt arrow move on another item while dragging", async () => {
      const page = render(Component, baseProps);
      const dragged = page.getByRole("button", { name: "Reorder Alpha" });
      const other = page.getByRole("button", { name: "Reorder Charlie" });
      const [from, to] = centres(page);
      const draggedOrder = [
        "Reorder Bravo",
        "Reorder Alpha",
        "Reorder Charlie",
      ];

      dragged.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).toEqual(draggedOrder);

      focus(other.element());
      other.element().dispatchEvent(keydownEvent("ArrowUp", { altKey: true }));

      await expect.poll(() => handleLabels(page)).toEqual(draggedOrder);

      dispatchListPointerEvent(page, "pointerup", to + 2);

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
      dispatchListPointerEvent(page, "pointermove", to + 2);
      dispatchListPointerEvent(page, "pointerup", to + 2);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
    });

    it("cancels an active pointer drag when disabled changes", async () => {
      const props = $state({ ...baseProps, disabled: false });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect
        .poll(() => handleLabels(page))
        .toEqual(["Reorder Bravo", "Reorder Alpha", "Reorder Charlie"]);

      props.disabled = true;

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      await expect.element(handle).toBeDisabled();
      expect(props.items.map((item) => item.name)).toEqual([
        "Alpha",
        "Bravo",
        "Charlie",
      ]);
      await tick();
    });

    it("does not resume the drag when the list is enabled again", async () => {
      const props = $state({ ...baseProps, disabled: false });
      const page = render(Component, props);
      const handle = page.getByRole("button", { name: "Reorder Alpha" });
      const [from, to] = centres(page);

      handle.element().dispatchEvent(pointerEvent("pointerdown", from));
      dispatchListPointerEvent(page, "pointermove", to + 2);
      await expect.poll(() => handleLabels(page)).not.toEqual(initialOrder);

      props.disabled = true;
      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);

      props.disabled = false;
      dispatchListPointerEvent(page, "pointermove", to + 2);
      dispatchListPointerEvent(page, "pointerup", to + 2);

      await expect.poll(() => handleLabels(page)).toEqual(initialOrder);
      expect(props.items.map((item) => item.name)).toEqual([
        "Alpha",
        "Bravo",
        "Charlie",
      ]);
      await tick();
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

function dispatchListPointerEvent(
  page: RenderResult<Component>,
  type: string,
  clientY: number,
  options?: { button?: number; pointerId?: number },
): void {
  page
    .getByRole("list")
    .element()
    .dispatchEvent(pointerEvent(type, clientY, options));
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
