import { describe, expect, it } from "vitest";
import { getSiblingActionElement } from "./getSiblingActionElement";

describe("getSiblingActionElement", () => {
  const makeToolbar = () => {
    const toolbar = document.createElement("div");
    const btn1 = document.createElement("button");
    btn1.textContent = "btn1";
    const btn2 = document.createElement("button");
    btn2.textContent = "btn2";
    const btn3 = document.createElement("button");
    btn3.textContent = "btn3";
    toolbar.append(btn1, btn2, btn3);
    return { toolbar, btn1, btn2, btn3 } as const;
  };

  const makeKeyEvent = (
    key: "ArrowLeft" | "ArrowRight",
    target: EventTarget,
  ) => {
    const event = new KeyboardEvent("keydown", { key });
    Object.defineProperty(event, "target", { value: target });
    return event;
  };

  it("returns next button on ArrowRight", () => {
    const { toolbar, btn1, btn2 } = makeToolbar();
    const event = makeKeyEvent("ArrowRight", btn1);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBe(btn2);
  });

  it("returns previous button on ArrowLeft", () => {
    const { toolbar, btn1, btn2 } = makeToolbar();
    const event = makeKeyEvent("ArrowLeft", btn2);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBe(btn1);
  });

  it("wraps to first on ArrowRight from last", () => {
    const { toolbar, btn1, btn3 } = makeToolbar();
    const event = makeKeyEvent("ArrowRight", btn3);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBe(btn1);
  });

  it("wraps to last on ArrowLeft from first", () => {
    const { toolbar, btn1, btn3 } = makeToolbar();
    const event = makeKeyEvent("ArrowLeft", btn1);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBe(btn3);
  });

  it("falls back to first for ArrowRight when target not in toolbar", () => {
    const { toolbar, btn1 } = makeToolbar();
    const external = document.createElement("button");
    const event = makeKeyEvent("ArrowRight", external);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBe(btn1);
  });

  it("falls back to last for ArrowLeft when target not in toolbar", () => {
    const { toolbar, btn3 } = makeToolbar();
    const external = document.createElement("button");
    const event = makeKeyEvent("ArrowLeft", external);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBe(btn3);
  });

  it("returns null when toolbar has no buttons", () => {
    const toolbar = document.createElement("div");
    const external = document.createElement("button");
    const event = makeKeyEvent("ArrowRight", external);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBeNull();
  });

  it("returns null when event target is not a button", () => {
    const { toolbar } = makeToolbar();
    const nonButton = document.createElement("div");
    const event = makeKeyEvent("ArrowRight", nonButton);
    const result = getSiblingActionElement(toolbar as HTMLDivElement, event);
    expect(result).toBeNull();
  });
});
