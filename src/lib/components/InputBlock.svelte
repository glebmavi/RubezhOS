<script lang="ts">
	export let labels: string[] = [];
	// an object or array representing input fields
	// You might pass in a store or bind values to it in the parent
	export let values: { [key: string]: string };
	export let onInputChange: (name: string, value: string) => void;
</script>

<div class="input-block">
	{#each labels as label, i}
		<div class="input-row">
			<label for="input-{i}">{label}</label>
			<input
				id="input-{i}"
				type="text"
				bind:value={values[label]}
				on:input={(e) => onInputChange(label, (e.target as HTMLInputElement).value)}
			/>
		</div>
	{/each}
    <div>
        {#if labels.filter(label => !values[label]).length > 0}
            <p class="warning">Values missing: {labels.filter(label => !values[label]).join(', ')}</p>
        {/if}
    </div>
</div>

<style>
	.input-block {
		margin-bottom: 1rem;
	}
	.input-row {
		display: flex;
		flex-direction: column;
		margin: 0.5rem 0;
	}
	label {
		font-weight: bold;
		margin-bottom: 0.25rem;
	}
	input {
		padding: 0.5rem;
		font-size: 1rem;
	}
</style>
