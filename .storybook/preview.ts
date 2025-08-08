import type { Preview } from "@storybook/sveltekit";
import "../src/app.css";
import "./styles.css";
import { addModifiersController, getThemeDecorator } from "./utils";

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
  argTypesEnhancers: [addModifiersController],
};

export default preview;
