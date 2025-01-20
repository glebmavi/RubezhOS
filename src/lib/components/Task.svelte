<script lang="ts">
	export let title: string;
	export let description: string; // or an object, or a slot for more complicated content
</script>

<div class="task-wrapper">
	<h2>{title}</h2>
	<div class="description">
		{description}
	</div>

	<!-- Everything else (inputs, outputs) is a slot so we can place them below -->
	<slot />
</div>

<style>
	.task-wrapper {
		width: 100%;
		max-width: 600px;
		margin: 1rem auto;
	}
	.description {
		margin: 1rem 0;
	}
</style>
