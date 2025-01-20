<script lang="ts">
	export let title: string;
</script>

<div class="task-wrapper main-block">
	<h2>{title}</h2>
	<slot/>
</div>

<style>
	.task-wrapper {
		flex-direction: column;
		align-items: center;
	}
	h2 {
		margin: 0 0 0.5rem;
	}
</style>
