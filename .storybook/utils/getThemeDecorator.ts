import { DecoratorHelpers } from "@storybook/addon-themes";
import type { Decorator } from "@storybook/sveltekit";
import type { Theme } from "../../src/lib/theme";
import { themes } from "../../src/lib/theme";
import ThemeProvider from "./ThemeProvider.svelte";

const { pluckThemeFromContext, initializeThemeState } = DecoratorHelpers;

export const getThemeDecorator = (): Decorator => {
  const defaultTheme: Theme = "light";
  initializeThemeState([...themes], defaultTheme);

  return (_, context) => ({
    Component: ThemeProvider,
    props: {
      theme: pluckThemeFromContext(context) || defaultTheme,
    },
  });
};
