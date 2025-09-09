/* @canonical/generator-ds 0.10.0-experimental.2 */

import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";
import Component from "./DateTime.svelte";

vi.mock("./utils/formatters.js", () => {
  return {
    dateTimeFormatter: new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "UTC",
    }),
    relativeTimeFormatter: new Intl.RelativeTimeFormat("en-US", {
      numeric: "auto",
      style: "long",
    }),
  };
});

const date = new Date("2024-01-01T12:00:00Z");
const timestamp = date.getTime();
const dateString = date.toISOString();

describe("DateTime SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { date } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { date } });
    expect(body).toContain("<time");
    expect(body).toContain("</time>");
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id", date },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;", date },
      });
      expect(body).toMatch(/style="[^"]*color: red;[^"]*"/);
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class", date },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });
  });

  describe("datetime attribute", () => {
    it("applies correct datetime attribute for Date input", () => {
      const { body } = render(Component, { props: { date } });

      expect(body).toContain(`datetime="${date.toISOString()}"`);
    });

    it("applies correct datetime attribute for timestamp input", () => {
      const { body } = render(Component, { props: { date: timestamp } });

      expect(body).toContain(`datetime="${date.toISOString()}"`);
    });

    it("applies correct datetime attribute for date string input", () => {
      const { body } = render(Component, { props: { date: dateString } });

      expect(body).toContain(`datetime="${date.toISOString()}"`);
    });
  });

  describe("Content", () => {
    describe("now label for relative time", () => {
      it("renders nowLabel when within nowThreshold", () => {
        const now = Date.now();
        const { body } = render(Component, {
          props: { date: now, nowThreshold: 999999 },
        });
        expect(body).toContain("now");
      });

      it("does not render nowLabel when outside nowThreshold", () => {
        const now = Date.now();
        const { body } = render(Component, {
          props: { date: now - 1000, nowThreshold: 10 },
        });
        expect(body).not.toContain("now");
      });

      it("renders custom nowLabel when within nowThreshold", () => {
        const now = Date.now();
        const { body } = render(Component, {
          props: { date: now, nowThreshold: 999999, nowLabel: "just now" },
        });
        expect(body).toContain("just now");
      });
    });

    describe("Relative time", () => {
      it("renders relative time when outside nowThreshold", () => {
        const now = Date.now();
        const pastDate = new Date(now - 1000 * 60 * 60 * 3); // 3 hours ago
        const { body } = render(Component, {
          props: { date: pastDate, nowThreshold: 0 },
        });

        expect(body).toContain("3 hours ago");
      });
    });

    describe("Absolute time", () => {
      it("renders absolute time when absolute is true", () => {
        const { body } = render(Component, {
          props: { date, absolute: true },
        });

        expect(body).toContain("1/1/24, 12:00 PM");
      });
    });
  });

  describe("title attribute", () => {
    it("applies formatted date as title for relative time", () => {
      const { body } = render(Component, {
        props: { date },
      });
      expect(body).toContain("1/1/24, 12:00 PM");
    });

    it("does not apply title for absolute time", () => {
      const { body } = render(Component, {
        props: { date, absolute: true },
      });
      expect(body).not.toContain("title=");
    });
  });
});
