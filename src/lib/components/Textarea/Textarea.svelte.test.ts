/* @canonical/generator-ds 0.10.0-experimental.3 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Textarea.svelte";
import type { TextareaProps } from "./types";

describe("Textarea component", () => {
  it("renders", async () => {
    const page = render(Component, { value: "Textarea" });
    const element = page.getByRole("textbox");
    await expect.element(element).toBeInTheDocument();
    await expect.element(element).toHaveValue("Textarea");
  });

  it("applies class", async () => {
    const page = render(Component, { value: "Textarea", class: "test-class" });
    const element = page.getByRole("textbox");
    await expect.element(element).toHaveClass("test-class");
  });

  describe("rows", () => {
    it("applies static rows when rows is a number", async () => {
      const props = $state({
        value: "Textarea",
        rows: 3,
      }) satisfies TextareaProps;
      const page = render(Component, props);
      const element = page.getByRole("textbox");
      await expect.element(element).toHaveAttribute("rows", "3");
      props.value = "Textarea\nTextarea\nTextarea\nTextarea\nTextarea";
      await expect.element(element).toHaveAttribute("rows", "3");
    });

    it("applies the min rows when value is empty", async () => {
      const props = $state({
        value: "",
        rows: 3,
      }) satisfies TextareaProps;
      const page = render(Component, props);
      const element = page.getByRole("textbox");
      await expect.element(element).toHaveAttribute("rows", "3");
    });

    it("applies dynamic rows when rows is a tuple", async () => {
      const props = $state({
        value: "Textarea",
        rows: [2, 5],
      }) satisfies TextareaProps;
      const page = render(Component, props);
      const element = page.getByRole("textbox");
      await expect.element(element).toHaveAttribute("rows", "2");
      props.value =
        "Textarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea";
      await expect.element(element).toHaveAttribute("rows", "5");
      props.value = "Textarea";
      await expect.element(element).toHaveAttribute("rows", "2");
    });

    it("rows grow and shrink dynamically", async () => {
      const props = $state({
        value: "Textarea",
        rows: [2, 5],
      }) satisfies TextareaProps;
      const page = render(Component, props);
      const element = page.getByRole("textbox");
      await expect.element(element).toHaveAttribute("rows", "2");
      const longText =
        "Textarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea\nTextarea";
      props.value = longText;
      await expect.element(element).toHaveAttribute("rows", "5");
      props.value = "Textarea";
      await expect.element(element).toHaveAttribute("rows", "2");
    });
  });
});
