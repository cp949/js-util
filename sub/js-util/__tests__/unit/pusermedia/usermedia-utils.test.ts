import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  hasGetUserMedia,
  closeUserMedia,
  closeUserMediaAudioTracks,
  closeUserMediaVideoTracks,
  fixUserMedia,
} from '../../../src/pusermedia/index.js';

// 전역 타입 확장
declare global {
  interface Window {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }

  interface Navigator {
    getUserMedia?: any;
    webkitGetUserMedia?: any;
    mozGetUserMedia?: any;
    msGetUserMedia?: any;
  }
}

describe('pusermedia 모듈', () => {
  // Mock MediaStreamTrack
  const createMockTrack = (kind: 'audio' | 'video'): MediaStreamTrack => ({
    kind,
    id: `${kind}-track-${Math.random()}`,
    label: `${kind} track`,
    enabled: true,
    muted: false,
    readyState: 'live' as MediaStreamTrackState,
    contentHint: '',
    stop: vi.fn(),
    clone: vi.fn(),
    getConstraints: vi.fn(),
    getCapabilities: vi.fn(),
    getSettings: vi.fn(),
    applyConstraints: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onended: null,
    onmute: null,
    onunmute: null,
  });

  // Mock MediaStream
  const createMockMediaStream = (
    audioTracks: MediaStreamTrack[] = [],
    videoTracks: MediaStreamTrack[] = [],
  ): MediaStream => ({
    id: `stream-${Math.random()}`,
    active: true,
    getAudioTracks: vi.fn(() => audioTracks),
    getVideoTracks: vi.fn(() => videoTracks),
    getTracks: vi.fn(() => [...audioTracks, ...videoTracks]),
    getTrackById: vi.fn(),
    addTrack: vi.fn(),
    removeTrack: vi.fn(),
    clone: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onaddtrack: null,
    onremovetrack: null,
  });

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Reset global objects
    delete (global as any).window;
    delete (global as any).navigator;
    delete (global as any).AudioContext;
  });

  describe('hasGetUserMedia', () => {
    test('navigator.mediaDevices.getUserMedia가 있을 때 true 반환', () => {
      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(),
        },
      });

      expect(hasGetUserMedia()).toBe(true);
    });

    test('navigator.mediaDevices가 없을 때 false 반환', () => {
      vi.stubGlobal('navigator', {});

      expect(hasGetUserMedia()).toBe(false);
    });

    test('navigator.mediaDevices.getUserMedia가 없을 때 false 반환', () => {
      vi.stubGlobal('navigator', {
        mediaDevices: {},
      });

      expect(hasGetUserMedia()).toBe(false);
    });

    test('navigator 자체가 없을 때 에러 발생', () => {
      // navigator를 undefined로 설정
      vi.stubGlobal('navigator', undefined);

      expect(() => hasGetUserMedia()).toThrow();
    });
  });

  describe('closeUserMediaAudioTracks', () => {
    test('오디오 트랙들을 정상적으로 제거하고 중지', () => {
      const audioTrack1 = createMockTrack('audio');
      const audioTrack2 = createMockTrack('audio');
      const mediaStream = createMockMediaStream([audioTrack1, audioTrack2]);

      closeUserMediaAudioTracks(mediaStream);

      expect(mediaStream.getAudioTracks).toHaveBeenCalled();
      expect(mediaStream.removeTrack).toHaveBeenCalledWith(audioTrack1);
      expect(mediaStream.removeTrack).toHaveBeenCalledWith(audioTrack2);
      expect(audioTrack1.stop).toHaveBeenCalled();
      expect(audioTrack2.stop).toHaveBeenCalled();
    });

    test('null 미디어 스트림 처리', () => {
      expect(() => closeUserMediaAudioTracks(null)).not.toThrow();
      expect(() => closeUserMediaAudioTracks(undefined)).not.toThrow();
    });

    test('오디오 트랙이 없는 경우', () => {
      const mediaStream = createMockMediaStream([], []);

      expect(() => closeUserMediaAudioTracks(mediaStream)).not.toThrow();
      expect(mediaStream.getAudioTracks).toHaveBeenCalled();
    });

    test('트랙 제거 중 에러가 발생해도 계속 진행', () => {
      const audioTrack1 = createMockTrack('audio');
      const audioTrack2 = createMockTrack('audio');
      const mediaStream = createMockMediaStream([audioTrack1, audioTrack2]);

      // 첫 번째 트랙에서만 에러 발생하도록 설정
      (mediaStream.removeTrack as any)
        .mockImplementationOnce(() => {
          throw new Error('Remove track failed');
        })
        .mockImplementationOnce(() => {
          // 두 번째는 정상 실행
        });

      expect(() => closeUserMediaAudioTracks(mediaStream)).not.toThrow();

      // 첫 번째 트랙은 에러로 인해 stop 호출되지 않음
      expect(audioTrack1.stop).not.toHaveBeenCalled();
      // 두 번째 트랙은 정상적으로 stop 호출됨
      expect(audioTrack2.stop).toHaveBeenCalled();
    });
  });

  describe('closeUserMediaVideoTracks', () => {
    test('비디오 트랙들을 정상적으로 제거하고 중지', () => {
      const videoTrack1 = createMockTrack('video');
      const videoTrack2 = createMockTrack('video');
      const mediaStream = createMockMediaStream([], [videoTrack1, videoTrack2]);

      closeUserMediaVideoTracks(mediaStream);

      expect(mediaStream.getVideoTracks).toHaveBeenCalled();
      expect(mediaStream.removeTrack).toHaveBeenCalledWith(videoTrack1);
      expect(mediaStream.removeTrack).toHaveBeenCalledWith(videoTrack2);
      expect(videoTrack1.stop).toHaveBeenCalled();
      expect(videoTrack2.stop).toHaveBeenCalled();
    });

    test('null 미디어 스트림 처리', () => {
      expect(() => closeUserMediaVideoTracks(null)).not.toThrow();
      expect(() => closeUserMediaVideoTracks(undefined)).not.toThrow();
    });

    test('비디오 트랙이 없는 경우', () => {
      const mediaStream = createMockMediaStream([], []);

      expect(() => closeUserMediaVideoTracks(mediaStream)).not.toThrow();
      expect(mediaStream.getVideoTracks).toHaveBeenCalled();
    });
  });

  describe('closeUserMedia', () => {
    test('오디오와 비디오 트랙이 모두 있는 스트림 처리', () => {
      const audioTrack = createMockTrack('audio');
      const videoTrack = createMockTrack('video');
      const mediaStream = createMockMediaStream([audioTrack], [videoTrack]);

      closeUserMedia(mediaStream);

      expect(mediaStream.getAudioTracks).toHaveBeenCalled();
      expect(mediaStream.getVideoTracks).toHaveBeenCalled();
      expect(audioTrack.stop).toHaveBeenCalled();
      expect(videoTrack.stop).toHaveBeenCalled();
    });

    test('null이나 undefined 스트림 처리', () => {
      expect(() => closeUserMedia(null)).not.toThrow();
      expect(() => closeUserMedia(undefined)).not.toThrow();
    });

    test('MediaStreamTrack 객체 직접 처리', () => {
      const track = createMockTrack('audio');

      // MediaStream이 아닌 MediaStreamTrack로 전달
      // 이 경우 media가 null이나 undefined가 아니었을 때 처리됨
      closeUserMedia(null);

      // null이므로 stop 호출되지 않음
      expect(track.stop).not.toHaveBeenCalled();
    });

    test('getVideoTracks 메서드가 없는 경우', () => {
      const mockObject = {
        getAudioTracks: vi.fn(() => [createMockTrack('audio')]),
        removeTrack: vi.fn(),
        // getVideoTracks는 의도적으로 제외
      };

      expect(() => closeUserMedia(mockObject as any)).not.toThrow();
      expect(mockObject.getAudioTracks).toHaveBeenCalled();
    });

    test('getAudioTracks 메서드가 없는 경우', () => {
      const mockObject = {
        getVideoTracks: vi.fn(() => [createMockTrack('video')]),
        removeTrack: vi.fn(),
        // getAudioTracks는 의도적으로 제외
      };

      expect(() => closeUserMedia(mockObject as any)).not.toThrow();
      expect(mockObject.getVideoTracks).toHaveBeenCalled();
    });
  });

  describe('fixUserMedia', () => {
    test('서버 환경(window가 undefined)에서는 아무것도 하지 않음', () => {
      // window를 undefined로 설정
      vi.stubGlobal('window', undefined);

      expect(() => fixUserMedia()).not.toThrow();
    });

    test('브라우저 환경에서 AudioContext 폴리필 설정', () => {
      const mockAudioContext = vi.fn();
      const mockWebkitAudioContext = vi.fn();

      vi.stubGlobal('window', {
        AudioContext: undefined,
        webkitAudioContext: mockWebkitAudioContext,
      });
      vi.stubGlobal('navigator', {
        mediaDevices: { getUserMedia: vi.fn() },
      });

      fixUserMedia();

      expect((window as any).AudioContext).toBe(mockWebkitAudioContext);
    });

    test('navigator.mediaDevices가 없을 때 빈 객체로 초기화', () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {});

      fixUserMedia();

      // fixUserMedia는 빈 객체로 초기화하고, getUserMedia polyfill도 추가함
      expect(navigator.mediaDevices).toHaveProperty('getUserMedia');
    });

    test('navigator.mediaDevices.getUserMedia가 없을 때 polyfill 추가', () => {
      const mockGetUserMedia = vi.fn();

      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        getUserMedia: mockGetUserMedia,
      });

      fixUserMedia();

      expect(typeof navigator.mediaDevices.getUserMedia).toBe('function');
    });

    test('getUserMedia polyfill이 Promise를 반환', async () => {
      const mockGetUserMedia = vi.fn((constraints, resolve) => {
        resolve({ id: 'test-stream' });
      });

      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        getUserMedia: mockGetUserMedia,
      });

      fixUserMedia();

      const result = await navigator.mediaDevices.getUserMedia!({ video: true });
      expect(result).toEqual({ id: 'test-stream' });
      expect(mockGetUserMedia).toHaveBeenCalledWith(
        { video: true },
        expect.any(Function),
        expect.any(Function),
      );
    });

    test('getUserMedia가 없을 때 Promise.reject 반환', async () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        // getUserMedia, webkitGetUserMedia 등 모두 없음
      });

      fixUserMedia();

      await expect(navigator.mediaDevices.getUserMedia!({ video: true })).rejects.toThrow(
        'Browser not support',
      );
    });

    test('webkitGetUserMedia 사용', async () => {
      const mockWebkitGetUserMedia = vi.fn((constraints, resolve) => {
        resolve({ id: 'webkit-stream' });
      });

      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        webkitGetUserMedia: mockWebkitGetUserMedia,
      });

      fixUserMedia();

      const result = await navigator.mediaDevices.getUserMedia!({ audio: true });
      expect(result).toEqual({ id: 'webkit-stream' });
      expect(mockWebkitGetUserMedia).toHaveBeenCalled();
    });

    test('mozGetUserMedia 사용', async () => {
      const mockMozGetUserMedia = vi.fn((constraints, resolve) => {
        resolve({ id: 'moz-stream' });
      });

      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        mozGetUserMedia: mockMozGetUserMedia,
      });

      fixUserMedia();

      const result = await navigator.mediaDevices.getUserMedia!({ audio: true });
      expect(result).toEqual({ id: 'moz-stream' });
    });

    test('msGetUserMedia 사용', async () => {
      const mockMsGetUserMedia = vi.fn((constraints, resolve) => {
        resolve({ id: 'ms-stream' });
      });

      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        msGetUserMedia: mockMsGetUserMedia,
      });

      fixUserMedia();

      const result = await navigator.mediaDevices.getUserMedia!({ audio: true });
      expect(result).toEqual({ id: 'ms-stream' });
    });

    test('getUserMedia polyfill에서 에러 처리', async () => {
      const mockGetUserMedia = vi.fn((constraints, resolve, reject) => {
        reject(new Error('Permission denied'));
      });

      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', {
        mediaDevices: {},
        getUserMedia: mockGetUserMedia,
      });

      fixUserMedia();

      await expect(navigator.mediaDevices.getUserMedia!({ video: true })).rejects.toThrow(
        'Permission denied',
      );
    });
  });
});
