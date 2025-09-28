/**
 * Given a CSS selector, returns the first matching node, if any.
 * @param cssSelector - the CSS selector to query
 * @param root - the optional parent node to query
 * @returns the found element, if any
 */
export const querySelector = <T extends Element>(
  cssSelector: string,
  root: Document | DocumentFragment | Element = document,
): T | null => {
  if (!cssSelector || !root?.querySelector) {
    return null;
  }
  return root.querySelector<T>(cssSelector);
};

/**
 * Given a CSS selector, returns a list of all matching nodes.
 * @param cssSelector - the CSS selector to query
 * @param root - the optional parent node to query
 * @returns a list of found nodes
 */
export const querySelectorAll = <T extends Element>(
  cssSelector: string,
  root: Document | DocumentFragment | Element = document,
): Element[] => {
  if (!cssSelector || !root?.querySelectorAll) {
    return [];
  }
  return [...root.querySelectorAll<T>(cssSelector)];
};

/**
 *  Given a XPath selector, returns a list of all matching nodes.
 * @param path - path the XPath selector to evaluate
 * @param root - the optional parent node to query
 * @returns a list of found nodes (elements, attributes, text, comments)
 */
export const xpathSelector = <T extends Element>(
  path: string,
  root: Document | DocumentFragment | Element = document,
): Node[] => {
  if (!path) {
    return [];
  }

  try {
    const expression = new XPathEvaluator().createExpression(path);
    const xpath = expression.evaluate(root, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
    const result = [];
    for (let i = 0, { snapshotLength } = xpath; i < snapshotLength; i++) {
      const item = xpath.snapshotItem(i);
      if (item) {
        result.push(item);
      }
    }
    return result;
  } catch (error) {
    return [];
  }
};
