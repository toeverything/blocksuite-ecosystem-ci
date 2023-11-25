import Head from 'next/head';
import { useRef, useState } from 'react';
import { useOnceEffect } from '@reactuses/core';
import '@blocksuite/editor/themes/affine.css';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useOnceEffect(() => {
    (async () => {
      const { Schema, Workspace } = await import('@blocksuite/store');
      const { AffineSchemas } = await import('@blocksuite/blocks/models');
      const { EditorContainer } = await import('@blocksuite/editor');

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

      setLoading(false);
      ref.current?.append(editor);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Blocksuite + Next.js</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && <span>Loading</span>}
      <div id="app" ref={ref}></div>
    </>
  );
}
