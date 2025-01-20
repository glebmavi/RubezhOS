<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task1Store, type TaskData1 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_1.jpg'
	import { marked } from 'marked';

	let taskData: TaskData;
	task1Store.subscribe((data) => (taskData = data));

	let result = '';
	$: markdownHTML = marked(result);

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
		res += `### Размер диска в байтах:\n`;
		const disk_size = Number(data.C) * 1024**3;
		res += `\`disk_size\` = ${data.C} * 1024^3 = ${disk_size}\n`;
		
		res += '### Количество stripe units на 1 диске:\n';
		const stripes = disk_size / (Number(data.D) * Number(data.E));
		res += `\`stripes\` = \`disk_size\` / ( ${data.D} * ${data.E} ) = ${stripes}\n`;

		res += '### Количество блоков на 1 диске:\n';
		const block_count = stripes * Number(data.E);
		res += `block_count = stripes * ${data.E} = ${block_count}\n`;

		const RaidLevel = data.A;
		switch (RaidLevel) {
			case "0":
				return '### RAID 0: не восстанавливается';
			case "1":
				return res += raid1(data, block_count, stripes);
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
				return "## Invalid Raid Level";
		}
	}

	function raid1(data: TaskData, block_count: number, stripes: number) {
		let res = '### RAID 1: вычисления паритета не нужно\n';
		res += `### "Живых" дисков осталось N - 1: B - 1 = ${Number(data.B) - 1}\n`;

		res += '### Время чтения: (Если последовательно)\n';
		const read_time_seq = block_count * Number(data.F) * (Number(data.B) - 1);
		res += `read_time_seq = block_count * ${data.F} * ( ${data.B} - 1 ) = ${read_time_seq}\n`;

		res += '### Время чтения: (Если параллельно)\n';
		const read_time_par = stripes * Number(data.E) * Number(data.F);
		res += `read_time_par = stripes * ${data.E} * ${data.F} = ${read_time_par}\n`;

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
	<div class="markdown">
		{@html markdownHTML}
	</div>
</OutputBlock>

<style>
	.markdown {
		font-size: 0.9rem;
	}
</style>
