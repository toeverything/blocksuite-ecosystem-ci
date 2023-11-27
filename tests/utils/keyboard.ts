import { Page } from '@playwright/test';

const IS_MAC = process.platform === 'darwin';
// const IS_WINDOWS = process.platform === 'win32';
// const IS_LINUX = !IS_MAC && !IS_WINDOWS;

/**
 * The key will be 'Meta' on Macs and 'Control' on other platforms
 * @example
 * ```ts
 * await page.keyboard.press(`${SHORT_KEY}+a`);
 * ```
 */
export const SHORT_KEY = IS_MAC ? 'Meta' : 'Control';

export async function type(page: Page, content: string, delay = 50) {
  await page.keyboard.type(content, { delay });
}

export async function undoByKeyboard(page: Page) {
  await page.keyboard.press(`${SHORT_KEY}+z`, { delay: 20 });
}

export async function redoByKeyboard(page: Page) {
  await page.keyboard.press(`${SHORT_KEY}+Shift+Z`, { delay: 20 });
}
