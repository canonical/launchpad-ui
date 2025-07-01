import { DecoratorHelpers } from "@storybook/addon-themes";
import { type Decorator, type Preview } from "@storybook/sveltekit";
import { themes } from "../src/lib/theme";
import ThemeProvider from "./ThemeProvider.svelte";
import "../src/app.css";

const { pluckThemeFromContext, initializeThemeState } = DecoratorHelpers;

const getThemeDecorator = (): Decorator => {
  initializeThemeState([...themes], "light");

  return (_, context) => ({
    Component: ThemeProvider,
    props: {
      theme: pluckThemeFromContext(context),
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
  },
  decorators: [getThemeDecorator()],
};

export default preview;
