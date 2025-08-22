/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Modal.svelte";

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

const header = createRawSnippet(() => ({
  render: () => `<span>Header Content</span>`,
}));

const children = createRawSnippet(() => ({
  render: () => `<div>Body Content</div>`,
}));

const footer = createRawSnippet<[string | undefined, () => void]>(
  (popovertarget, close) => ({
    render: () => `<button>Footer Action</button>`,
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
  }),
);

describe("Modal component", () => {
  it("renders dialog element", async () => {
    const page = render(Component);
    await expect.element(testIdLocator(page)).toBeInTheDocument();
    await expect.element(testIdLocator(page)).not.toHaveAttribute("open");
  });

  describe("Opening the Modal", () => {
    it("is opened when `showModal` on the dialog element is called", async () => {
      const page = render(Component, { props: { trigger } });
      (testIdLocator(page).element() as HTMLDialogElement).showModal();
      await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
      await expect.element(page.getByRole("dialog")).toBeVisible();
    });

    it("is opened by open() supplied via trigger snippet", async () => {
      const page = render(Component, { props: { trigger } });
      await expect.element(testIdLocator(page)).not.toHaveAttribute("open");

      const triggerButton = page.getByRole("button", { name: "Open Modal" });
      await triggerButton.click();
      await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
      await expect.element(page.getByRole("dialog")).toBeVisible();
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

  describe("Content", () => {
    it("renders header, children, and footer when provided", async () => {
      const page = render(Component, { props: { header, children, footer } });
      await showModal(page);

      await expect
        .element(page.getByRole("dialog"))
        .toHaveTextContent("Header Content");
      await expect
        .element(page.getByRole("dialog"))
        .toHaveTextContent("Body Content");
      await expect
        .element(page.getByRole("dialog"))
        .toHaveTextContent("Footer Action");
    });
  });

  describe("Close button", () => {
    it("shows close button by default", async () => {
      const page = render(Component);
      await showModal(page);
      await expect
        .element(page.getByRole("button", { name: "Close" }))
        .toBeInTheDocument();
    });

    it("can hide close button", async () => {
      const page = render(Component, { props: { withCloseButton: false } });
      await showModal(page);
      await expect.element(page.getByRole("dialog")).toBeVisible();
      await expect
        .element(page.getByRole("button", { name: "Close" }))
        .not.toBeInTheDocument();
    });

    it("closes the modal when clicked", async () => {
      const page = render(Component);
      await showModal(page);
      const closeButton = page.getByRole("button", { name: "Close" });
      await closeButton.click();
      await expect
        .element(page.getByRole("dialog"))
        .not.toHaveAttribute("open");
    });
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

    it("popovertarget passed to footer is undefined", async () => {
      const page = render(Component, { props: { footer } });
      await showModal(page);
      const footerButton = page.getByRole("button", { name: "Footer Action" });
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
