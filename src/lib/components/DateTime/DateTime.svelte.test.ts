/* @canonical/generator-ds 0.10.0-experimental.2 */

import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
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

describe("DateTime component", () => {
  it("renders", async () => {
    const page = render(Component, { date });
    await expect.element(page.getByRole("time")).toBeInTheDocument();
  });

  describe("basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", date });
      await expect
        .element(page.getByRole("time"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;", date });
      await expect.element(page.getByRole("time")).toHaveStyle("color: red;");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class", date });
      await expect.element(page.getByRole("time")).toHaveClass("test-class");
    });
  });

  describe("datetime attribute", () => {
    it("applies correct datetime attribute for Date input", async () => {
      const page = render(Component, { date });
      await expect
        .element(page.getByRole("time"))
        .toHaveAttribute("datetime", date.toISOString());
    });

    it("applies correct datetime attribute for timestamp input", async () => {
      const page = render(Component, { date: timestamp });
      await expect
        .element(page.getByRole("time"))
        .toHaveAttribute("datetime", date.toISOString());
    });

    it("applies correct datetime attribute for date string input", async () => {
      const page = render(Component, { date: dateString });
      await expect
        .element(page.getByRole("time"))
        .toHaveAttribute("datetime", date.toISOString());
    });
  });

  describe("Content", () => {
    describe("now label", () => {
      it("renders nowLabel when within nowThreshold", async () => {
        const now = Date.now();
        const page = render(Component, { date: now, nowThreshold: 999999 });
        await expect.element(page.getByRole("time")).toHaveTextContent("now");
      });

      it("does not render nowLabel when outside nowThreshold", async () => {
        const now = Date.now();
        const page = render(Component, {
          date: now - 1000,
          nowThreshold: 10,
        });
        await expect
          .element(page.getByRole("time"))
          .not.toHaveTextContent("now");
      });

      it("renders custom nowLabel when within nowThreshold", async () => {
        const now = Date.now();
        const page = render(Component, {
          date: now,
          nowThreshold: 999999,
          nowLabel: "just now",
        });
        await expect
          .element(page.getByRole("time"))
          .toHaveTextContent("just now");
      });
    });

    describe("Relative time", () => {
      it("renders relative time when outside nowThreshold", async () => {
        const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 3); // 3 hours ago
        const page = render(Component, { date: pastDate, nowThreshold: 0 });

        await expect
          .element(page.getByRole("time"))
          .toHaveTextContent("3 hours ago");
      });

      it("updates over time", async () => {
        vi.useFakeTimers();
        const pastDate = new Date(Date.now() - 1000 * 60 * 3); // 3 minutes ago
        const page = render(Component, { date: pastDate, nowThreshold: 0 });

        await expect
          .element(page.getByRole("time"))
          .toHaveTextContent("3 minutes ago");

        vi.advanceTimersByTime(1000 * 60);
        await expect
          .element(page.getByRole("time"))
          .toHaveTextContent("4 minutes ago");

        vi.advanceTimersByTime(1000 * 60 * 60);
        await expect
          .element(page.getByRole("time"))
          .toHaveTextContent("1 hour ago");

        vi.useRealTimers();
      });
    });

    describe("Absolute time", () => {
      it("renders absolute time when absolute is true", async () => {
        const page = render(Component, { date, absolute: true });
        await expect
          .element(page.getByRole("time"))
          .toHaveTextContent("1/1/24, 12:00 PM");
      });
    });
  });

  describe("title attribute", () => {
    it("applies formatted date as title for relative time", async () => {
      const page = render(Component, { date });
      await expect
        .element(page.getByRole("time"))
        .toHaveAttribute("title", "1/1/24, 12:00 PM");
    });

    it("does not apply title for absolute time", async () => {
      const page = render(Component, { date, absolute: true });
      await expect.element(page.getByRole("time")).not.toHaveAttribute("title");
    });
  });
});
