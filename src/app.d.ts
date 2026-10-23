// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { TableView } from "#lib/modules/packages/table-views/constants.js";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: { id: string };
    }
    // interface PageData {}
    interface PageState {
      tableViews?: TableView[];
    }
    // interface Platform {}
  }
}

export {};
