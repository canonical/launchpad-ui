import { createContext } from "svelte";
import type { PaginationContext } from "./types.js";

export const [getPaginationContext, setPaginationContext] =
  createContext<PaginationContext>();
