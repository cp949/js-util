import { describe, test, expect } from 'vitest';
import { fileExtension } from '../../../src/pfile/fileExtension.js';
import { fileNamePart } from '../../../src/pfile/fileNamePart.js';

describe('pfile - file functions', () => {
  describe('fileExtension', () => {
    test('기본 확장자 추출', () => {
      expect(fileExtension('test.txt')).toBe('txt');
      expect(fileExtension('image.jpg')).toBe('jpg');
      expect(fileExtension('archive.tar.gz')).toBe('gz');
      expect(fileExtension('script.js')).toBe('js');
    });

    test('확장자가 없는 파일', () => {
      expect(fileExtension('README')).toBeNull();
      expect(fileExtension('Makefile')).toBeNull();
      expect(fileExtension('file-without-extension')).toBeNull();
    });

    test('숨김 파일 처리', () => {
      expect(fileExtension('.gitignore')).toBe('gitignore');
      expect(fileExtension('.env.example')).toBe('example');
      expect(fileExtension('.hidden')).toBe('hidden');
    });

    test('복수 점이 있는 파일명', () => {
      expect(fileExtension('file.name.with.dots.txt')).toBe('txt');
      expect(fileExtension('jquery.min.js')).toBe('js');
      expect(fileExtension('data.backup.2023.json')).toBe('json');
    });

    test('lowerCase 옵션', () => {
      expect(fileExtension('FILE.TXT', true)).toBe('txt');
      expect(fileExtension('IMAGE.JPG', true)).toBe('jpg');
      expect(fileExtension('SCRIPT.JS', true)).toBe('js');
      expect(fileExtension('file.PDF', true)).toBe('pdf');
    });

    test('lowerCase 옵션 비활성화', () => {
      expect(fileExtension('FILE.TXT', false)).toBe('TXT');
      expect(fileExtension('IMAGE.JPG', false)).toBe('JPG');
      expect(fileExtension('file.PDF', false)).toBe('PDF');
    });

    test('withDot 옵션', () => {
      expect(fileExtension('test.txt', false, true)).toBe('.txt');
      expect(fileExtension('image.jpg', false, true)).toBe('.jpg');
      expect(fileExtension('FILE.TXT', true, true)).toBe('.txt');
    });

    test('withDot과 lowerCase 조합', () => {
      expect(fileExtension('FILE.TXT', true, true)).toBe('.txt');
      expect(fileExtension('IMAGE.JPG', true, true)).toBe('.jpg');
      expect(fileExtension('SCRIPT.JS', false, true)).toBe('.JS');
    });

    test('빈 확장자 처리', () => {
      expect(fileExtension('file.')).toBe('');
      expect(fileExtension('file.', false, true)).toBeNull();
      expect(fileExtension('test.file.')).toBe('');
    });

    test('특수 문자가 포함된 파일명', () => {
      expect(fileExtension('file name.txt')).toBe('txt');
      expect(fileExtension('file-name_test.js')).toBe('js');
      expect(fileExtension('파일명.jpg')).toBe('jpg');
      expect(fileExtension('file@#$.pdf')).toBe('pdf');
    });

    test('경로가 포함된 파일명', () => {
      expect(fileExtension('/path/to/file.txt')).toBe('txt');
      expect(fileExtension('C:\\Users\\test\\file.doc')).toBe('doc');
      expect(fileExtension('./relative/path/file.js')).toBe('js');
    });

    test('매우 긴 확장자', () => {
      const longExt = 'a'.repeat(100);
      expect(fileExtension(`file.${longExt}`)).toBe(longExt);
      expect(fileExtension(`file.${longExt}`, true, true)).toBe(`.${longExt}`);
    });

    test('빈 문자열 처리', () => {
      expect(fileExtension('')).toBeNull();
    });

    test('점으로만 구성된 파일명', () => {
      expect(fileExtension('.')).toBeNull();
      expect(fileExtension('..')).toBe('');
      expect(fileExtension('...')).toBe('');
    });
  });

  describe('fileNamePart', () => {
    test('기본 파일명 부분 추출', () => {
      expect(fileNamePart('test.txt')).toBe('test');
      expect(fileNamePart('image.jpg')).toBe('image');
      expect(fileNamePart('script.js')).toBe('script');
    });

    test('확장자가 없는 파일', () => {
      expect(fileNamePart('README')).toBe('README');
      expect(fileNamePart('Makefile')).toBe('Makefile');
      expect(fileNamePart('file-without-extension')).toBe('file-without-extension');
    });

    test('복수 점이 있는 파일명', () => {
      expect(fileNamePart('file.name.with.dots.txt')).toBe('file.name.with.dots');
      expect(fileNamePart('jquery.min.js')).toBe('jquery.min');
      expect(fileNamePart('data.backup.2023.json')).toBe('data.backup.2023');
    });

    test('숨김 파일 처리', () => {
      expect(fileNamePart('.gitignore')).toBe('');
      expect(fileNamePart('.env.example')).toBe('.env');
      expect(fileNamePart('.hidden')).toBe('');
    });

    test('점으로 시작하는 파일명', () => {
      expect(fileNamePart('.file.txt')).toBe('.file');
      expect(fileNamePart('..hidden.js')).toBe('..hidden');
    });

    test('빈 확장자가 있는 파일', () => {
      expect(fileNamePart('file.')).toBe('file');
      expect(fileNamePart('test.file.')).toBe('test.file');
    });

    test('특수 문자가 포함된 파일명', () => {
      expect(fileNamePart('file name.txt')).toBe('file name');
      expect(fileNamePart('file-name_test.js')).toBe('file-name_test');
      expect(fileNamePart('파일명.jpg')).toBe('파일명');
      expect(fileNamePart('file@#$.pdf')).toBe('file@#$');
    });

    test('경로가 포함된 파일명', () => {
      expect(fileNamePart('/path/to/file.txt')).toBe('/path/to/file');
      expect(fileNamePart('C:\\Users\\test\\file.doc')).toBe('C:\\Users\\test\\file');
      expect(fileNamePart('./relative/path/file.js')).toBe('./relative/path/file');
    });

    test('빈 문자열 처리', () => {
      expect(fileNamePart('')).toBe('');
    });

    test('점으로만 구성된 파일명', () => {
      expect(fileNamePart('.')).toBe('.');
      expect(fileNamePart('..')).toBe('.');
      expect(fileNamePart('...')).toBe('..');
    });

    test('점이 맨 앞에만 있는 경우', () => {
      expect(fileNamePart('.file')).toBe('');
      expect(fileNamePart('..file')).toBe('.');
    });
  });

  describe('edge cases', () => {
    test('매우 긴 파일명 처리', () => {
      const longFileName = 'a'.repeat(1000);
      const longFileWithExt = longFileName + '.txt';

      expect(fileExtension(longFileWithExt)).toBe('txt');
      expect(fileNamePart(longFileWithExt)).toBe(longFileName);
    });

    test('유니코드 문자 처리', () => {
      expect(fileExtension('테스트.한글')).toBe('한글');
      expect(fileNamePart('테스트.한글')).toBe('테스트');
      expect(fileExtension('файл.рус')).toBe('рус');
      expect(fileNamePart('файл.рус')).toBe('файл');
    });

    test('이모지가 포함된 파일명', () => {
      expect(fileExtension('🦄unicorn.txt')).toBe('txt');
      expect(fileNamePart('🦄unicorn.txt')).toBe('🦄unicorn');
      expect(fileExtension('file.🎉')).toBe('🎉');
      expect(fileNamePart('file.🎉')).toBe('file');
    });

    test('특수 공백 문자 처리', () => {
      const specialSpace = '\u00A0'; // non-breaking space
      expect(fileExtension(`file${specialSpace}.txt`)).toBe('txt');
      expect(fileNamePart(`file${specialSpace}.txt`)).toBe(`file${specialSpace}`);
    });
  });

  describe('일관성 테스트', () => {
    test('fileExtension과 fileNamePart의 일관성', () => {
      const testFiles = [
        'test.txt',
        'image.jpg',
        'script.min.js',
        'data.backup.json',
        '.gitignore',
        'README',
        'file.',
      ];

      testFiles.forEach((fileName) => {
        const extension = fileExtension(fileName);
        const namePart = fileNamePart(fileName);

        if (extension && extension.length > 0) {
          // 확장자가 있는 경우 원본을 재구성할 수 있어야 함
          const reconstructed = namePart + '.' + extension;
          expect(reconstructed).toBe(fileName);
        } else if (fileName.includes('.') && fileName.lastIndexOf('.') > 0) {
          // 빈 확장자가 있는 경우
          expect(namePart + '.').toBe(fileName);
        } else {
          // 확장자가 없는 경우
          expect(namePart).toBe(fileName);
        }
      });
    });

    test('옵션 조합의 일관성', () => {
      const testFile = 'TEST.TXT';

      // lowerCase와 withDot 옵션이 올바르게 적용되는지 확인
      expect(fileExtension(testFile, false, false)).toBe('TXT');
      expect(fileExtension(testFile, true, false)).toBe('txt');
      expect(fileExtension(testFile, false, true)).toBe('.TXT');
      expect(fileExtension(testFile, true, true)).toBe('.txt');
    });
  });

  describe('성능 테스트', () => {
    test('대량 파일명 처리', () => {
      const fileNames = Array.from({ length: 1000 }, (_, i) => `file${i}.txt`);
      const start = performance.now();

      fileNames.forEach((fileName) => {
        fileExtension(fileName);
        fileNamePart(fileName);
      });

      const end = performance.now();
      expect(end - start).toBeLessThan(50);
    });
  });
});
