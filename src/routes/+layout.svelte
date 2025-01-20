<script lang="ts">
</script>

<!-- Layout wrapper -->
<div class="layout">
	<slot />
</div>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        min-height: 100%;
        font-family: sans-serif;
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
