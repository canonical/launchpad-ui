import { describe, expect, it, onTestFinished } from "vitest";
import { minTrimmedLength } from "./minTrimmedLength";

function submits(min: number, value: string): boolean {
  const form = document.createElement("form");
  const input = document.createElement("input");
  Object.assign(input, { name: "q", ...minTrimmedLength(min) });
  form.append(input);
  document.body.append(form);
  onTestFinished(() => form.remove());

  let submitted = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
  });
  input.value = value;
  form.requestSubmit();
  return submitted;
}

describe("minTrimmedLength", () => {
  it.each([1, 2, 3, 5])(
    "lets a form submit only when the trimmed value has at least %i characters",
    (min) => {
      for (const value of [
        "a",
        " a ",
        "ab",
        "  ab  ",
        "a b",
        " a  b ",
        "abc",
        "\tabc\t",
        "abcde",
        "  abcd  ",
        "     ",
      ]) {
        expect(submits(min, value), JSON.stringify(value)).toBe(
          value.trim().length >= min,
        );
      }
    },
  );

  it.each([
    [1, "Enter at least 1 character"],
    [3, "Enter at least 3 characters"],
  ])("describes the requirement for %i", (min, title) => {
    expect(minTrimmedLength(min).title).toBe(title);
  });
});
