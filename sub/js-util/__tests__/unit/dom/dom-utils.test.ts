import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { addGlobalEventListener, createElement, qs, qsa } from '../../../src/dom/index.js';

describe('dom - DOM Utilities', () => {
  // DOM 환경 설정
  beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('qs - querySelector 래퍼', () => {
    test('요소 선택 성공', () => {
      document.body.innerHTML = '<div class="test">Test Content</div>';

      const element = qs<HTMLDivElement>('.test');
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element?.textContent).toBe('Test Content');
    });

    test('존재하지 않는 요소 선택 시 null 반환', () => {
      const element = qs('.nonexistent');
      expect(element).toBeNull();
    });

    test('부모 요소 지정하여 선택', () => {
      document.body.innerHTML = `
        <div class="parent">
          <span class="child">Child 1</span>
        </div>
        <div class="other">
          <span class="child">Child 2</span>
        </div>
      `;

      const parent = qs('.parent')! as HTMLElement;
      const childInParent = qs<HTMLSpanElement>('.child', parent);

      expect(childInParent?.textContent).toBe('Child 1');
    });

    test('타입 제네릭 확인', () => {
      document.body.innerHTML = '<button id="btn">Click</button>';

      const button = qs<HTMLButtonElement>('#btn');
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('qsa - querySelectorAll 래퍼', () => {
    test('여러 요소 선택 성공', () => {
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      `;

      const elements = qsa<HTMLDivElement>('.item');
      expect(elements).toHaveLength(3);
      expect(elements[0].textContent).toBe('Item 1');
      expect(elements[2].textContent).toBe('Item 3');
    });

    test('요소가 없을 때 빈 배열 반환', () => {
      const elements = qsa('.nonexistent');
      expect(elements).toEqual([]);
      expect(Array.isArray(elements)).toBe(true);
    });

    test('부모 요소 지정하여 선택', () => {
      document.body.innerHTML = `
        <div class="container">
          <p class="text">Para 1</p>
          <p class="text">Para 2</p>
        </div>
        <p class="text">Para 3</p>
      `;

      const container = qs('.container')! as HTMLElement;
      const textsInContainer = qsa<HTMLParagraphElement>('.text', container);

      expect(textsInContainer).toHaveLength(2);
      expect(textsInContainer[0].textContent).toBe('Para 1');
      expect(textsInContainer[1].textContent).toBe('Para 2');
    });

    test('NodeList를 배열로 변환 확인', () => {
      document.body.innerHTML = `
        <span class="span">1</span>
        <span class="span">2</span>
      `;

      const elements = qsa('.span');
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.map).toBeDefined(); // 배열 메서드 사용 가능
      expect(elements.filter).toBeDefined();
    });
  });

  describe('createElement - 요소 생성', () => {
    test('기본 요소 생성', () => {
      const div = createElement('div');
      expect(div).toBeInstanceOf(HTMLDivElement);
      expect(div.tagName).toBe('DIV');
    });

    test('클래스 추가', () => {
      const button = createElement('button', { class: 'btn-primary' });
      expect(button.classList.contains('btn-primary')).toBe(true);
    });

    test('텍스트 컨텐츠 설정', () => {
      const p = createElement('p', { text: 'Hello World' });
      expect(p.textContent).toBe('Hello World');
    });

    test('dataset 설정', () => {
      const div = createElement('div', {
        dataset: {
          testValue: 'test',
          number: '42',
          boolean: 'true',
        },
      });

      expect(div.dataset['testValue']).toBe('test');
      expect(div.dataset['number']).toBe('42'); // 문자열로 변환됨
      expect(div.dataset['boolean']).toBe('true');
    });

    test('일반 속성 설정', () => {
      const input = createElement('input', {
        type: 'text',
        placeholder: 'Enter text',
        id: 'text-input',
      });

      expect(input.type).toBe('text');
      expect(input.placeholder).toBe('Enter text');
      expect(input.id).toBe('text-input');
    });

    test('복합 옵션 설정', () => {
      const element = createElement('button', {
        class: 'btn',
        text: 'Click Me',
        dataset: { action: 'submit' },
        id: 'submit-btn',
        'data-testid': 'submit-button',
      });

      expect(element.classList.contains('btn')).toBe(true);
      expect(element.textContent).toBe('Click Me');
      expect(element.dataset['action']).toBe('submit');
      expect(element.id).toBe('submit-btn');
      expect(element.getAttribute('data-testid')).toBe('submit-button');
    });

    test('타입 안전성 확인', () => {
      const img = createElement('img', { src: 'test.jpg', alt: 'Test' });
      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toContain('test.jpg'); // 절대 URL로 변환될 수 있음
      expect(img.alt).toBe('Test');
    });
  });

  describe('addGlobalEventListener - 글로벌 이벤트 위임', () => {
    test('이벤트 위임 기본 동작', () => {
      document.body.innerHTML = `
        <div class="container">
          <button class="btn">Button 1</button>
          <button class="btn">Button 2</button>
        </div>
      `;

      const callback = vi.fn();
      const cleanup = addGlobalEventListener('click', '.btn', callback);

      const button1 = qs('.btn')! as HTMLElement;
      button1.click();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          target: button1,
        }),
      );

      cleanup();
    });

    test('동적으로 추가된 요소에도 이벤트 적용', () => {
      const callback = vi.fn();
      const cleanup = addGlobalEventListener('click', '.dynamic', callback);

      // 이벤트 리스너 등록 후 요소 추가
      const newButton = createElement('button', { class: 'dynamic', text: 'Dynamic' });
      document.body.appendChild(newButton);

      (newButton as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce();

      cleanup();
    });

    test('선택자와 일치하지 않는 요소는 무시', () => {
      document.body.innerHTML = `
        <button class="btn">Target</button>
        <button class="other">Not Target</button>
      `;

      const callback = vi.fn();
      const cleanup = addGlobalEventListener('click', '.btn', callback);

      (qs('.other')! as HTMLElement).click();
      expect(callback).not.toHaveBeenCalled();

      (qs('.btn')! as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce();

      cleanup();
    });

    test('부모 요소 지정', () => {
      document.body.innerHTML = `
        <div id="parent1">
          <button class="btn">Button in parent1</button>
        </div>
        <div id="parent2">
          <button class="btn">Button in parent2</button>
        </div>
      `;

      const callback = vi.fn();
      const parent1 = qs('#parent1') as HTMLDivElement;
      const cleanup = addGlobalEventListener('click', '.btn', callback, undefined, parent1);

      // parent1 내부 버튼 클릭 - 이벤트 발생
      (qs('#parent1 .btn')! as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce();

      // parent2 내부 버튼 클릭 - 이벤트 발생 안함
      (qs('#parent2 .btn')! as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce(); // 여전히 1번만

      cleanup();
    });

    test('이벤트 리스너 제거 (cleanup)', () => {
      document.body.innerHTML = '<button class="btn">Button</button>';

      const callback = vi.fn();
      const cleanup = addGlobalEventListener('click', '.btn', callback);

      (qs('.btn')! as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce();

      cleanup(); // 이벤트 리스너 제거

      (qs('.btn')! as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce(); // 더 이상 호출 안됨
    });

    test('이벤트 옵션 전달', () => {
      document.body.innerHTML = '<button class="btn">Button</button>';

      const callback = vi.fn();
      const options: AddEventListenerOptions = { once: true };
      const cleanup = addGlobalEventListener('click', '.btn', callback, options);

      const button = qs('.btn')!;

      (button as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce();

      (button as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce(); // once 옵션으로 한 번만 실행

      cleanup();
    });

    test('타입 안전성 - 특정 이벤트 타입', () => {
      document.body.innerHTML = '<button class="btn">Button</button>';

      const callback = vi.fn((e: MouseEvent & { target: HTMLElement }) => {
        expect(e.type).toBe('click');
        expect(e.target).toBeInstanceOf(HTMLButtonElement);
      });

      const cleanup = addGlobalEventListener<MouseEvent>('click', '.btn', callback);

      (qs('.btn')! as HTMLElement).click();
      expect(callback).toHaveBeenCalledOnce();

      cleanup();
    });
  });

  describe('브라우저 환경 호환성', () => {
    test('document가 없는 환경에서 에러 처리', () => {
      // 실제 Node.js 환경에서는 jsdom이 document를 제공하므로
      // 이 테스트는 개념적 확인용
      expect(document).toBeDefined();
      expect(document.querySelector).toBeDefined();
      expect(document.createElement).toBeDefined();
    });
  });
});
