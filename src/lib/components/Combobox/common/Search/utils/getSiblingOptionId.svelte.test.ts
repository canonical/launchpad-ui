import { describe, expect, it } from "vitest";
import { getSiblingOptionId } from "./getSiblingOptionId";

describe("getSiblingOptionId", () => {
  const listBoxElement = document.createElement("div");
  listBoxElement.innerHTML = `
    <div class='ds combobox-option' id='option1'>Option 1</div>
    <div class='ds combobox-option' id='option2'>Option 2</div>
    <div class='ds combobox-option' id='option3'>Option 3</div>
  `;

  it("should return the ID of the next sibling option", () => {
    const result = getSiblingOptionId(listBoxElement, "option1", "next");
    expect(result).toBe("option2");
  });

  it("should return the ID of the previous sibling option", () => {
    const result = getSiblingOptionId(listBoxElement, "option2", "previous");
    expect(result).toBe("option1");
  });

  it("should return the first option ID when no option is selected and direction is next", () => {
    const result = getSiblingOptionId(listBoxElement, null, "next");
    expect(result).toBe("option1");
  });

  it("should return the last option ID when no option is selected and direction is previous", () => {
    const result = getSiblingOptionId(listBoxElement, null, "previous");
    expect(result).toBe("option3");
  });

  it("should return the same option ID when at the end and direction is next", () => {
    const result = getSiblingOptionId(listBoxElement, "option3", "next");
    expect(result).toBe("option3");
  });

  it("should return the same option ID when at the start and direction is previous", () => {
    const result = getSiblingOptionId(listBoxElement, "option1", "previous");
    expect(result).toBe("option1");
  });

  it("should return the first option ID when the current option ID does not exist and direction is next", () => {
    const result = getSiblingOptionId(listBoxElement, "nonexistent", "next");
    expect(result).toBe("option1");
  });

  it("should return the last option ID when the current option ID does not exist and direction is previous", () => {
    const result = getSiblingOptionId(
      listBoxElement,
      "nonexistent",
      "previous",
    );
    expect(result).toBe("option3");
  });

  it("should return null if there are no options", () => {
    listBoxElement.innerHTML = "";
    const result = getSiblingOptionId(listBoxElement, "option1", "next");
    expect(result).toBeNull();
  });
});
