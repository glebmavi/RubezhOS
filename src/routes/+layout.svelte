<script lang="ts">
    export let title = "Рубежка ОС 2024-2025";
    export let description = "Решение задач рубежки по Операционным Системам";
  </script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- Layout wrapper -->
<div class="layout">
	<slot />
</div>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        min-height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        line-height: 1.2;
    }

    :global(.layout) {
        display: flex;
        flex-direction: column;
        align-items: center; /* horizontally center content */
        width: 100vw;        /* stretch to window width */
        min-height: 100vh;   /* ensure full height */
        box-sizing: border-box;
        padding: 0.1rem 1rem;
    }
</style>
