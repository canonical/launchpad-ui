import type { Preview } from "@storybook/sveltekit";
import "../src/app.css";
import "./styles.css";
import {
  addModifiersControl,
  changeSnippetControl,
  getThemeDecorator,
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
  decorators: [getThemeDecorator(), transformSnippetArgs],
  argTypesEnhancers: [addModifiersControl, changeSnippetControl],
};

export default preview;
