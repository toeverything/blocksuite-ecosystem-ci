<script setup lang="ts">
import '@blocksuite/presets/themes/affine.css';
import { createEmptyPage, DocEditor } from '@blocksuite/presets';

const container = ref<HTMLDivElement>();
const page = createEmptyPage().init();
const editor = new DocEditor();
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
