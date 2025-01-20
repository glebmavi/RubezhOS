<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task1Store } from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_1.jpg'
	import { get } from 'svelte/store';

	let taskData: { inputA: string, inputB: string, inputC: string, inputD: string, inputE: string, inputF: string, inputG: string, inputH: string };
	task1Store.subscribe((data) => (taskData = data));

	// Example of a derived output or calculation 
	// (for demonstration; in reality, you'd do your real calculation logic):
	// $: result = calculateSomething(taskData.inputA, taskData.inputB);
	$: result = "Not implemented yet";

	function calculateSomething(a, b) {
		if (!a || !b) return "No result (missing inputs).";
		// Example: Concatenate or parse them as numbers, etc.
		const sum = (parseFloat(a) || 0) + (parseFloat(b) || 0);
		return `Sum of A and B = ${sum}`;
	}

	function handleInputChange(label: string, value: string) {
		task1Store.update(current => ({ ...current, [label]: value }));
	}
</script>

<Task title={tasks[0].name}>
	<img src={img} alt="" style="width: 90%;" />
</Task>
<!-- Inputs -->
<InputBlock 
	labels={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']}
	values={taskData}
	onInputChange={handleInputChange}
/>
<!-- Output (the calculation) -->
<OutputBlock>
	{result}
</OutputBlock>
