type GetFirstElementOptions = {
  containerElement: HTMLElement;
  preferredChild?: HTMLElement;
  selector: string;
};

export function getFirstElement(options: GetFirstElementOptions) {
  const { containerElement, preferredChild, selector } = options;
  if (preferredChild && containerElement.contains(preferredChild)) {
    return preferredChild;
  }
  return containerElement.querySelector(selector);
}
