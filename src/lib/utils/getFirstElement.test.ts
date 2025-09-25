import { beforeEach, describe, expect, it } from "vitest";
import { getFirstElement } from "./getFirstElement";

describe("getFirstElement", () => {
  let container: HTMLDivElement;

  const createEl = (tag = "button", id?: string, className?: string) => {
    const el = document.createElement(tag);
    if (id) el.id = id;
    if (className) el.className = className;
    return el;
  };

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "";
  });

  it("returns preferredChild when it is contained in containerElement", () => {
    const a = createEl("button", "a");
    const b = createEl("span", "b");
    const c = createEl("button", "c");
    container.append(a, b, c);

    const result = getFirstElement({
      containerElement: container,
      preferredChild: b as HTMLElement,
      selector: "button",
    });

    expect(result).toBe(b);
  });

  it("falls back to first matching element when preferredChild is not contained", () => {
    const a = createEl("button", "a");
    const b = createEl("button", "b");
    container.append(a, b);

    const externalPreferred = createEl("button", "x");

    const result = getFirstElement({
      containerElement: container,
      preferredChild: externalPreferred as HTMLElement,
      selector: "button",
    });

    expect(result).toBe(a);
  });

  it("returns null when selector matches nothing and preferredChild is not contained", () => {
    const a = createEl("div", "a");
    const b = createEl("div", "b");
    container.append(a, b);

    const externalPreferred = createEl("button", "x");

    const result = getFirstElement({
      containerElement: container,
      preferredChild: externalPreferred as HTMLElement,
      selector: "button",
    });

    expect(result).toBeNull();
  });

  it("returns the first element matching selector", () => {
    const a = createEl("button", "a");
    const b = createEl("button", "b");
    const c = createEl("button", "c");
    container.append(a, b, c);

    const externalPreferred = createEl("button", "x");

    const result = getFirstElement({
      containerElement: container,
      preferredChild: externalPreferred as HTMLElement,
      selector: "button",
    });

    expect(result).toBe(a);
  });

  it("returns preferredChild even if it does not match selector", () => {
    const a = createEl("button", "a");
    const b = createEl("span", "b");
    container.append(a, b);

    const result = getFirstElement({
      containerElement: container,
      preferredChild: b as HTMLElement,
      selector: "button",
    });

    expect(result).toBe(b);
  });
});
