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

  it("returns the first element matching selector", () => {
    const a = createEl("button", "a");
    const b = createEl("button", "b");
    const c = createEl("button", "c");
    container.append(a, b, c);

    const result = getFirstElement({
      containerElement: container,
      selector: "button",
    });

    expect(result).toBe(a);
  });

  it("returns null when selector matches nothing", () => {
    const a = createEl("div", "a");
    const b = createEl("div", "b");
    container.append(a, b);

    const result = getFirstElement({
      containerElement: container,
      selector: "button",
    });

    expect(result).toBeNull();
  });

  it("applies predicate filter correctly", () => {
    const a = createEl("button", "a");
    const b = createEl("button", "b");
    const c = createEl("button", "c");
    a.classList.add("hidden");
    container.append(a, b, c);

    const result = getFirstElement<HTMLButtonElement>({
      containerElement: container,
      selector: "button",
      predicate: (btn) => !btn.classList.contains("hidden"),
    });

    expect(result).toBe(b);
  });

  it("returns null when predicate filters out all elements", () => {
    const a = createEl("button", "a");
    const b = createEl("button", "b");
    a.classList.add("hidden");
    b.classList.add("hidden");
    container.append(a, b);

    const result = getFirstElement<HTMLButtonElement>({
      containerElement: container,
      selector: "button",
      predicate: (btn) => !btn.classList.contains("hidden"),
    });

    expect(result).toBeNull();
  });
});
