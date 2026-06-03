const LATENCY_MS = 30;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const delay = (ms: number = LATENCY_MS): Promise<void> => sleep(ms);
