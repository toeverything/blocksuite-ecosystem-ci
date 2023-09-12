<script setup lang="ts">
import { Schema, Workspace } from '@blocksuite/store'
import { AffineSchemas } from '@blocksuite/blocks/models'
import { EditorContainer } from '@blocksuite/editor'

const container = ref<HTMLDivElement>()

const schema = new Schema()
schema.register(AffineSchemas)
const workspace = new Workspace({
  id: 'workspace',
  schema,
})
const editor = new EditorContainer()

const page = workspace.createPage({
  id: 'index',
})
await page.waitForLoaded()
const pageBlockId = page.addBlock('affine:page', {
  title: new Text(),
})
page.addBlock('affine:surface', {}, pageBlockId)
const frameId = page.addBlock('affine:note', {}, pageBlockId)
page.addBlock('affine:paragraph', {}, frameId)
page.resetHistory()

editor.page = page
editor.mode = 'page'

onMounted(() => {
  container.value!.append(editor)
})
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
