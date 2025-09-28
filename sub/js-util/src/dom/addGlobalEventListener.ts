export function addGlobalEventListener<T extends Event = Event>(
  type: string,
  selector: string,
  callback: (e: T & { target: HTMLElement }) => void,
  options?: boolean | AddEventListenerOptions,
  parent?: Document | HTMLElement,
): VoidFunction {
  const parentElement = parent || (typeof document !== 'undefined' ? document : null);
  if (!parentElement) {
    throw new Error('Document is not available and no parent element provided');
  }
  const handleEvent = (e: any) => {
    const target = e.target as HTMLElement;
    if (target.matches(selector)) {
      callback(e);
    }
  };
  parentElement.addEventListener(type, handleEvent, options);
  return () => {
    parentElement.removeEventListener(type, handleEvent);
  };
}

addGlobalEventListener('click', '.btn', (e: MouseEvent) => {
  const elem = e.target as HTMLElement;
  console.log(elem.textContent);
});
