import { Page } from '@playwright/test';
import { currentEditorIndex } from './multiple-editor';

const RICH_TEXT_SELECTOR = '.inline-editor';

type FocusRichTextOptions = {
  clickPosition?: { x: number; y: number };
};

const getEditorLocator = (page: Page) => {
  return page.locator('doc-editor').nth(currentEditorIndex);
};

export async function focusRichText(
  page: Page,
  i = 0,
  options?: FocusRichTextOptions
) {
  await page.mouse.move(0, 0);
  const editor = getEditorLocator(page);
  const locator = editor.locator(RICH_TEXT_SELECTOR).nth(i);
  // need to set `force` to true when clicking on `affine-selected-blocks`
  await locator.click({ force: true, position: options?.clickPosition });
}

export async function waitNextFrame(page: Page, time = 1000) {
  await page.waitForTimeout(time);
}
