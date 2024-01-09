import { Component } from '@angular/core';
import { createEmptyPage, DocEditor } from '@blocksuite/presets';
import '@blocksuite/presets/themes/affine.css';

console.assert(DocEditor !== undefined);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-blocksuite';

  async ngOnInit() {
    const page = await createEmptyPage().init();
    const editor = new DocEditor();
    const container = document.querySelector('.container') as HTMLElement;
    editor.page = page;
    container.appendChild(editor);
  }
}

