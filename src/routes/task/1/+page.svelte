<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task1Store, type TaskData1 as TaskData } from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_1.jpg';
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

		const disk_size = Number(data.C) * 1024 ** 3;
		const stripes = disk_size / (Number(data.D) * Number(data.E));
		const block_count = stripes * Number(data.E);

		let res = `
### Размер диска в байтах:
\`disk_size\` = ${data.C} * 1024^3 = ${disk_size}

### Количество stripe units на 1 диске:
\`stripes\` = \`disk_size\` / ( ${data.D} * ${data.E} ) = ${stripes}

### Количество блоков на 1 диске:
\`block_count\` = \`stripes\` * ${data.E} = ${block_count}\n`;

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

	function raid1(data: TaskData, blockCount: number, stripes: number): string {
		const readTimeSeq = blockCount * Number(data.F) * (Number(data.B) - 1);
		const readTimePar = stripes * Number(data.E) * Number(data.F);
		const writeTime = blockCount * Number(data.G);
		const totalSeq = readTimeSeq + writeTime;
		const totalPar = readTimePar + writeTime;

		return `
### RAID 1: вычисления паритета не нужно
"Живых" дисков осталось N - 1: ${Number(data.B) - 1}

### Время чтения:
Последовательно: \`readTimeSeq\` = ${blockCount} * ${data.F} * (${data.B} - 1) = ${readTimeSeq} мкс

Параллельно: \`readTimePar\` = ${stripes} * ${data.E} * ${data.F} = ${readTimePar} мкс

### Время записи:
\`writeTime\` = ${blockCount} * ${data.G} = ${writeTime} мкс

## Итог:
**Последовательно: ${totalSeq} мкс (${(totalSeq / 10 ** 6 / 60).toFixed(2)} мин)** (более вероятный ответ)

Параллельно: ${totalPar} мкс (${(totalPar / 10 ** 6 / 60).toFixed(2)} мин)
`;
	}

	function raid5(data: TaskData, blockCount: number, stripes: number): string {
		const readTimeSeq = blockCount * Number(data.F) * (Number(data.B) - 1);
		const readTimePar = stripes * Number(data.E) * Number(data.F);
		const calcTime = stripes * Number(data.H);
		const writeTime = blockCount * Number(data.G);
		const totalSeq = readTimeSeq + calcTime + writeTime;
		const totalPar = readTimePar + calcTime + writeTime;

		return `
### RAID 5:
При отказе одного диска массив может быть восстановлен, читая данные со всех остальных B-1 «живых»

"Живых" дисков осталось N - 1: ${Number(data.B) - 1}

### Время чтения:
Последовательно: \`readTimeSeq\` = ${blockCount} * ${data.F} * (${data.B} - 1) = ${readTimeSeq} мкс

Параллельно: \`readTimePar\` = ${stripes} * ${data.E} * ${data.F} = ${readTimePar} мкс

### Время расчёта:
\`calcTime\` = ${stripes} * ${data.H} = ${calcTime} мкс

### Время записи:
\`writeTime\` = ${blockCount} * ${data.G} = ${writeTime} мкс

## Итог:
**Последовательно: ${totalSeq} мкс (${(totalSeq / 10 ** 6 / 60).toFixed(2)} мин)** (более вероятный ответ)

Параллельно: ${totalPar} мкс (${(totalPar / 10 ** 6 / 60).toFixed(2)} мин)
`;
	}

	function raid6(data: TaskData, blockCount: number, stripes: number): string {
		const readTimeSeq = blockCount * Number(data.F) * (Number(data.B) - 2);
		const readTimePar = stripes * Number(data.E) * Number(data.F);
		const calcTime = stripes * Number(data.H);
		const writeTime = blockCount * Number(data.G);
		const totalSeqSingle = readTimeSeq + calcTime + writeTime;
		const totalSeqDouble = readTimeSeq + 2 * calcTime + writeTime;
		const totalParSingle = readTimePar + calcTime + writeTime;
		const totalParDouble = readTimePar + 2 * calcTime + writeTime;

		return `
### RAID 6:
"Живых" дисков осталось N - 2: ${Number(data.B) - 2}

### Время чтения:

Последовательно: \`readTimeSeq\` = ${blockCount} * ${data.F} * (${data.B} - 2) = ${readTimeSeq} мкс

Параллельно: \`readTimePar\` = ${stripes} * ${data.E} * ${data.F} = ${readTimePar} мкс

### Время расчёта:
Если трактовать буквально, что H = ${data.H} мкс это «время вычисления всего нужного кода на один stripe» именно для нашего уровня,
тогда \`calcTime\` получится:

Одно вычисление: ${calcTime} мкс

Иначе:

Двойное вычисление: ${2 * calcTime} мкс

### Время записи:
\`writeTime\` = ${blockCount} * ${data.G} = ${writeTime} мкс

## Итог:
**Последовательно (одно вычисление): ${totalSeqSingle} мкс (${(totalSeqSingle / 10 ** 6 / 60).toFixed(2)} мин)** (более вероятный ответ)

Последовательно (двойное вычисление): ${totalSeqDouble} мкс (${(totalSeqDouble / 10 ** 6 / 60).toFixed(2)} мин)

Параллельно (одно вычисление): ${totalParSingle} мкс (${(totalParSingle / 10 ** 6 / 60).toFixed(2)} мин)

Параллельно (двойное вычисление): ${totalParDouble} мкс (${(totalParDouble / 10 ** 6 / 60).toFixed(2)} мин)
`;
	}

	function handleInputChange(label: string, value: string) {
		task1Store.update(current => ({ ...current, [label]: value }));
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
