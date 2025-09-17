import { autoUpdate, computePosition, flip } from "@floating-ui/dom";
import type {
  ComputePositionConfig,
  ComputePositionReturn,
  Placement,
} from "@floating-ui/dom";
import type { Attachment } from "svelte/attachments";
import { useIsMounted } from "./useIsMounted.svelte.js";

const positionAreaFallbackMap = {
  /*
  
  +---+---+---+
  | 1 | 2 | 3 |
  +---+---+---+
  | 4 |   | 5 |
  +---+---+---+
  | 6 | 7 | 8 |
  +---+---+---+
  
  */
  "block-start": "top", // spans 1, 2, 3
  "block-end": "bottom", // spans 6, 7, 8
  "block-start span-inline-start": "top-end", // spans 1, 2
  "block-start span-inline-end": "top-start", // spans 2, 3
  "block-end span-inline-start": "bottom-end", // spans 6, 7
  "block-end span-inline-end": "bottom-start", // spans 7, 8
  "inline-start": "left", // spans 1, 4, 6
  "inline-end": "right", // spans 3, 5, 8
} as const satisfies Record<string, Placement>;

export type PositionArea = keyof typeof positionAreaFallbackMap;

export type PositionTryFallback =
  | "flip-inline"
  | "flip-block"
  | "flip-inline, flip-block";

export function usePositionArea(
  getPosition: () => PositionArea,
  getActive: () => boolean,
  getTryFallback?: () => PositionTryFallback | undefined,
) {
  const isMounted = useIsMounted();
  const needsFallback = $derived.by(() => {
    const position = getPosition();
    return (
      isMounted.value &&
      (!CSS.supports("position-area", getPosition()) ||
        // Chrome (as of 129) reports support for `inline-start` and `inline-end`, but it is partial and unstable.
        // See: https://issues.chromium.org/issues/438334710
        // TODO: Remove when this is resolved.
        position.startsWith("inline"))
    );
  });

  const active = $derived(needsFallback && getActive());
  const floatingUIConfig = $derived.by(() => {
    const position = getPosition();
    const tryFallback = getTryFallback?.();

    if (!tryFallback) {
      return {
        placement: positionAreaFallbackMap[position],
      };
    }

    return {
      placement: positionAreaFallbackMap[position],
      middleware: [
        // This doesn't 100% match the native CSS behavior, but should be close enough for most use cases.
        flip({
          mainAxis:
            (position.startsWith("block") &&
              tryFallback.includes("flip-block")) ||
            (position.startsWith("inline") &&
              tryFallback.includes("flip-inline")),
          crossAxis:
            (position.startsWith("block") &&
              tryFallback.includes("flip-inline")) ||
            (position.startsWith("inline") &&
              tryFallback.includes("flip-block")),
          flipAlignment:
            position.startsWith("block") && tryFallback.includes("flip-inline"),
        }),
      ],
    };
  });

  let fallbackStyle = $state<string>("");

  const { triggerAttachment, targetAttachment } = useFloatingUI(
    () => active,
    () => floatingUIConfig,
    ({ x, y }) => {
      fallbackStyle = `position: absolute; left: ${x}px; top: ${y}px;`;
    },
  );

  const targetStyle = $derived.by(() => {
    if (needsFallback && fallbackStyle) {
      return fallbackStyle;
    }
    const tryFallback = getTryFallback?.();
    return `position-area: ${getPosition()};${tryFallback ? ` position-try-fallbacks: ${tryFallback};` : ""}`;
  });

  return {
    triggerAttachment,
    targetAttachment,
    targetStyle: () => targetStyle,
  };
}

export function useFloatingUI(
  getActive: () => boolean,
  getOptions: () => Partial<ComputePositionConfig> | undefined,
  callback: (value: ComputePositionReturn) => void,
) {
  let trigger = $state<HTMLElement>();
  let target = $state<HTMLElement>();

  const triggerAttachment: Attachment<HTMLElement> = (node) => {
    trigger = node;
    return () => (trigger = undefined);
  };

  const targetAttachment: Attachment<HTMLElement> = (node) => {
    target = node;
    return () => (target = undefined);
  };

  $effect(() => {
    if (!getActive()) return;
    if (!trigger || !target) return;
    const options = getOptions();

    const cleanup = autoUpdate(trigger, target, () => {
      if (!trigger || !target) return;
      computePosition(trigger, target, options).then(callback);
    });

    return () => {
      cleanup();
    };
  });

  return {
    triggerAttachment,
    targetAttachment,
  };
}
