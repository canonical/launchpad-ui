import { Linter } from "eslint";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";
import { describe, expect, it } from "vitest";
import requireTodoJiraUrl from "../../eslint-rules/require-todo-jira-url.js";

const jiraUrl = "https://warthogs.atlassian.net/browse/LP-5078";
const linter = new Linter();
const config: Linter.Config[] = [
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: { parser: ts.parser },
  },
  ...svelte.configs["flat/base"],
  {
    files: ["**/*.js", "**/*.ts", "**/*.svelte"],
    languageOptions: { parserOptions: { parser: ts.parser } },
    plugins: {
      local: { rules: { "require-todo-jira-url": requireTodoJiraUrl } },
    },
    rules: { "local/require-todo-jira-url": "error" },
  },
];

describe("require-todo-jira-url checks that every TODO has a Jira URL", () => {
  describe("Allows different formats with a correct Jira URL", () => {
    it("accepts a parenthesized URL in a line comment", () => {
      expect(lint(`// TODO: Remove workaround (${jiraUrl})`)).toEqual([]);
    });

    it("accepts an owner-tagged block comment with trailing punctuation", () => {
      expect(lint(`/* TODO(DAL): Remove workaround ${jiraUrl}. */`)).toEqual(
        [],
      );
    });

    it("accepts a JSDoc link on a later line of the same comment", () => {
      expect(
        lint(`/** TODO: Remove workaround.\n * See {@link ${jiraUrl}}.\n */`),
      ).toEqual([]);
    });

    it("accepts a lowercase TODO with a Markdown link", () => {
      expect(lint(`// todo: Remove workaround [ticket](${jiraUrl})`)).toEqual(
        [],
      );
    });

    it("accepts a URL wrapped in backticks", () => {
      expect(lint(`// TODO: See \`${jiraUrl}\``)).toEqual([]);
    });
  });

  describe("Requires a Jira URL in the TODO comment itself", () => {
    it("rejects a TODO without a link", () => {
      expect(lint("// TODO: Remove workaround")).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects a bare Jira issue key without its URL", () => {
      expect(lint("// TODO(LP-5078): Remove workaround")).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects a lowercase owner-tagged TODO without a link", () => {
      expect(lint("// todo(@Enzo): Remove workaround")).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("does not use a URL from a different comment", () => {
      expect(
        lint(`// See ${jiraUrl}\n// TODO: Remove workaround`),
      ).toMatchObject([{ messageId: "missingUrl", line: 2 }]);
    });
  });

  describe("Rejects malformed or unrelated Jira URLs", () => {
    it("rejects HTTP instead of HTTPS", () => {
      expect(
        lint("// TODO: http://warthogs.atlassian.net/browse/LP-5078"),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects a link to another Jira site", () => {
      expect(
        lint("// TODO: https://other.atlassian.net/browse/LP-5078"),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects an issue from another Jira project", () => {
      expect(
        lint("// TODO: https://warthogs.atlassian.net/browse/OTHER-5078"),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects an issue key without a number", () => {
      expect(
        lint("// TODO: https://warthogs.atlassian.net/browse/LP-"),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects an issue number with a nonnumeric suffix", () => {
      expect(
        lint("// TODO: https://warthogs.atlassian.net/browse/LP-5078extra"),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects an additional path after the issue number", () => {
      expect(
        lint("// TODO: https://warthogs.atlassian.net/browse/LP-5078/extra"),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });

    it("rejects a Jira URL embedded in another URL's query string", () => {
      expect(
        lint(`// TODO: https://example.com/?target=${jiraUrl}`),
      ).toMatchObject([
        { ruleId: "local/require-todo-jira-url", messageId: "missingUrl" },
      ]);
    });
  });

  describe("Checks comments across JavaScript, TypeScript, and Svelte", () => {
    it("rejects an unlinked TODO in a JavaScript file", () => {
      expect(lint("// TODO: Remove workaround", "example.js")).toMatchObject([
        { messageId: "missingUrl" },
      ]);
    });

    it("rejects an unlinked TODO in a TypeScript file", () => {
      expect(lint("// TODO: Remove workaround", "example.ts")).toMatchObject([
        { messageId: "missingUrl" },
      ]);
    });

    it("rejects an unlinked TODO in a Svelte TypeScript module", () => {
      expect(
        lint("// TODO: Remove workaround", "example.svelte.ts"),
      ).toMatchObject([{ messageId: "missingUrl" }]);
    });

    it("rejects an unlinked TODO in a Svelte script block", () => {
      expect(
        lint(
          '<script lang="ts">\n// TODO: Remove workaround\n</script>',
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 2 }]);
    });

    it("accepts a linked TODO in a Svelte script block", () => {
      expect(
        lint(
          `<script lang="ts">\n// TODO: Remove workaround (${jiraUrl})\n</script>`,
          "example.svelte",
        ),
      ).toEqual([]);
    });

    it("rejects an unlinked TODO in a Svelte markup comment", () => {
      expect(
        lint("<div />\n<!-- TODO: Remove workaround -->", "example.svelte"),
      ).toMatchObject([{ messageId: "missingUrl", line: 2 }]);
    });

    it("accepts a linked TODO in a Svelte markup comment", () => {
      expect(
        lint(
          `<div />\n<!-- TODO: Remove workaround (${jiraUrl}) -->`,
          "example.svelte",
        ),
      ).toEqual([]);
    });

    it("rejects an unlinked TODO in a Svelte style block", () => {
      expect(
        lint(
          "<style>\n/* TODO: Remove workaround */\n</style>",
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 2 }]);
    });

    it("accepts a linked TODO in a Svelte style block", () => {
      expect(
        lint(
          `<style>\n/* TODO: Remove workaround (${jiraUrl}) */\n</style>`,
          "example.svelte",
        ),
      ).toEqual([]);
    });
  });

  describe("Keeps CSS exceptions limited to the intended next line", () => {
    it("allows a rule-specific CSS suppression beside a legacy TODO", () => {
      expect(
        lint(
          `<style>
  /* eslint-disable-next-line local/require-todo-jira-url -- Legacy TODO; Jira ticket pending. */
  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toEqual([]);
    });

    it("still reports later TODOs in the same style block", () => {
      expect(
        lint(
          `<style>
  /* eslint-disable-next-line local/require-todo-jira-url */
  /* TODO: Remove workaround */
  /* TODO: New work */
</style>`,
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 4 }]);
    });

    it("does not extend a suppression across a blank line", () => {
      expect(
        lint(
          `<style>
  /* eslint-disable-next-line local/require-todo-jira-url */

  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 4 }]);
    });

    it("does not match a rule name mentioned only in the justification", () => {
      expect(
        lint(
          `<style>
  /* eslint-disable-next-line no-console -- Not local/require-todo-jira-url */
  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 3 }]);
    });

    it("recognizes the rule in a comma-separated suppression list", () => {
      expect(
        lint(
          `<style>
  /* eslint-disable-next-line no-console, local/require-todo-jira-url -- Legacy debt */
  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toEqual([]);
    });

    it("targets the line after a multiline directive ends", () => {
      expect(
        lint(
          `<style>
  /* eslint-disable-next-line
     local/require-todo-jira-url
  */
  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toEqual([]);
    });

    it("does not interpret CSS strings as suppression comments", () => {
      expect(
        lint(
          `<style>
  p::after { content: "/* eslint-disable-next-line local/require-todo-jira-url */"; }
  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 3 }]);
    });

    it("does not interpret explanatory prose as a directive", () => {
      expect(
        lint(
          `<style>
  /* Use eslint-disable-next-line local/require-todo-jira-url for legacy debt. */
  /* TODO: Remove workaround */
</style>`,
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "missingUrl", line: 3 }]);
    });
  });

  describe("Ignores text that is not a TODO comment", () => {
    it("ignores TODO as part of an identifier mentioned in a comment", () => {
      expect(
        lint("// The todoItems collection is populated on demand."),
      ).toEqual([]);
    });

    it("ignores references to todo lists in prose", () => {
      expect(lint("/** Supports unordered lists and todo lists. */")).toEqual(
        [],
      );
    });

    it("ignores a TODO marker inside a JavaScript string", () => {
      expect(lint('const label = "TODO: not a comment";')).toEqual([]);
    });

    it("ignores TODO-like text outside Svelte comments", () => {
      expect(
        lint(
          '<p title="TODO">TODO</p><style>p::after { content: "/* TODO */"; }</style>',
          "example.svelte",
        ),
      ).toEqual([]);
    });
  });

  describe("Reports when a style block cannot be checked", () => {
    it("reports an unsupported style language", () => {
      expect(
        lint(
          '<style lang="unknown">/* TODO: Remove workaround */</style>',
          "example.svelte",
        ),
      ).toMatchObject([{ messageId: "unparsedStyle" }]);
    });
  });
});

function lint(code: string, filename = "example.ts") {
  return linter.verify(code, config, { filename });
}
