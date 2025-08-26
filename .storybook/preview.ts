import type { Preview } from "@storybook/sveltekit";
import "../src/app.css";
import "./styles.css";
import {
  changeSnippetControl,
  getThemeDecorator,
  mergeModifiersArgs,
  transformSnippetArgs,
} from "./utils";

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
  decorators: [getThemeDecorator(), transformSnippetArgs, mergeModifiersArgs],
  argTypesEnhancers: [changeSnippetControl],
};

export default preview;
