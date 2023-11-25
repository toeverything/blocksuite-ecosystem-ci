<script setup lang="ts">
import { Schema, Workspace } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks/models';
import { EditorContainer } from '@blocksuite/editor';
import '@blocksuite/editor/themes/affine.css';

const container = ref<HTMLDivElement>();
const schema = new Schema();
schema.register(AffineSchemas);
const workspace = new Workspace({
  id: 'test',
  schema,
});
const page = workspace.createPage({
  id: 'page0',
});
await page.load(() => {
  const pageBlockId = page.addBlock('affine:page');
  page.addBlock('affine:surface', {}, pageBlockId);
  const noteId = page.addBlock('affine:note', {}, pageBlockId);
  page.addBlock('affine:paragraph', {}, noteId);
  page.resetHistory();
});

const editor = new EditorContainer();
editor.page = page;

onMounted(() => {
  container.value!.append(editor);
});
</script>

<template>
  <div ref="container" class="editor-container" />
</template>

<style scoped>
.editor-container {
  width: 100vw;
  height: 100vh;
}
</style>
