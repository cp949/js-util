import { describe, test, expect } from 'vitest';
import { fileExtension, fileNamePart } from '../../../src/pfile/index.js';

describe('pfile 모듈', () => {
  describe('fileExtension', () => {
    test('기본 파일 확장자 추출', () => {
      expect(fileExtension('document.pdf')).toBe('pdf');
      expect(fileExtension('image.jpg')).toBe('jpg');
      expect(fileExtension('script.js')).toBe('js');
      expect(fileExtension('style.css')).toBe('css');
    });

    test('확장자가 없는 파일', () => {
      expect(fileExtension('README')).toBe(null);
      expect(fileExtension('Makefile')).toBe(null);
      expect(fileExtension('filename')).toBe(null);
      expect(fileExtension('')).toBe(null);
    });

    test('숨김 파일 처리', () => {
      expect(fileExtension('.gitignore')).toBe('gitignore');
      expect(fileExtension('.env')).toBe('env');
      expect(fileExtension('.htaccess')).toBe('htaccess');
      expect(fileExtension('.vscode')).toBe('vscode');
    });

    test('여러 점이 있는 파일명', () => {
      expect(fileExtension('archive.tar.gz')).toBe('gz');
      expect(fileExtension('my.test.js')).toBe('js');
      expect(fileExtension('file.backup.2023.bak')).toBe('bak');
      expect(fileExtension('component.d.ts')).toBe('ts');
    });

    test('lowerCase 옵션', () => {
      expect(fileExtension('Document.PDF')).toBe('PDF');
      expect(fileExtension('Document.PDF', true)).toBe('pdf');
      expect(fileExtension('Image.JPG', true)).toBe('jpg');
      expect(fileExtension('STYLE.CSS', true)).toBe('css');
      expect(fileExtension('script.JS', false)).toBe('JS');
    });

    test('withDot 옵션', () => {
      expect(fileExtension('document.pdf', false, true)).toBe('.pdf');
      expect(fileExtension('image.jpg', false, true)).toBe('.jpg');
      expect(fileExtension('README', false, true)).toBe(null);
      expect(fileExtension('filename', false, true)).toBe(null);
    });

    test('lowerCase와 withDot 동시 사용', () => {
      expect(fileExtension('Document.PDF', true, true)).toBe('.pdf');
      expect(fileExtension('Image.JPG', true, true)).toBe('.jpg');
      expect(fileExtension('ARCHIVE.TAR.GZ', true, true)).toBe('.gz');
    });

    test('빈 확장자나 잘못된 형식', () => {
      expect(fileExtension('file.')).toBe(''); // 빈 확장자는 빈 문자열 반환
      expect(fileExtension('file.', false, true)).toBe(null); // withDot=true이고 빈 확장자면 null
      expect(fileExtension('.')).toBe(null); // 점만 있는 경우는 null
      expect(fileExtension('.', false, true)).toBe(null);
    });

    test('특수 문자가 포함된 파일명', () => {
      expect(fileExtension('my-file.txt')).toBe('txt');
      expect(fileExtension('file_name.doc')).toBe('doc');
      expect(fileExtension('파일명.한글')).toBe('한글');
      expect(fileExtension('file name.pdf')).toBe('pdf');
      expect(fileExtension('file@2x.png')).toBe('png');
      expect(fileExtension('(backup).zip')).toBe('zip');
    });

    test('경로가 포함된 파일명', () => {
      expect(fileExtension('/path/to/file.txt')).toBe('txt');
      expect(fileExtension('\\Windows\\Path\\file.exe')).toBe('exe');
      expect(fileExtension('folder/subfolder/document.pdf')).toBe('pdf');
    });

    test('매우 긴 확장자', () => {
      expect(fileExtension('file.verylongextension')).toBe('verylongextension');
      expect(fileExtension('file.a')).toBe('a');
    });
  });

  describe('fileNamePart', () => {
    test('기본 파일명 부분 추출', () => {
      expect(fileNamePart('document.pdf')).toBe('document');
      expect(fileNamePart('image.jpg')).toBe('image');
      expect(fileNamePart('script.js')).toBe('script');
      expect(fileNamePart('my-file.txt')).toBe('my-file');
    });

    test('확장자가 없는 파일', () => {
      expect(fileNamePart('README')).toBe('README');
      expect(fileNamePart('Makefile')).toBe('Makefile');
      expect(fileNamePart('filename')).toBe('filename');
    });

    test('숨김 파일 처리', () => {
      expect(fileNamePart('.gitignore')).toBe(''); // 숨김 파일의 이름 부분은 빈 문자열
      expect(fileNamePart('.env')).toBe('');
      expect(fileNamePart('.htaccess')).toBe('');
    });

    test('여러 점이 있는 파일명 (마지막 점 기준)', () => {
      expect(fileNamePart('archive.tar.gz')).toBe('archive.tar');
      expect(fileNamePart('my.test.js')).toBe('my.test');
      expect(fileNamePart('file.backup.2023.bak')).toBe('file.backup.2023');
      expect(fileNamePart('component.d.ts')).toBe('component.d');
    });

    test('빈 문자열과 점만 있는 경우', () => {
      expect(fileNamePart('')).toBe('');
      expect(fileNamePart('.')).toBe('.'); // dotIdx === 0이므로 전체 반환
      expect(fileNamePart('..')).toBe('.');  // 마지막 점의 위치가 1
    });

    test('특수 문자가 포함된 파일명', () => {
      expect(fileNamePart('my-file.txt')).toBe('my-file');
      expect(fileNamePart('file_name.doc')).toBe('file_name');
      expect(fileNamePart('파일명.한글')).toBe('파일명');
      expect(fileNamePart('file name.pdf')).toBe('file name');
      expect(fileNamePart('file@2x.png')).toBe('file@2x');
      expect(fileNamePart('(backup).zip')).toBe('(backup)');
    });

    test('경로가 포함된 파일명', () => {
      expect(fileNamePart('/path/to/file.txt')).toBe('/path/to/file');
      expect(fileNamePart('\\Windows\\Path\\file.exe')).toBe('\\Windows\\Path\\file');
      expect(fileNamePart('folder/subfolder/document.pdf')).toBe('folder/subfolder/document');
    });

    test('복합 확장자 케이스', () => {
      expect(fileNamePart('jquery.min.js')).toBe('jquery.min');
      expect(fileNamePart('bootstrap.bundle.min.css')).toBe('bootstrap.bundle.min');
      expect(fileNamePart('data.backup.sql')).toBe('data.backup');
    });

    test('확장자만 있는 파일', () => {
      expect(fileNamePart('file.')).toBe('file');
      expect(fileNamePart('test.')).toBe('test');
    });

    test('매우 긴 파일명', () => {
      const longFileName = 'very-very-long-file-name-with-many-characters-and-words';
      expect(fileNamePart(`${longFileName}.txt`)).toBe(longFileName);
    });

    test('유니코드 문자가 포함된 파일명', () => {
      expect(fileNamePart('파일명.txt')).toBe('파일명');
      expect(fileNamePart('файл.doc')).toBe('файл');
      expect(fileNamePart('文件名.pdf')).toBe('文件名');
      expect(fileNamePart('🎉celebration.jpg')).toBe('🎉celebration');
    });
  });
});