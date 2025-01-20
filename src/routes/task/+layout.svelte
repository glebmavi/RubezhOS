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
    }
</style>