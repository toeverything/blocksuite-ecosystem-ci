import process from 'node:process';

const editorIndex = {
  0: 0,
  1: 1,
}[process.env.MULTIPLE_EDITOR_INDEX ?? ''];

export const currentEditorIndex = editorIndex ?? 0;
