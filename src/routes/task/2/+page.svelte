<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task2Store, type TaskData2 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_2.jpg'
	import { marked } from 'marked';

	const taskIdx = 1;
	let taskData: TaskData;
	task2Store.subscribe((data) => (taskData = data));

	let result = '';
	$: result = task(taskData);
	$: markdownHTML = marked(result);
	
	function verify(data: TaskData): boolean { /*All values in this task are numbers*/
		for (const value of Object.values(data)) {
			if (isNaN(Number(value))) {
				return false;
			}
		}
		return true;
	}

	function task(data: TaskData) {
		if (!verify(data)) {
			return 'Invalid input, all values should be numerical';
		}

		let res = '';
		res += `### `

		return res;
	}

	function handleInputChange(label: string, value: string) {
		task2Store.update(current => ({ ...current, [label]: value }));
	}
</script>

<Task title={tasks[taskIdx].name}>
	<img src={img} alt="" style="width: 90%;" />
</Task>
<InputBlock 
	labels={['A', 'B', 'C', 'D']}
	values={taskData}
	onInputChange={handleInputChange}
	inputType={tasks[taskIdx].inputType}
/>
<!-- Output (the calculation) -->
<OutputBlock>
	<div class="markdown">
		{@html markdownHTML}
	</div>
</OutputBlock>

<style>
	.markdown {
		font-size: 0.9rem;
	}
</style>