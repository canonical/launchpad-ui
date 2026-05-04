import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AccordionContext } from "../../types.js";
import Component from "./Item.svelte";
import { contentText, heading, headingText } from "./test.fixtures.svelte";

let { name } = vi.hoisted(
  (): AccordionContext => ({
    name: undefined,
  }),
);

vi.mock("../../context.js", () => {
  return {
    getAccordionContext: (): AccordionContext => ({ name }),
  };
});

describe("Accordion.Item SSR", () => {
  const baseProps = {
    heading,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders a details element with a summary", () => {
      const page = render(Component, { props: { ...baseProps } });
      const details = componentLocator(page);
      expect(details).toBeInstanceOf(page.window.HTMLDetailsElement);
      const summary = details.querySelector("summary");
      expect(summary).not.toBeNull();
    });

    it("renders the heading snippet inside the summary", () => {
      const page = render(Component, { props: { ...baseProps } });
      const summary = componentLocator(page).querySelector("summary");
      expect(summary?.textContent).toContain(headingText);
    });

    it("renders a string heading inside the summary", () => {
      const page = render(Component, {
        props: { ...baseProps, heading: headingText },
      });
      const summary = componentLocator(page).querySelector("summary");
      expect(summary?.textContent).toContain(headingText);
    });

    it("renders children content", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          children: createRawSnippet(() => ({
            render: () => `<span>${contentText}</span>`,
          })),
        },
      });
      expect(page.container.textContent).toContain(contentText);
    });
  });

  describe("attributes", () => {
    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const root = componentLocator(page);
      expect(root.classList).toContain("ds");
      expect(root.classList).toContain("accordion-item");
      expect(root.classList).toContain("test-class");
    });

    it("reflects open prop to the open attribute", () => {
      const page = render(Component, { props: { ...baseProps, open: true } });
      expect(componentLocator(page).hasAttribute("open")).toBe(true);
    });

    it("is closed by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("open")).toBe(false);
    });

    it("does not set a name attribute when no Accordion ancestor exists", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("name")).toBe(false);
    });

    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("forwards %s to the details element", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });
  });

  describe("exclusive mode", () => {
    afterEach(() => {
      name = undefined;
    });

    it("gets a name attribute from the Accordion context", () => {
      name = "test-name";
      const page = render(Component, {
        props: { ...baseProps },
      });
      expect(componentLocator(page).getAttribute("name")).toBe("test-name");
    });

    it("can override the Accordion context name with a prop", () => {
      name = "test-name";
      const page = render(Component, {
        props: { ...baseProps, name: "override-name" },
      });
      expect(componentLocator(page).getAttribute("name")).toBe("override-name");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("group");
}
