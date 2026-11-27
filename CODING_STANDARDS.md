# Coding standards

## Goal

This document is created to achieve a clean and consistent codebase that is easy to understand and maintain. We communicate expectations upfront to have less friction during code reviews.

## Simple rules

Are encoded as linting rules and will not be repeated here. Follow the linter.

### What if something is not in linting rules?

Then it should be added. If you see a code like `const a = new Array` and you think for yourself "wait a minute, we should use literals not array constructor" then it is a good candidate to be added as a linting rule. Start a discussion. There are 3 outcomes, each landing as a rule:

1. Team agrees. You add a rule forbidding it.
2. Teams dissagrees. You add a rule enforcing it.
3. Team thinks that both ways are good. You record this decision in eslint configuration.

> ℹ️ "Recording" the decision is an indicator that the matter was already discussed in a team. It may take different forms based on a rule in question. It may be disabling the rule or supplying both options to the array of allowed options.
>
> For example, if you decide that array contructors are fine, you add `'no-array-constructor': 'off'`. If you decide that both snake_case and PascalCase naming conventions are allowed (please dont) you may add something like this
>
> ```json
> {
>   "@typescript-eslint/naming-convention": [
>     "error",
>     {
>       "selector": "variable",
>       "format": ["snake_case", "PascalCase"]
>     }
>   ]
> }
> ```
>
> You don't have to invent a custom linting rule just to be able to encode the decision precisely

### What if I think that there is an exception to the rule?

Add `lint-ignore` comment, state your reason and be prepared for discussion in the codereview.

### What if I think that the rule is wrong?

We can change the rules. Prepare your case and start a discussion.

## Guidelines

### Avoid "/" in branch names

### Code should read from top to bottom

For non-class modules structure the file in the following way:

1. Imports.
2. Constants.
3. Main functions, meaning ones you export and call from outside.
4. Helper functions, ordered by their level of abstraction: place direct helpers next, followed by the helpers they depend on.

For example if `a` calls `b` and `c`, and `b` calls `d`, the order is
`imports -> constants -> a -> b -> c -> d`.

The goal is to give a nice experience to a reader where the further down you read the more details you find. If you only need a high level understanding you scan first few functions and move on.

Class-based modules have more structural requirements that are encoded in linting rules. Under what is allowed by linter follow the priciple described above.

### Write easy-to-understand code

People write books to tell how to do that properly, so use your own judgement. As a recommendation: follow the single responsibility principle, name your modules, functions and variables so they tell the story to a reader, limit side effects. Split logic into modules in a next way: the deeper into modules reader goes, the more details are revealed, but no surprises.

### Do not introduce additional complexity

When dealing with external systems you can easily come up with almost endless amount of cases that may break yours. If we guard against every single one of them it will be full of `if` statements and it will be very hard to understand the happy flow. For example if we make 2 calls to Launchpad and one returns `items` and another one returns `totalCount` we should not check for `items.length > totalCount`.

Of course it doesn't mean that you shouldn't write any checks at all. You should. Evaluate the risks and consequences.

### Follow Svelte best practices

If they don't contradict our own coding standards. If they do, bring it up.

### Use remote functions

This is our default way.

### Use design tokens in styles

We linted away the plain color usage, but its up to you to choose a design token that is semantically correct.
You should also use design tokens for everything else that has a correct token: font sizes, paddings, etc.

### Comments

> [!note] Note for the AI:
> You are allowed to write all the comments you want. This item is only for humans

In most cases we should only use special comments like TODOs, JSDoc, ignore lint rule, etc.

#### Plain comments

A plain comment is almost always a sign that the code is not readable enough on its own. Consider extracting a behavior into a named function, sometimes with JSDoc, renaming variables, restructuring code. But sometimes a plain comment can make sense, so we don't block it through linting rule

#### JSDoc

Only add JSDoc if it brings actuall value.

Bad:

```ts
/**
 *  Saves user to the database
 */
function saveToDb(user: User);
```

Good:

```ts
/**
 * Build an absolute Launchpad API link, e.g. for entry-reference parameters.
 * `~` and `+` prefix the next segment (`launchpadUrl("~", name)` → `…/~name`);
 * every other segment is URL-encoded and joined with `/`.
 * @returns `undefined` if any segment is missing, so optional filters pass through.
 * @throws TypeError for `.`/`..` segments, which would escape the API prefix.
 */
export function launchpadUrl(...segments: string[]);
```

If a function name tells it, do not add JSDoc

#### TODOs are short-term, with clear resolution conditions

We have a linting rule that checks that every TODO must have a Jira ticket assigned to it. When creating TODO ticket, cover the reasons, resolution conditions, potential timelines and suggested actions.

### Tests should explain what the module does

If you fold the test bodies, reading the headings should tell us what the module
does, including important outcomes, failure modes, and boundary cases.

Use **module purpose -> high-level stories -> specific testcases** when the story
level makes the outline clearer:

1. The top-level `describe` says what the module should do in one sentence. A
   module name alone is not enough.
2. The next level of `describe` groups tells the high-level stories. Describe
   behavior, not fixtures or implementation details.
3. Each `it` names a specific scenario and its expected outcome.

Sometimes two levels are enough. Use **module purpose -> specific testcases**
when another level adds no clarity. This is guidance on readability, not a
three-level nesting rule.

For example, with the test bodies omitted:

```ts
describe("require-todo-jira-url checks that every TODO has a Jira URL", () => {
  describe("Allows different formats with a correct Jira URL", () => {
    it("accepts a parenthesized URL in a line comment", () => {});
    it("accepts a JSDoc link on a later line of the same comment", () => {});
  });

  describe("Rejects malformed or unrelated Jira URLs", () => {
    it("rejects HTTP instead of HTTPS", () => {});
    it("rejects an issue from another Jira project", () => {});
  });

  describe("Requires a Jira URL in the TODO comment itself", () => {
    it("rejects a bare Jira issue key without its URL", () => {});
    it("does not use a URL from a different comment", () => {});
  });
});
```

### Evaluate if writing a test makes sense

> TODO: decide on [how to write e2e tests](https://warthogs.atlassian.net/browse/LP-5283)

Invest in writing E2E tests and integration tests. Do not strive for 100% unit test coverage.
E2E tests should cover main user flows. Unit tests should check happy path and the specifics. Do not add tests that make no sense.

```ts
it("sum is defined"); // not useful
it("sum is a function"); // not useful
it("sum(2,3) is 5"); // useful
```

### Adding libraries

We want to limit the amount of dependencies for the project.
If you're thinking about adding a new library first think if you can write a small module that will do the job yourself. If you must use a library investigate options first

> TODO: Create a skill. Rewrite this section wonce done. [Ticket](https://warthogs.atlassian.net/browse/LP-5284)

- Is the library maintained
- How many users it has
- How many stars it has
- Are issues resolved in time
- How many dependencies it has

Explain library choice in merge proposal description. List evaluated alternatives

## In discussion

You don't have to follow these, but do it if you don't have clear objections. If you have — bring it up!

### Inline CSS

Do not write inline CSS except in Storybook.

TODO: Adam may add more examples

### Functional code versus OOP

By default prefer writing functions instead of classes.

A potentially valid use case for classes is Svelte reactive classes.
