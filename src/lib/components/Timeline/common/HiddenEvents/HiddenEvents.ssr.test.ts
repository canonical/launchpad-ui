/* @canonical/generator-ds 0.10.0-experimental.2 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./HiddenEvents.svelte";

describe("HiddenEvents SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { numHidden: 888 } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { numHidden: 888 } });
    expect(body).toContain("<li");
    expect(body).toContain("</li>");
    expect(body).toContain("888");
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id", numHidden: 0 },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: {
          class: "test-class",
          numHidden: 0,
        },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: {
          style: "color: red;",
          numHidden: 0,
        },
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Links", () => {
    it("renders show more", () => {
      const { body } = render(Component, {
        props: { numHidden: 888, showMoreHref: "/show-more" },
      });
      expect(body).toContain("Show more");
      expect(body).toContain('href="/show-more"');
    });

    it("renders show all", () => {
      const { body } = render(Component, {
        props: { numHidden: 888, showAllHref: "/show-all" },
      });
      expect(body).toContain("Show all");
      expect(body).toContain('href="/show-all"');
    });
  });
});
