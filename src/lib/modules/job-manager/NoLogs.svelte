<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  let {
    message,
  }: {
    message: string;
  } = $props();
</script>

<div>
  <p class="message">{message}</p>
  <img
    src="/brand-icons/screen-with-code.svg"
    alt="A screen with code"
    aria-hidden="true"
  />
</div>

<style>
  div {
    padding: var(--tmp-dimension-spacing-block-l)
      var(--tmp-dimension-spacing-inline-l);
    font: var(--tmp-typography-code-s);
    background-color: var(--tmp-color-background-alt);
    grid-row: 1 / -1;

    .message {
      margin-block-end: var(--tmp-dimension-spacing-block-xs);
    }
  }
</style>
