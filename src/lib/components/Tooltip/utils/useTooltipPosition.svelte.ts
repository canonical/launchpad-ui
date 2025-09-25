import { flip, offset } from "@floating-ui/dom";
import type { ComputePositionConfig, Placement } from "@floating-ui/dom";
import {
  positionAreaFallbackMap,
  useFloatingUI,
} from "$lib/usePositionArea.svelte.js";
import type { PositionArea } from "$lib/usePositionArea.svelte.js";

export function useTooltipPosition(
  getActive: () => boolean,
  getPosition: () => PositionArea,
  getAutoAdjust: () => boolean,
  distanceToTrigger: number,
) {
  const tooltipPosition = $state({ top: "auto", left: "auto" });
  let tooltipPlacement = $derived<Placement>(
    positionAreaFallbackMap[getPosition()],
  );

  const floatingUiConfig = $derived<Partial<ComputePositionConfig>>({
    placement: positionAreaFallbackMap[getPosition()],
    middleware: [
      offset(distanceToTrigger),
      getAutoAdjust() &&
        flip({
          fallbackAxisSideDirection: "start",
        }),
    ],
  });
  const { triggerAttachment, targetAttachment } = useFloatingUI(
    getActive,
    () => floatingUiConfig,
    ({ x, y, placement }) => {
      tooltipPosition.top = `${y}px`;
      tooltipPosition.left = `${x}px`;
      tooltipPlacement = placement;
    },
  );

  return {
    triggerAttachment,
    targetAttachment,
    tooltipPosition,
    getTooltipPlacement: () => tooltipPlacement,
  };
}
