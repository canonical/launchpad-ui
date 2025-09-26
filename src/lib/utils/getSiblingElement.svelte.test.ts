import { beforeEach, describe, expect, it } from "vitest";
import { getSiblingElement } from "./getSiblingElement";

describe("getSiblingElement", () => {
  let container: HTMLDivElement;

  const createButton = (id: string, className = "item", disabled = false) => {
    const btn = document.createElement("button");
    btn.id = id;
    if (className) btn.className = className;
    btn.disabled = disabled;
    return btn;
  };

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "";
  });

  it("returns next eligible element (simple next)", () => {
    const a = createButton("a");
    const b = createButton("b");
    const c = createButton("c");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a,
      selector: "button",
      direction: "next",
      wrap: false,
    });

    expect(result).toBe(b);
  });

  it("returns previous eligible element (simple previous)", () => {
    const a = createButton("a");
    const b = createButton("b");
    const c = createButton("c");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: c,
      selector: "button",
      direction: "previous",
      wrap: false,
    });

    expect(result).toBe(b);
  });

  it("returns null when wrap=false and direction is previous", () => {
    const a = createButton("a");
    const b = createButton("b");
    const c = createButton("c");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a,
      selector: "button",
      direction: "previous",
      wrap: false,
    });

    expect(result).toBeNull();
  });

  it("returns null when explicit selector matches no items", () => {
    const a = createButton("a");
    const b = createButton("b");
    container.append(a, b);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a,
      selector: ".does-not-exist",
      direction: "next",
      wrap: true,
    });

    expect(result).toBeNull();
  });

  it("returns null when current element is not in the candidate list", () => {
    const a = createButton("a", "other"); // not matching .item
    const b = createButton("b", "item");
    const c = createButton("c", "item");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a, // not part of queryAll(".item")
      selector: ".item",
      direction: "next",
      wrap: true,
    });

    expect(result).toBeNull();
  });

  it("skips disabled items", () => {
    const a = createButton("a");
    const b = createButton("b", "item", true); // disabled
    const c = createButton("c");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a,
      selector: "button",
      direction: "next",
      wrap: true,
      predicate: (el) => !el.disabled,
    });

    expect(result).toBe(c);
  });

  it("applies predicate filter and skips non-matching items", () => {
    const a = createButton("a");
    const b = createButton("b");
    const c = createButton("c");
    b.setAttribute("data-accept", "no");
    c.setAttribute("data-accept", "yes");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a,
      selector: "button",
      direction: "next",
      wrap: true,
      predicate: (el) => el.getAttribute("data-accept") === "yes",
    });

    expect(result).toBe(c);
  });

  it("wraps when wrap=true and selects from the other end", () => {
    const a = createButton("a");
    const b = createButton("b");
    const c = createButton("c");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: c,
      selector: "button",
      direction: "next",
      wrap: true,
    });

    expect(result).toBe(a);
  });

  it("returns null at boundary when wrap=false and no eligible in direction", () => {
    const a = createButton("a");
    const b = createButton("b");
    const c = createButton("c");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: c,
      selector: "button",
      direction: "next",
      wrap: false,
    });

    expect(result).toBeNull();
  });

  it("returns null when all subsequent items are ineligible (disabled/predicate)", () => {
    const a = createButton("a");
    const b = createButton("b", "item", true); // disabled
    const c = createButton("c");
    c.setAttribute("data-ok", "no");
    container.append(a, b, c);

    const result = getSiblingElement({
      containerElement: container,
      currentElement: a,
      selector: "button",
      direction: "next",
      wrap: false,
      predicate: (el) => el.getAttribute("data-ok") === "yes",
    });

    expect(result).toBeNull();
  });
});
