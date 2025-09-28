interface CreateElementOptions {
  class?: string;
  dataset?: DOMStringMap | { [name: string]: number | boolean | undefined };
  text?: string;
  [key: string]: any;
}

/**
 * @example
 *
 const element = createElement("button", {
  class: "btn",
  text: "New",
  dataset: { test: true },
  id: "new",
  "data-hi": "Yes",
});

 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K,
  options: CreateElementOptions = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(type);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'class') {
      element.classList.add(value);
      return;
    }

    if (key === 'dataset') {
      Object.entries(value as Record<string, string>).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = typeof dataValue === 'string' ? dataValue : String(dataValue);
      });
      return;
    }

    if (key === 'text') {
      element.textContent = value;
      return;
    }

    element.setAttribute(key, value);
  });
  return element;
}
