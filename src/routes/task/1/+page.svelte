<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task1Store, type TaskData1 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_1.jpg'
	import { get } from 'svelte/store';

	let taskData: TaskData;
	task1Store.subscribe((data) => (taskData = data));

	$: result = task(taskData);
	function verify(data: TaskData): boolean {
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
		res += 'Размер диска в байтах:<br>';
		const disk_size = Number(data.C) * 1024**3;
		res += `disk_size = ${data.C} * 1024^3 = ${disk_size}`;
		
		const RaidLevel = data.A;
		switch (RaidLevel) {
			case "0":
				res += raid0(data);
				return res;
			case "1":
				return res;
			case "2":
				return res;
			case "3":
				return res;
			case "4":
				return res;
			case "5":
				return res;
			case "6":
				return res;
			default:
				return "Invalid Raid Level";
		}
	}

	function raid0(data: TaskData) {
		let res = ' ';
		return res;
	}

	function handleInputChange(label: string, value: string) {
		task1Store.update(current => ({ ...current, [label]: value }));
	}
</script>

<Task title={tasks[0].name}>
	<img src={img} alt="" style="width: 90%;" />
</Task>
<InputBlock 
	labels={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']}
	values={taskData}
	onInputChange={handleInputChange}
/>
<!-- Output (the calculation) -->
<OutputBlock>
	{@html result}
</OutputBlock>
