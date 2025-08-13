/* @canonical/generator-ds 0.10.0-experimental.0 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Group.svelte";

describe("Group component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("group")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id" });
      await expect
        .element(page.getByRole("group"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class" });
      await expect.element(page.getByRole("group")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;" });
      await expect.element(page.getByRole("group")).toHaveStyle("color: red;");
    });
  });

  describe("Group title", () => {
    it("renders the group title", async () => {
      const page = render(Component, { groupTitle: "Group Title" });
      await expect.element(page.getByText("Group Title")).toBeInTheDocument();
    });

    it("applies name to the group", async () => {
      const page = render(Component, { groupTitle: "Group Name" });
      await expect
        .element(page.getByRole("group", { name: "Group Name" }))
        .toBeInTheDocument();
    });
  });
});
