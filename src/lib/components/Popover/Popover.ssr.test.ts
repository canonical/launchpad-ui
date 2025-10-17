/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { assert, describe, expect, it } from "vitest";
import Component from "./Popover.svelte";
import type { PopoverTriggerProps } from "./types.js";

const trigger = createRawSnippet<[PopoverTriggerProps, boolean]>(
  (triggerProps, open) => ({
    render: () =>
      `<button popovertarget="${triggerProps().popovertarget}">${open() ? "Close Popover" : "Open Popover"}</button>`,
  }),
);

const children = createRawSnippet(() => ({
  render: () => `<div>This is content of the popover.</div>`,
}));

describe("Popover SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { trigger, children } });
    }).not.toThrow();
  });

  it("renders trigger", () => {
    const { body } = render(Component, { props: { trigger, children } });
    expect(body).toContain('<button popovertarget="');
    expect(body).toContain("Open Popover");
  });

  it("renders content", () => {
    const { body } = render(Component, { props: { trigger, children } });
    expect(body).toContain("<div>This is content of the popover.</div>");
  });

  it("properly links trigger with content", () => {
    const { body } = render(Component, { props: { trigger, children } });
    const popoverId = body.match(/id="([^"]*)"/)?.[1];
    assert(popoverId !== undefined);
    expect(body).toContain(`popovertarget="${popoverId}"`);
  });
});
