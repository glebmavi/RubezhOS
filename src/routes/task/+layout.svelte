<script lang="ts">
    import Header from "$lib/components/Header.svelte";
</script>

<div class="layout">
    <Header/>
    <slot/>
</div>

<style>
    :global(.main-block) {
        width: 100%;
		max-width: 600px;
		display: flex;
        padding: 0.1rem 1rem;
        box-sizing: border-box;
    }
    :global(.markdown) {
		font-size: 0.9rem;
	}
    :global(.markdown h2, .markdown h3) {
        font-weight: normal;
	}
</style>