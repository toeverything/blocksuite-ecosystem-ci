import type { EditorContainer } from '@blocksuite/editor';
import type { Page, Workspace } from '@blocksuite/store';

declare global {
  interface Window {
    /** Available on playground window */
    $blocksuite: {
      // store: typeof import('../../packages/store/src/index.js');
      // blocks: typeof import('../../packages/blocks/src/index.js');
      // global: {
      //   utils: typeof import('../../packages/global/src/utils.js');
      // };
      // editor: typeof import('../../packages/editor/src/index.js');
    };
    workspace: Workspace;
    // ContentParser: typeof ContentParser;
    // blockSchema: Record<string, typeof BaseBlockModel>;
    page: Page;
    // debugMenu: DebugMenu;
    editor: EditorContainer;
    // root: BlockSuiteRoot;
    // testUtils: TestUtils;

    // TODO: remove this when provider support subdocument
    // subdocProviders: Map<string, DocProvider[]>;
  }
}
