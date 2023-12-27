import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { getStringFromRichText } from './virgo';
import { currentEditorIndex } from './multiple-editor';

export async function assertText(page: Page, text: string, i = 0) {
  const actual = await getStringFromRichText(page, i);
  expect(actual).toBe(text);
}

export async function assertEmpty(page: Page) {
  await assertRichTexts(page, ['']);
}

export async function assertRichTexts(page: Page, texts: string[]) {
  const actualTexts = await page.evaluate(currentEditorIndex => {
    const editorHost =
      document.querySelectorAll('editor-host')[currentEditorIndex];
    const richTexts = Array.from(
      editorHost?.querySelectorAll<any>('rich-text') ?? []
    );
    return richTexts.map(richText => {
      const editor = richText.inlineEditor;
      return editor.yText.toString();
    });
  }, currentEditorIndex);
  expect(actualTexts).toEqual(texts);
}
