import StatGroupRoot from "./StatGroup.svelte";
import { Description } from "./common/Description/index.js";
import { Stat } from "./common/Stat/index.js";
import { Term } from "./common/Term/index.js";

const StatGroup = StatGroupRoot as typeof StatGroupRoot & {
  Stat: typeof Stat;
  Term: typeof Term;
  Description: typeof Description;
};

StatGroup.Stat = Stat;
StatGroup.Term = Term;
StatGroup.Description = Description;

export { StatGroup };
export type { DescriptionProps } from "./common/Description/index.js";
export type { TermProps } from "./common/Term/index.js";
