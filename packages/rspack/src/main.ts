import '@blocksuite/presets/themes/affine.css';
import { createEmptyPage, DocEditor } from '@blocksuite/presets';
import './style.css';

main();

function main() {
  const page = createEmptyPage().init();
  const editor = new DocEditor();
  editor.page = page;
  document.querySelector('#root')?.append(editor);
}
