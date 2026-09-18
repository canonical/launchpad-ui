/** Snapshot for converting vertical coordinates between the viewport and list offsets. */
export function listCoordinates(list: HTMLElement) {
  const rect = list.getBoundingClientRect();
  const scaleY = rect.height / list.offsetHeight;
  const borderTop = list.clientTop;
  const scrollTop = list.scrollTop;

  return {
    viewportToList(viewportY: number) {
      const scaledY = viewportY - rect.top;
      const borderBoxY = scaledY / scaleY;
      const paddingBoxY = borderBoxY - borderTop;
      const listY = paddingBoxY + scrollTop;

      return listY;
    },
    listToViewport(listY: number) {
      const paddingBoxY = listY - scrollTop;
      const borderBoxY = paddingBoxY + borderTop;
      const scaledY = borderBoxY * scaleY;
      const viewportY = scaledY + rect.top;

      return viewportY;
    },
  };
}
