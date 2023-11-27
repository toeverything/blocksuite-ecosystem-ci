import { test } from '@playwright/test';

import { focusRichText } from '../../../tests/utils/misc';
import {
  redoByKeyboard,
  type,
  undoByKeyboard,
} from '../../../tests/utils/keyboard';
import { assertText, assertEmpty } from '../../../tests/utils/asserts';

const TEST_URL = `http://localhost:3002`;

test.describe('nuxt build test', () => {
  test('basic input & undo/redo', async ({ page }) => {
    await page.goto(TEST_URL);

    await focusRichText(page);
    await type(page, 'hello');

    await assertText(page, 'hello');
    await undoByKeyboard(page);
    await assertEmpty(page);
    await redoByKeyboard(page);
    await assertText(page, 'hello');
  });
});
