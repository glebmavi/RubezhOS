<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import {tasks} from '$lib/tasksInfo';
	import {task5Store, type TaskData5 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_5.jpg'
	import {marked} from 'marked';

	const taskIdx = 4;
	let taskData: TaskData;
	task5Store.subscribe((data) => (taskData = data));

	let result = '';
	$: result = task(taskData);
	$: markdownHTML = marked(result);

	function verify(data: TaskData): boolean { /* All values in this task are numbers */
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
		const cpu_frequency = Number(data.A);

		const register_time = 1 / cpu_frequency;
		const cache_time = Number(data.B);
		const local_memory_time = Number(data.C);
		const outer_memory_time = Number(data.D);

		const before_register_commands = Number(data.E);
		const before_cache_commands = Number(data.F);
		const before_local_memory_commands = Number(data.G);
		const before_outer_memory_commands = Number(data.H);

		const before_work_time =
				register_time * before_register_commands +
				cache_time * before_cache_commands +
				local_memory_time * before_local_memory_commands +
				outer_memory_time * before_outer_memory_commands;

		const after_register_commands = Number(data.E);
		const after_cache_commands = Number(data.F) + Number(data.G);
		const after_local_memory_commands = Number(data.H);
		const after_outer_memory_commands = 0;

		const after_work_time =
				register_time * after_register_commands +
				cache_time * after_cache_commands +
				local_memory_time * after_local_memory_commands +
				outer_memory_time * after_outer_memory_commands;

		const diff = before_work_time - after_work_time;

		return `
### Частота процессора:
${cpu_frequency} ГГц

### Время обращения:
${register_time} нс – регистры

${cache_time} нс – кэш

${local_memory_time} нс – local NUMA

${outer_memory_time} нс – other NUMA


### Количество обращений до:
${before_register_commands} – регистры

${before_cache_commands} – кэш

${before_local_memory_commands} – local

${before_outer_memory_commands} – other

### Количество обращений после:

${after_register_commands} – регистры

${after_cache_commands} – кэш

${after_local_memory_commands} – local

${after_outer_memory_commands} – other

###  Время работы программы до:
${before_register_commands} * 1 + ${before_cache_commands} * ${cache_time} + ${before_local_memory_commands} * ${local_memory_time} + ${before_outer_memory_commands} * ${outer_memory_time} = ${before_work_time} нс

### Время работы программы после:
${after_register_commands} * 1 + ${after_cache_commands} * ${cache_time} + ${after_local_memory_commands} * ${local_memory_time} + ${after_outer_memory_commands} * ${outer_memory_time} = ${after_work_time} нс

### Разница во времени работы:
${before_work_time} - ${after_work_time} = ${diff} нс

### Ответ:
${diff} нс
`;
	}
	function handleInputChange(label: string, value: string) {
		task5Store.update(current => ({...current, [label]: value}));

	}
</script>

<InputBlock
	labels={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']}
	values={taskData}
	onInputChange={handleInputChange}
	inputType={tasks[taskIdx].inputType}
/>
<OutputBlock>
	<div class="markdown">
		{@html markdownHTML}
	</div>
</OutputBlock>
<Task title={tasks[taskIdx].name}>
	<img src={img} alt="" style="width: 90%;" />
</Task>

<style>
	.markdown {
		font-size: 0.9rem;
	}
</style>
