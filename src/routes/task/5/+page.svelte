<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';

	import { task5Store } from '$lib/stores/tasksStore';

	import { get } from 'svelte/store';

	let taskData;
	task5Store.subscribe((data) => (taskData = data));

	// Example of a derived output or calculation 
	// (for demonstration; in reality, you'd do your real calculation logic):
	$: result = calculateSomething(taskData.inputA, taskData.inputB);

	function calculateSomething(a, b) {
		if (!a || !b) return "No result (missing inputs).";
		// Example: Concatenate or parse them as numbers, etc.
		const sum = (parseFloat(a) || 0) + (parseFloat(b) || 0);
		return `Sum of A and B = ${sum}`;
	}

	function handleInputChange(name, value) {
		task5Store.update(current => ({ ...current, [name]: value }));
	}
</script>

<Task
	title="Task 1"
	description="This is the description for Task 1. You can put text or images here."
>
	<!-- Inputs -->
	<InputBlock 
		labels={['inputA', 'inputB']}
		values={taskData}
		onInputChange={handleInputChange}
	/>

	<!-- Output (the calculation) -->
	<OutputBlock>
        {result}
    </OutputBlock>

</Task>
