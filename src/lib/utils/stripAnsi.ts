// Sourced from: https://github.com/chalk/ansi-regex/blob/main/index.js

// Valid string terminator sequences are BEL, ESC\, and 0x9c
const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
// OSC sequences only: ESC ] ... ST (non-greedy until the first ST)
const osc = `(?:\\u001B\\][\\s\\S]*?${ST})`;
// CSI and related: ESC/C1, optional intermediates, optional params (supports ; and :) then final byte
const csi =
  "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";

const ansiRegex = new RegExp(`${osc}|${csi}`, "g");

/**
 * Removes ANSI escape codes from a string.
 * @param input The string potentially containing ANSI codes.
 * @returns The input string with ANSI codes removed.
 */
export function stripAnsi(input: string): string {
  return input.replace(ansiRegex, "");
}
