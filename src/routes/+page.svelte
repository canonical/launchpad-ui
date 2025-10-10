<script>
  import { MarkdownEditor } from "$lib/components/MarkdownEditor";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>

<MarkdownEditor>
  <MarkdownEditor.Header>
    <MarkdownEditor.Toolbar />
  </MarkdownEditor.Header>
  <MarkdownEditor.Textarea rows={15} />
</MarkdownEditor>
