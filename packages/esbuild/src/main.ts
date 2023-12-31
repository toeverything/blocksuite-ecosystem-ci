import '@blocksuite/presets/themes/affine.css';
import { createEmptyPage, DocEditor } from '@blocksuite/presets';
import './style.css';

main();

async function main() {
  const page = await createEmptyPage().init();
  const editor = new DocEditor();
  editor.page = page;
  document.querySelector('#root')!.append(editor);
}
