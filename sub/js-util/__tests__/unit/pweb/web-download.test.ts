import { describe, test, expect, beforeEach, vi } from 'vitest';
import { 
  downloadBlob,
  downloadLink, 
  downloadText
} from '../../../src/pweb/index.js';

// Mock 타입 정의
interface MockWindow {
  open: any;
}

interface MockDocument {
  createElement: any;
  body: {
    appendChild: any;
    removeChild: any;
  };
}

interface MockURL {
  createObjectURL: any;
  revokeObjectURL: any;
}

describe('pweb 모듈', () => {
  let mockDocument: any;
  let mockWindow: any;
  let mockURL: any;
  let mockAnchor: any;

  beforeEach(() => {
    // Mock anchor element
    mockAnchor = {
      href: '',
      download: '',
      type: '',
      click: vi.fn(),
    };

    // Mock document
    mockDocument = {
      createElement: vi.fn().mockReturnValue(mockAnchor),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      }
    };

    // Mock window
    mockWindow = {
      open: vi.fn(),
    };

    // Mock URL
    mockURL = {
      createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
      revokeObjectURL: vi.fn(),
    };

    // Set global mocks
    vi.stubGlobal('document', mockDocument);
    vi.stubGlobal('window', mockWindow);
    vi.stubGlobal('URL', mockURL);
    vi.stubGlobal('HTMLAnchorElement', {
      prototype: { download: true }
    });

    // Reset console.warn mock
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('downloadBlob', () => {
    test('다운로드 속성을 지원하는 브라우저에서 blob 다운로드', () => {
      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';

      downloadBlob(mockBlob, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockDocument.createElement).toHaveBeenCalledWith('a');
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockAnchor);
      expect(mockAnchor.href).toBe('blob:mock-url');
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockAnchor);
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    test('다운로드 속성을 지원하지 않는 브라우저에서 새 창으로 열기', () => {
      // HTMLAnchorElement에서 download 속성 제거
      vi.stubGlobal('HTMLAnchorElement', {
        prototype: {}
      });

      const mockPopup = {
        location: { href: '' }
      };
      mockWindow.open.mockReturnValue(mockPopup);

      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';

      downloadBlob(mockBlob, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockWindow.open).toHaveBeenCalledWith('', '_blank');
      expect(mockPopup.location.href).toBe('blob:mock-url');
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    test('새 창 열기가 실패하는 경우 경고 출력', () => {
      // HTMLAnchorElement에서 download 속성 제거
      vi.stubGlobal('HTMLAnchorElement', {
        prototype: {}
      });

      mockWindow.open.mockReturnValue(null); // 팝업 차단

      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';

      downloadBlob(mockBlob, fileName);

      expect(mockWindow.open).toHaveBeenCalledWith('', '_blank');
      expect(console.warn).toHaveBeenCalledWith('window.open() fail');
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    test('예외 발생 시에도 URL이 정리됨', () => {
      mockAnchor.click.mockImplementation(() => {
        throw new Error('Click failed');
      });

      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';

      expect(() => downloadBlob(mockBlob, fileName)).toThrow('Click failed');
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    test('빈 파일명으로도 동작함', () => {
      const mockBlob = new Blob([''], { type: 'text/plain' });
      const fileName = '';

      downloadBlob(mockBlob, fileName);

      expect(mockAnchor.download).toBe('');
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('다양한 MIME 타입의 blob 처리', () => {
      const jsonBlob = new Blob(['{"key": "value"}'], { type: 'application/json' });
      const fileName = 'data.json';

      downloadBlob(jsonBlob, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalledWith(jsonBlob);
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });
  });

  describe('downloadLink', () => {
    test('다운로드 속성을 지원하는 브라우저에서 링크 다운로드', () => {
      const href = 'https://example.com/file.pdf';

      downloadLink(href);

      expect(mockDocument.createElement).toHaveBeenCalledWith('a');
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockAnchor);
      expect(mockAnchor.href).toBe(href);
      expect(mockAnchor.type).toBe('application/octet-stream');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockAnchor);
    });

    test('다운로드 속성을 지원하지 않는 브라우저에서 새 창으로 열기', () => {
      // HTMLAnchorElement에서 download 속성 제거
      vi.stubGlobal('HTMLAnchorElement', {
        prototype: {}
      });

      const mockPopup = {
        location: { href: '' }
      };
      mockWindow.open.mockReturnValue(mockPopup);

      const href = 'https://example.com/file.pdf';

      downloadLink(href);

      expect(mockWindow.open).toHaveBeenCalledWith('', '_blank');
      expect(mockPopup.location.href).toBe(href);
    });

    test('새 창 열기가 실패하는 경우 경고 출력', () => {
      // HTMLAnchorElement에서 download 속성 제거
      vi.stubGlobal('HTMLAnchorElement', {
        prototype: {}
      });

      mockWindow.open.mockReturnValue(null); // 팝업 차단

      const href = 'https://example.com/file.pdf';

      downloadLink(href);

      expect(mockWindow.open).toHaveBeenCalledWith('', '_blank');
      expect(console.warn).toHaveBeenCalledWith('window.open() fail');
    });

    test('빈 URL로도 동작함', () => {
      const href = '';

      downloadLink(href);

      expect(mockAnchor.href).toBe('');
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('상대 경로 URL 처리', () => {
      const href = './relative/path/file.txt';

      downloadLink(href);

      expect(mockAnchor.href).toBe(href);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('data URL 처리', () => {
      const href = 'data:text/plain;base64,SGVsbG8gV29ybGQ=';

      downloadLink(href);

      expect(mockAnchor.href).toBe(href);
      expect(mockAnchor.type).toBe('application/octet-stream');
      expect(mockAnchor.click).toHaveBeenCalled();
    });
  });

  describe('downloadText', () => {
    test('텍스트 내용으로 blob을 생성하고 다운로드', () => {
      const text = 'Hello, World!';
      const fileName = 'hello.txt';

      downloadText(text, fileName);

      // downloadBlob이 호출되었는지 확인
      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockDocument.createElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('빈 텍스트 처리', () => {
      const text = '';
      const fileName = 'empty.txt';

      downloadText(text, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('멀티라인 텍스트 처리', () => {
      const text = 'Line 1\\nLine 2\\nLine 3';
      const fileName = 'multiline.txt';

      downloadText(text, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('유니코드 텍스트 처리', () => {
      const text = '안녕하세요! 🎉 Unicode test';
      const fileName = 'unicode.txt';

      downloadText(text, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('JSON 형태의 텍스트 처리', () => {
      const text = JSON.stringify({ key: 'value', array: [1, 2, 3] }, null, 2);
      const fileName = 'data.json';

      downloadText(text, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('매우 긴 텍스트 처리', () => {
      const text = 'A'.repeat(10000); // 10KB 텍스트
      const fileName = 'large.txt';

      downloadText(text, fileName);

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    test('특수 문자가 포함된 파일명', () => {
      const text = 'Test content';
      const fileName = 'file with spaces & special chars.txt';

      downloadText(text, fileName);

      expect(mockAnchor.download).toBe(fileName);
      expect(mockAnchor.click).toHaveBeenCalled();
    });
  });

  describe('브라우저 호환성 테스트', () => {
    test('모든 함수가 브라우저 환경에서 필요한 전역 객체들을 사용', () => {
      // 이 테스트는 함수들이 브라우저 전용임을 확인
      expect(() => {
        const blob = new Blob(['test']);
        downloadBlob(blob, 'test.txt');
      }).not.toThrow();

      expect(() => {
        downloadLink('http://example.com');
      }).not.toThrow();

      expect(() => {
        downloadText('test', 'test.txt');
      }).not.toThrow();
    });
  });
});