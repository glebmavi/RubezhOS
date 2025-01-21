<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task1Store, type TaskData1 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_1.jpg'
	import { marked } from 'marked';

	const taskIdx = 0;
	let taskData: TaskData;
	task1Store.subscribe((data) => (taskData = data));

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
		const disk_size = Number(data.C) * 1024**3;
		const stripes = disk_size / (Number(data.D) * Number(data.E));
		const block_count = stripes * Number(data.E);

		let res = `
### Размер диска в байтах:
\`disk_size\` = ${data.C} * 1024^3 = ${disk_size}

### Количество stripe units на 1 диске:
\`stripes\` = \`disk_size\` / ( ${data.D} * ${data.E} ) = ${stripes}

### Количество блоков на 1 диске:
\`block_count\` = stripes * ${data.E} = ${block_count}\n`;

		const RaidLevel = Number(data.A);
		switch (RaidLevel) {
			case 0:
				return '### RAID 0: не восстанавливается';
			case 1:
				return res += raid1(data, block_count, stripes);
			case 2:
			case 3:
			case 4:
			case 5:
				return res += raid5(data, block_count, stripes);
			case 6:
				return res += raid6(data, block_count, stripes);
			default:
				return "## Invalid Raid Level";
		}
	}

	function raid1(data: TaskData, block_count: number, stripes: number) {
		let res = '### RAID 1: вычисления паритета не нужно\n';
		res += `### "Живых" дисков осталось N - 1: ${Number(data.B) - 1}\n`;

		res += '### Время чтения: (Если последовательно)\n';
		const read_time_seq = block_count * Number(data.F) * (Number(data.B) - 1);
		res += `read_time_seq = block_count * ${data.F} * ${(Number(data.B) - 1)} = ${read_time_seq} мкс\n`;

		res += '### Время чтения: (Если параллельно)\n';
		const read_time_par = stripes * Number(data.E) * Number(data.F);
		res += `read_time_par = stripes * ${data.E} * ${data.F} = ${read_time_par} мкс\n`;

		res += '### Время расчёта:\n';
		const calc_time = 0;
		res += `\`calc_time\` = 0 мкс, так как RAID 1 - зеркалирование\n`;

		res += '### Запись на заменённый диск\n';
		const write_time = block_count * Number(data.G);
		res += `\`write_time\` = \`block_count\` * ${data.G} = ${write_time} мкс\n`;

		res += `## Итого:\n`;
		res += `### Последовательно:\n`;
		let answer_seq = read_time_seq + calc_time + write_time;
		res += `\`answer_seq\` = \`read_time_seq\` + \`calc_time\` + \`write_time\` = ${answer_seq} мкс\n\n`;
		answer_seq = answer_seq / (10**6 * 60);
		res += `**\`answer_seq\` = ${answer_seq} мин = ${Math.round(answer_seq)} мин** (более вероятный ответ)\n`;

		res += `### Параллельно:\n`;
		let answer_par = read_time_par + calc_time + write_time;
		res += `\`answer_par\` = \`read_time_par\` + \`calc_time\` + \`write_time\` = ${answer_par} мкс\n\n`;
		answer_par = answer_par / (10**6 * 60);
		res += `\`answer_par\` = ${answer_par} мин = ${Math.round(answer_par)} мин\n`;

		return res;
	}

	function raid5(data: TaskData, block_count: number, stripes: number) {
		let res = `### RAID ${data.A}:\n При отказе одного диска массив может быть восстановлен, читая данные со всех остальных B-1 «живых»\n`;
		res += `### "Живых" дисков осталось N - 1: ${Number(data.B) - 1}\n`;

		res += '### Время чтения: (Если последовательно)\n';
		const read_time_seq = block_count * Number(data.F) * (Number(data.B) - 1);
		res += `read_time_seq = block_count * ${data.F} * ${(Number(data.B) - 1)} = ${read_time_seq} мкс\n`;

		res += '### Время чтения: (Если параллельно)\n';
		const read_time_par = stripes * Number(data.E) * Number(data.F);
		res += `read_time_par = stripes * ${data.E} * ${data.F} = ${read_time_par} мкс\n`;

		res += '### Время расчёта:\n';
		const calc_time = stripes * Number(data.H);
		res += `\`calc_time\` = \`stripes\` * ${data.H} = ${calc_time} мкс\n`;

		res += '### Запись на заменённый диск\n';
		const write_time = block_count * Number(data.G);
		res += `\`write_time\` = \`block_count\` * ${data.G} = ${write_time} мкс\n`;

		res += `## Итого:\n`;
		res += `### Последовательно:\n`;
		let answer_seq = read_time_seq + calc_time + write_time;
		res += `\`answer_seq\` = \`read_time_seq\` + \`calc_time\` + \`write_time\` = ${answer_seq} мкс\n\n`;
		answer_seq = answer_seq / (10**6 * 60);
		res += `**\`answer_seq\` = ${answer_seq} мин = ${Math.round(answer_seq)} мин** (более вероятный ответ)\n`;

		res += `### Параллельно:\n`;
		let answer_par = read_time_par + calc_time + write_time;
		res += `\`answer_par\` = \`read_time_par\` + \`calc_time\` + \`write_time\` = ${answer_par} мкс\n\n`;
		answer_par = answer_par / (10**6 * 60);
		res += `\`answer_par\` = ${answer_par} мин = ${Math.round(answer_par)} мин\n`;

		return res;
	}

	function raid6(data: TaskData, block_count: number, stripes: number) {
		let res = `### RAID 6:\n Используется «двойной паритет» позволяя переносить выход из строя сразу двух дисков.
		Но при отказе одного диска массив может быть восстановлен, читая данные со всех остальных B-1 «живых»\n`;
		res += `### "Живых" дисков осталось N - 2: ${Number(data.B) - 2}\n`;

		res += '### Время чтения: (Если последовательно)\n';
		const read_time_seq = block_count * Number(data.F) * (Number(data.B) - 2);
		res += `read_time_seq = block_count * ${data.F} * ${(Number(data.B) - 2)} = ${read_time_seq} мкс\n`;

		res += '### Время чтения: (Если параллельно)\n';
		const read_time_par = stripes * Number(data.E) * Number(data.F);
		res += `read_time_par = stripes * ${data.E} * ${data.F} = ${read_time_par} мкс\n`;

		res += `## Важно!:\n`;
		res += `Если трактовать буквально, что H = ${data.H}мкс это «время вычисления всего нужного кода на один stripe» **именно** для нашего уровня,
		тогда \`calc_time\` получится:\n\n`;
		let calc_time = stripes * Number(data.H);
		res += `\`calc_time\` = \`stripes\` * ${data.H} = ${calc_time} мкс\n`;

		res += `Иначе, двойной паритет требует двойного вычисления:\n\n`;
		res += `\`calc_time\` = \`stripes\` * 2 * ${data.H} = ${calc_time * 2} мкс\n`;

		res += '### Запись на заменённый диск\n';
		const write_time = block_count * Number(data.G);
		res += `\`write_time\` = \`block_count\` * ${data.G} = ${write_time} мкс\n`;

		res += `## Итого:\n`;
		res += `### Последовательно (одно вычисление):\n`;
		let answer_seq = read_time_seq + calc_time + write_time;
		res += `\`answer_seq\` = \`read_time_seq\` + \`calc_time\` + \`write_time\` = ${answer_seq} мкс\n\n`;
		answer_seq = answer_seq / (10**6 * 60);
		res += `**\`answer_seq\` = ${answer_seq} мин = ${Math.round(answer_seq)} мин** (более вероятный ответ)\n`;

		res += `### Последовательно (двойное вычисление):\n`;
		answer_seq = read_time_seq + (calc_time * 2) + write_time;
		res += `\`answer_seq\` = \`read_time_seq\` + 2 * \`calc_time\` + \`write_time\` = ${answer_seq} мкс\n\n`;
		answer_seq = answer_seq / (10**6 * 60);
		res += `\`answer_seq\` = ${answer_seq} мин = ${Math.round(answer_seq)} мин\n`;

		res += `### Параллельно (одно вычисление):\n`;
		let answer_par = read_time_par + calc_time + write_time;
		res += `\`answer_par\` = \`read_time_par\` + \`calc_time\` + \`write_time\` = ${answer_par} мкс\n\n`;
		answer_par = answer_par / (10**6 * 60);
		res += `\`answer_par\` = ${answer_par} мин = ${Math.round(answer_par)} мин\n`;

		res += `### Параллельно (двойное вычисление):\n`;
		answer_par = read_time_par + (calc_time * 2) + write_time;
		res += `\`answer_par\` = \`read_time_par\` + 2 * \`calc_time\` + \`write_time\` = ${answer_par} мкс\n\n`;
		answer_par = answer_par / (10**6 * 60);
		res += `\`answer_par\` = ${answer_par} мин = ${Math.round(answer_par)} мин\n`;

		return res;
	}

	function handleInputChange(label: string, value: string) {
		task1Store.update(current => ({ ...current, [label]: value }));
	}
</script>

<Task title={tasks[taskIdx].name}>
	<img src={img} alt="" style="width: 90%;" />
</Task>
<InputBlock 
	labels={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']}
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
