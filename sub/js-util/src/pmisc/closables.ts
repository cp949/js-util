type WinEventType = keyof WindowEventMap;
type WinEventListener<K extends WinEventType> = (this: Window, ev: WindowEventMap[K]) => any;
type EventOptions = boolean | AddEventListenerOptions;

type DocEventType = keyof DocumentEventMap;

type DocEventListener<K extends DocEventType> = (this: Document, ev: DocumentEventMap[K]) => any;

type ElemEventType = keyof HTMLElementEventMap;
type ElemEventListener<K extends ElemEventType> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K],
) => any;

export class Closables {
  private store_ = new Set<() => any>();
  add = (...closables: (() => any)[]): this => {
    closables.forEach((it) => {
      this.store_.add(it);
    });
    return this;
  };

  remove = (...closables: (() => any)[]): this => {
    closables.forEach((it) => {
      this.store_.delete(it);
    });
    return this;
  };

  addRx = (...closables: Array<{ unsubscribe: () => any }>): this => {
    closables.forEach((s) => {
      this.store_.add(() => {
        s.unsubscribe();
      });
    });
    return this;
  };

  addUnsubscribe = this.addRx;

  addClose = (...closables: Array<{ close: () => any }>): this => {
    closables.forEach((s) => {
      this.store_.add(() => {
        s.close();
      });
    });
    return this;
  };

  addDispose = (...closables: Array<{ dispose: () => any }>): this => {
    closables.forEach((s) => {
      this.store_.add(() => {
        s.dispose();
      });
    });
    return this;
  };

  addDestroy = (...closables: Array<{ destroy: () => any }>): this => {
    closables.forEach((s) => {
      this.store_.add(() => {
        s.destroy();
      });
    });
    return this;
  };

  addShutdown = (...closables: Array<{ shutdown: () => any }>): this => {
    closables.forEach((s) => {
      this.store_.add(() => {
        s.shutdown();
      });
    });
    return this;
  };

  addTerminate = (...closables: Array<{ terminate: () => any }>): this => {
    closables.forEach((s) => {
      this.store_.add(() => {
        s.terminate();
      });
    });
    return this;
  };

  addElementListener = <K extends ElemEventType>(
    elem: HTMLElement,
    type: K,
    listener: ElemEventListener<K>,
    options?: EventOptions,
  ): this => {
    elem.addEventListener(type, listener, options);
    this.store_.add(() => {
      elem.removeEventListener(type, listener, options);
    });
    return this;
  };

  addDocumentListener = <K extends DocEventType>(
    type: K,
    listener: DocEventListener<K>,
    options?: EventOptions,
  ): this => {
    document.addEventListener(type, listener, options);
    this.store_.add(() => {
      document.removeEventListener(type, listener, options);
    });
    return this;
  };

  addWindowListener = <K extends WinEventType>(
    type: K,
    listener: WinEventListener<K>,
    options?: EventOptions,
  ): this => {
    window.addEventListener(type, listener, options);
    this.store_.add(() => {
      window.removeEventListener(type, listener, options);
    });
    return this;
  };

  get count() {
    return this.store_.size;
  }

  close = () => {
    if (this.store_.size > 0) {
      Array.from(this.store_).forEach((fn) => {
        fn();
      });
      this.store_.clear();
    }
  };

  static create = (...closables: (() => any)[]) => {
    const c = new Closables();
    c.add(...closables);
    return c;
  };

  static createWindowListener = <K extends WinEventType>(
    type: K,
    listener: WinEventListener<K>,
    options?: EventOptions,
  ) => {
    const c = new Closables();
    c.addWindowListener(type, listener, options);
    return c;
  };

  static createDocumentListener = <K extends DocEventType>(
    type: K,
    listener: DocEventListener<K>,
    options?: EventOptions,
  ) => {
    const c = new Closables();
    c.addDocumentListener(type, listener, options);
    return c;
  };

  static createElementListener = <K extends ElemEventType>(
    elem: HTMLElement,
    type: K,
    listener: ElemEventListener<K>,
    options?: EventOptions,
  ) => {
    const c = new Closables();
    c.addElementListener(elem, type, listener, options);
    return c;
  };

  static createRx = (...closables: { unsubscribe: () => any }[]) => {
    const c = new Closables();
    c.addRx(...closables);
    return c;
  };

  static createClose = (...closables: { close: () => any }[]) => {
    const c = new Closables();
    c.addClose(...closables);
    return c;
  };

  static createTerminate = (...closables: { terminate: () => any }[]) => {
    const c = new Closables();
    c.addTerminate(...closables);
    return c;
  };

  static createShutdown = (...closables: { shutdown: () => any }[]) => {
    const c = new Closables();
    c.addShutdown(...closables);
    return c;
  };

  static createDestroy = (...closables: { destroy: () => any }[]) => {
    const c = new Closables();
    c.addDestroy(...closables);
    return c;
  };

  static createDispose = (...closables: { dispose: () => any }[]) => {
    const c = new Closables();
    c.addDispose(...closables);
    return c;
  };
}
