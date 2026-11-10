/**
 * @fileoverview ESLint rule to require Jira URLs in TODO comments.
 * Tiger Tier injection.
 */
const todoPattern = /^\s*\*?\s*TODO\b/imu;
const jiraUrlPattern =
  /(?:^|[\s([{<"'`])https:\/\/warthogs\.atlassian\.net\/browse\/LP-\d+(?=$|[\s)\]}>"'`]|[.,;:!?](?=\s|$))/u;

/** @type {import("eslint").Rule.RuleModule} */
const requireTodoJiraUrl = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      missingUrl:
        "TODO comments must include a Jira URL: https://warthogs.atlassian.net/browse/LP-<number>.",
      unparsedStyle:
        "Cannot check TODO comments in this style block: {{status}}.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          checkComment(comment.value, comment.loc);
        }
      },
      /** @param {import("svelte-eslint-parser").AST.SvelteHTMLComment} node */
      SvelteHTMLComment(node) {
        checkComment(node.value, node.loc);
      },
      /** @param {import("svelte-eslint-parser").AST.SvelteStyleElement} node */
      SvelteStyleElement(node) {
        const services = sourceCode.parserServices;
        /** @type {import("svelte-eslint-parser").StyleContext} */
        const styleContext = services.getStyleContext();
        if (styleContext.status !== "success") {
          context.report({
            loc: node.loc,
            messageId: "unparsedStyle",
            data: { status: styleContext.status },
          });
          return;
        }

        /** @type {Set<number>} */
        const suppressedLines = new Set();
        styleContext.sourceAst.walkComments((comment) => {
          if (!suppressesNextLine(comment.text, context.id)) return;
          const loc = services.styleNodeLoc(comment);
          if (!loc.end) {
            throw new Error(
              "Cannot read a CSS suppression without its source location.",
            );
          }
          suppressedLines.add(loc.end.line + 1);
        });

        styleContext.sourceAst.walkComments((comment) => {
          const loc = services.styleNodeLoc(comment);
          if (loc.start && suppressedLines.has(loc.start.line)) return;
          checkComment(comment.text, loc);
        });
      },
    };

    /**
     * @param {string} value
     * @param {Partial<import("eslint").AST.SourceLocation> | null | undefined} loc
     */
    function checkComment(value, loc) {
      if (todoPattern.test(value) && !jiraUrlPattern.test(value)) {
        if (!loc?.start) {
          throw new Error(
            "Cannot report a TODO comment without its source location.",
          );
        }
        context.report({ loc: loc.start, messageId: "missingUrl" });
      }
    }
  },
};

export default requireTodoJiraUrl;

/**
 * @param {string} value
 * @param {string} ruleId
 */
function suppressesNextLine(value, ruleId) {
  const [directive] = value.split(/\s-{2,}\s/u, 1);
  const match = /^\s*eslint-disable-next-line(?:\s+|$)([\s\S]*)$/u.exec(
    directive,
  );
  return match !== null && match[1].split(/[\s,]+/u).includes(ruleId);
}
