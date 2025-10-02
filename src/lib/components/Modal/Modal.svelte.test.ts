/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Modal.svelte";
import type { ModalMethods } from "./types.js";

const trigger = createRawSnippet<[string | undefined, () => void]>(
  (popovertarget, open) => ({
    render: () => `<button>Open Modal</button>`,
    setup: (element) => {
      const clickHandler = open();
      element.addEventListener("click", clickHandler);

      $effect(() => {
        const popovertargetValue = popovertarget();
        if (popovertargetValue) {
          element.setAttribute("popovertarget", popovertargetValue);
        } else {
          element.removeAttribute("popovertarget");
        }
      });

      return () => {
        element.removeEventListener("click", clickHandler);
      };
    },
  }),
);

const childrenWithSnippetProps = createRawSnippet<
  [string | undefined, () => void]
>((popovertarget, close) => ({
  render: () => `<button>Button in children</button>`,
  setup: (element) => {
    const clickHandler = close();
    element.addEventListener("click", clickHandler);

    $effect(() => {
      const popovertargetValue = popovertarget();
      if (popovertargetValue) {
        element.setAttribute("popovertarget", popovertargetValue);
      } else {
        element.removeAttribute("popovertarget");
      }
    });

    return () => {
      element.removeEventListener("click", clickHandler);
    };
  },
}));

describe("Modal component", () => {
  it("renders dialog element", async () => {
    const page = render(Component);
    await expect.element(testIdLocator(page)).toBeInTheDocument();
    await expect.element(testIdLocator(page)).not.toHaveAttribute("open");
  });

  describe("Opening the Modal", () => {
    it("is opened when `showModal` on the dialog element is called", async () => {
      const page = render(Component, {
        props: {
          children: createRawSnippet(() => ({
            render: () => `<div>Body Content</div>`,
          })),
        },
      });
      (testIdLocator(page).element() as HTMLDialogElement).showModal();
      await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
      await expect.element(page.getByRole("dialog")).toBeVisible();
    });

    it("is opened by open() supplied via trigger snippet", async () => {
      const page = render(Component, {
        props: {
          trigger,
          children: createRawSnippet(() => ({
            render: () => `<div>Body Content</div>`,
          })),
        },
      });
      await expect.element(testIdLocator(page)).not.toHaveAttribute("open");

      const triggerButton = page.getByRole("button", { name: "Open Modal" });
      await triggerButton.click();
      await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
      await expect.element(page.getByRole("dialog")).toBeVisible();
    });

    it("is opened by showModal() on the component instance", async () => {
      const page = render(Component, {
        props: {
          trigger,
          children: createRawSnippet(() => ({
            render: () => `<div>Body Content</div>`,
          })),
        },
      });
      await expect.element(testIdLocator(page)).not.toHaveAttribute("open");

      const component = page.component as unknown as ModalMethods;

      component.showModal();
      await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
      await expect.element(page.getByRole("dialog")).toBeVisible();
      // Calling showModal again does nothing
      component.showModal();
      await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
      await expect.element(page.getByRole("dialog")).toBeVisible();
    });
  });

  describe("Closing the Modal", () => {
    it("is closed when `close` on the dialog element is called", async () => {
      const page = render(Component, { props: { trigger } });
      await showModal(page);
      (testIdLocator(page).element() as HTMLDialogElement).close();
      await expect
        .element(page.getByRole("dialog"))
        .not.toHaveAttribute("open");
    });

    it("is closed by close() supplied via children snippet", async () => {
      const page = render(Component, {
        props: { children: childrenWithSnippetProps },
      });
      await showModal(page);

      const closeButton = page.getByRole("button", {
        name: "Button in children",
      });
      await closeButton.click();
      await expect
        .element(page.getByRole("dialog"))
        .not.toHaveAttribute("open");
    });

    it("is closed by close() on the component instance", async () => {
      const page = render(Component, { props: { trigger } });
      await showModal(page);

      const component = page.component as unknown as ModalMethods;

      component.close();
      await expect
        .element(page.getByRole("dialog"))
        .not.toHaveAttribute("open");
      // Calling close again does nothing
      component.close();
      await expect
        .element(page.getByRole("dialog"))
        .not.toHaveAttribute("open");
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { props: { id: "test-id" } });
      await showModal(page);
      await expect
        .element(page.getByRole("dialog"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { props: { class: "test-class" } });
      await showModal(page);
      await expect.element(page.getByRole("dialog")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { props: { style: "color: red;" } });
      await showModal(page);
      await expect.element(page.getByRole("dialog")).toHaveStyle("color: red;");
    });
  });

  it("renders children", async () => {
    const page = render(Component, {
      props: {
        children: createRawSnippet(() => ({
          render: () => `<div>Body Content</div>`,
        })),
      },
    });
    await showModal(page);

    await expect
      .element(page.getByRole("dialog"))
      .toHaveTextContent("Body Content");
  });

  describe("Removal of the fallback when mounted", () => {
    it("does not have popover attribute", async () => {
      const page = render(Component);
      const dialogEl = testIdLocator(page);
      await expect.element(dialogEl).not.toHaveAttribute("popover");
    });

    it("popovertarget passed to trigger is undefined", async () => {
      const page = render(Component, { props: { trigger } });
      const triggerButton = page.getByRole("button", { name: "Open Modal" });
      await expect.element(triggerButton).not.toHaveAttribute("popovertarget");
    });

    it("popovertarget passed to children is undefined", async () => {
      const page = render(Component, {
        props: { children: childrenWithSnippetProps },
      });
      await showModal(page);
      const footerButton = page.getByRole("button", {
        name: "Button in children",
      });
      await expect.element(footerButton).not.toHaveAttribute("popovertarget");
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("modal");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function showModal(page: RenderResult<any>) {
  const dialogEl = testIdLocator(page);
  // Wait until it mounts and exits the no-JS popover fallback mode
  await expect.element(dialogEl).not.toHaveAttribute("popover");
  (dialogEl.element() as HTMLDialogElement).showModal();
}
