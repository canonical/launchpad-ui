import { describe, expect, it } from "vitest";
import { stripAnsi } from "./stripAnsi";

describe("stripAnsi", () => {
  it("removes common SGR color codes", () => {
    expect(stripAnsi("\u001b[31mred\u001b[0m")).toBe("red");
    expect(stripAnsi("before \u001b[1;32mgreen\u001b[0m after")).toBe(
      "before green after",
    );
  });

  it("removes CSI control sequences", () => {
    expect(stripAnsi("\u001b[2Kline\u001b[1Aup")).toBe("lineup");
    expect(stripAnsi("hide\u001b[?25lshow\u001b[?25h")).toBe("hideshow");
  });

  it("removes OSC sequences terminated by BEL", () => {
    expect(stripAnsi("\u001b]0;my title\u0007hello")).toBe("hello");
  });

  it("removes OSC sequences terminated by ESC\\", () => {
    expect(stripAnsi("\u001b]0;my title\u001b\\hello")).toBe("hello");
  });

  it("removes OSC sequences terminated by ST (0x9c)", () => {
    expect(stripAnsi("\u001b]0;my title\u009chello")).toBe("hello");
  });

  it("leaves plain text untouched", () => {
    expect(stripAnsi("[31m not ansi")).toBe("[31m not ansi");
    expect(stripAnsi("hello world")).toBe("hello world");
  });
});
