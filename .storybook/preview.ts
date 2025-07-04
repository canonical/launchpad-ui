import { DecoratorHelpers } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/sveltekit";
import { themes } from "../src/lib/theme";
import type { Theme } from "../src/lib/theme";
import ThemeProvider from "./ThemeProvider.svelte";
import "../src/app.css";
import "./styles.css";

const { pluckThemeFromContext, initializeThemeState } = DecoratorHelpers;

const getThemeDecorator = (): Decorator => {
  const defaultTheme: Theme = "light";
  initializeThemeState([...themes], defaultTheme);

  return (_, context) => ({
    Component: ThemeProvider,
    props: {
      theme: pluckThemeFromContext(context) || defaultTheme,
    },
  });
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [getThemeDecorator()],
};

export default preview;
