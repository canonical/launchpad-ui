import { strCodec, superhref } from "@canonical/superhref";
import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { Component, ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { QueryParamsFormProps } from "$lib/components/index.js";
import SidePanel from "./SidePanel.svelte";

vi.mock("$app/state", () => ({
  page: {
    url: new URL(
      "https://launchpad.test/ubuntu/+source?panel=views&sort=series",
    ),
  },
}));

const codecs = { panel: strCodec(), sort: strCodec() };
const schema = superhref(codecs);
const Panel = SidePanel as Component<
  Omit<ComponentProps<typeof SidePanel>, "closeForm"> & {
    closeForm?: Pick<
      QueryParamsFormProps<typeof codecs>,
      "schema" | "replaceParams"
    >;
  }
>;

describe("SidePanel SSR", () => {
  it("closes through a GET form that clears the panel params and keeps the rest", () => {
    const screen = render(Panel, {
      props: {
        open: true,
        title: "Views",
        closeForm: { schema, replaceParams: ["panel"] },
        children: createRawSnippet(() => ({ render: () => "<p>Body</p>" })),
      },
    });
    const form = screen.document.querySelector("form");
    if (form === null) throw new Error("The component rendered no form");
    const closeButton = screen.getByRole("button", { name: "Close" });

    expect(form.method).toBe("get");
    expect(closeButton.getAttribute("type")).toBe("submit");
    expect(closeButton.getAttribute("form")).toBe(form.id);
    expect(Array.from(new screen.window.FormData(form))).toEqual([
      ["sort", "series"],
    ]);
  });

  it("renders no close form without closeForm", () => {
    const screen = render(Panel, {
      props: {
        open: true,
        children: createRawSnippet(() => ({ render: () => "<p>Body</p>" })),
      },
    });

    expect(screen.document.querySelector("form")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Close" }).getAttribute("type"),
    ).toBe("button");
  });
});
