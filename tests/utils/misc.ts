import { ConsoleMessage, Page, expect } from '@playwright/test';
import { currentEditorIndex, multiEditor } from './multiple-editor';
import { EditorContainer } from '@blocksuite/editor';

export const defaultPlaygroundURL = new URL(`http://localhost:5173/starter/`);

const NEXT_FRAME_TIMEOUT = 100;
const DEFAULT_PLAYGROUND = defaultPlaygroundURL.toString();
const RICH_TEXT_SELECTOR = '.virgo-editor';

function generateRandomRoomId() {
  return `playwright-${Math.random().toFixed(8).substring(2)}`;
}
export async function enterPlaygroundRoom(
  page: Page,
  ops?: {
    flags?: Record<string, unknown>; // Partial<BlockSuiteFlags>;
    room?: string;
    blobStorage?: ('memory' | 'idb' | 'mock')[];
    noInit?: boolean;
  }
) {
  const url = new URL(DEFAULT_PLAYGROUND);
  let room = ops?.room;
  const blobStorage = ops?.blobStorage;
  if (!room) {
    room = generateRandomRoomId();
  }
  url.searchParams.set('room', room);
  url.searchParams.set('blobStorage', blobStorage?.join(',') || 'idb');
  await page.goto(url.toString());
  const readyPromise = waitForPageReady(page);

  // See https://github.com/microsoft/playwright/issues/5546
  // See https://github.com/microsoft/playwright/discussions/17813
  page.on('console', message => {
    const ignore = isIgnoredLog(message) || !process.env.CI;
    if (!ignore) {
      expect
        .soft('Unexpected console message: ' + message.text())
        .toBe(
          'Please remove the "console.log" or declare `expectConsoleMessage` before `enterPlaygroundRoom`. It is advised not to output logs in a production environment.'
        );
    }
    console.log(`Console ${message.type()}: ${message.text()}`);
  });

  // Log all uncaught errors
  page.on('pageerror', exception => {
    throw new Error(`Uncaught exception: "${exception}"\n${exception.stack}`);
  });

  await initEmptyEditor({
    page,
    flags: ops?.flags,
    noInit: ops?.noInit,
    multiEditor,
  });

  await readyPromise;

  await page.evaluate(() => {
    if (typeof window.$blocksuite !== 'object') {
      throw new Error('window.$blocksuite is not object');
    }
  }, []);
  return room;
}

type TaggedConsoleMessage = ConsoleMessage & { __ignore?: boolean };
function isIgnoredLog(
  message: ConsoleMessage
): message is TaggedConsoleMessage {
  return '__ignore' in message && !!message.__ignore;
}

export async function waitForPageReady(page: Page) {
  await page.evaluate(async () => {
    return new Promise<void>(resolve => {
      window.addEventListener('blocksuite:page-ready', () => resolve(), {
        once: true,
      });
    });
  });
}

/**
 * @example
 * ```ts
 * await initEmptyEditor(page, { enable_some_flag: true });
 * ```
 */
async function initEmptyEditor({
  page,
  flags = {},
  noInit = false,
  multiEditor = false,
}: {
  page: Page;
  flags?: Partial<BlockSuiteFlags>;
  noInit?: boolean;
  multiEditor?: boolean;
}) {
  await page.evaluate(
    ([flags, noInit, multiEditor]) => {
      const { workspace } = window;

      async function initPage(page: ReturnType<typeof workspace.createPage>) {
        page.load();
        for (const [key, value] of Object.entries(flags)) {
          page.awarenessStore.setFlag(key as keyof typeof flags, value);
        }
        // add app root from https://github.com/toeverything/blocksuite/commit/947201981daa64c5ceeca5fd549460c34e2dabfa
        const appRoot = document.querySelector('#app');
        if (!appRoot) {
          throw new Error('Cannot find app root element(#app).');
        }
        const createEditor = () => {
          const editor = document.createElement(
            'editor-container'
          ) as EditorContainer;
          editor.page = page;
          editor.autofocus = true;
          editor.slots.pageLinkClicked.on(({ pageId }) => {
            const newPage = workspace.getPage(pageId);
            if (!newPage) {
              throw new Error(`Failed to jump to page ${pageId}`);
            }
            editor.page = newPage;
          });
          appRoot.append(editor);
          editor.createBlockHub().then(blockHub => {
            document.body.appendChild(blockHub);
          });
          return editor;
        };
        const editor = createEditor();
        if (multiEditor) createEditor();

        window.editor = editor;
        window.page = page;
        window.dispatchEvent(
          new CustomEvent('blocksuite:page-ready', { detail: page.id })
        );
      }

      if (noInit) {
        workspace.meta.pageMetas.forEach(meta => {
          const pageId = meta.id;
          const page = workspace.getPage(pageId);
          if (page) {
            initPage(page);
          }
        });
        workspace.slots.pageAdded.on(pageId => {
          const page = workspace.getPage(pageId);
          if (!page) {
            throw new Error(`Failed to get page ${pageId}`);
          }
          initPage(page);
        });
      } else {
        const page = workspace.createPage({ id: 'page:home' });
        initPage(page);
      }
    },
    [flags, noInit, multiEditor] as const
  );
  await waitNextFrame(page);
}

export async function waitNextFrame(
  page: Page,
  frameTimeout = NEXT_FRAME_TIMEOUT
) {
  await page.waitForTimeout(frameTimeout);
}

// XXX: This doesn't add surface yet, the page state should not be switched to edgeless.
export async function initEmptyParagraphState(page: Page, pageId?: string) {
  const ids = await page.evaluate(async pageId => {
    const { page } = window;
    page.captureSync();
    if (!pageId) {
      pageId = page.addBlock('affine:page', {
        title: new page.Text(),
      });
    }

    const noteId = page.addBlock('affine:note', {}, pageId);
    const paragraphId = page.addBlock('affine:paragraph', {}, noteId);
    // page.addBlock('affine:surface', {}, pageId);
    page.captureSync();

    return { pageId, noteId, paragraphId };
  }, pageId);
  return ids;
}

type FocusRichTextOptions = {
  clickPosition?: { x: number; y: number };
};

const getEditorLocator = (page: Page) => {
  return page.locator('editor-container').nth(currentEditorIndex);
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
