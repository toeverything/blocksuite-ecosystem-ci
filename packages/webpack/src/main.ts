import { Schema, Workspace } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks/models';
import { EditorContainer } from '@blocksuite/editor';
import '@blocksuite/editor/themes/affine.css';
import './style.css';

main();

async function main() {
  const schema = new Schema();
  schema.register(AffineSchemas);
  const workspace = new Workspace({
    id: 'test',
    schema,
  });
  const page = workspace.createPage({
    id: 'page0',
  });
  page.load(() => {
    const pageBlockId = page.addBlock('affine:page');
    page.addBlock('affine:surface', {}, pageBlockId);
    const noteId = page.addBlock('affine:note', {}, pageBlockId);
    page.addBlock('affine:paragraph', {}, noteId);
    page.resetHistory();

    const editor = new EditorContainer();
    editor.page = page;
    document.querySelector('#root')!.append(editor);
  });
}
