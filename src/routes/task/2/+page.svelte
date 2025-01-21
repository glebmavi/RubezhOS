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
		res += `### Сколько нужно блоков данных под сам файл (округляем вверх)\n`;
		const dc = Number(data.D) / Number(data.C);
		const blocksNeeded = Math.ceil(dc);
		const formattedDc = dc.toFixed(2);
		res += `\`blocksNeeded\` = ${data.D} / ${data.C} = ${formattedDc} = ${blocksNeeded}(округление вверх)\n`;

		if (blocksNeeded === 0) {
			res += `
Файл размера 0 байт, обычно всё равно есть один служебный блок.
## Ответ: 1
`;
			return res;
		}

		res += `### Размер одного указателя в байтах\n`;
		const pointerSize = Number(data.B) / 8;

		// Сколько указателей помещается в одном блоке
		const pointersPerBlock = Math.floor(Number(data.C) / pointerSize);

		// Подсчитываем служебные блоки. Начинаем с 1 (inode).
		let serviceBlocks = 1;

		// Подсчитываем, сколько блоков данных «уже размещено»
		let usedFileBlocks = 0;

		// Оставшееся количество блоков, которые нужно выделить для файла
		let leftover = blocksNeeded;

		// =====================================================
		// 2. Заполнение за счёт прямых указателей (директ)
		// =====================================================
		const usedDirect = Math.min(leftover, Number(data.A));
		usedFileBlocks += usedDirect;
		leftover -= usedDirect;

		// Если всё уже разместили в прямых указателях
		if (leftover <= 0) {
			// Итог = все блоки данных + один блок под i-узел
			const ans = usedFileBlocks + serviceBlocks;
			res += `## Ответ: ${ans}`;
			return res;
		}

		// =====================================================
		// 3. Одноуровневая индирекция (singly)
		// =====================================================
		// Будем использовать один блок сингли (если leftover > 0)
		// => один служебный блок под «массив» указателей
		serviceBlocks += 1;

		// Сколько данных (блоков) можно разместить через этот блок сингли
		const singlyCapacity = pointersPerBlock;
		const usedSingly = Math.min(leftover, singlyCapacity);
		usedFileBlocks += usedSingly;
		leftover -= usedSingly;

		if (leftover <= 0) {
			const ans = usedFileBlocks + serviceBlocks;
			res += `## Ответ: ${ans}`;
			return res;
		}

		// =====================================================
		// 4. Двухуровневая индирекция (doubly)
		// =====================================================
		// Для дубли:
		// - 1 блок (указатель на блоки первого уровня);
		// - внутри него может быть до 'pointersPerBlock' указателей на блоки первого уровня;
		// - каждый такой блок первого уровня (singly) может содержать ещё pointersPerBlock указателей на данные.
		serviceBlocks += 1; // сам блок doubly

		const doublyCapacity = pointersPerBlock * pointersPerBlock;
		let usedDoubly = Math.min(leftover, doublyCapacity);
		usedFileBlocks += usedDoubly;
		leftover -= usedDoubly;

		// Теперь нужно учесть число блоков первого уровня, которые задействованы в doubly.
		// Для каждого "указателя" во втором уровне выделяется свой singly-блок с указателями.
		// То есть сколько раз реально потребовался блок первого уровня?
		// Это ceil(usedDoubly / pointersPerBlock), но реализуем аккуратно:
		let doublyPointersUsed = Math.floor(usedDoubly / pointersPerBlock);
		if (usedDoubly % pointersPerBlock !== 0) {
			doublyPointersUsed += 1;
		}
		// Это число блоков singly, которые выделили под «даты» во втором уровне.
		serviceBlocks += doublyPointersUsed;

		if (leftover <= 0) {
			const ans = usedFileBlocks + serviceBlocks;
			res += `## Ответ: ${ans}`;
			return res;
		}

		// =====================================================
		// 5. Трёхуровневая индирекция (triply)
		// =====================================================
		// Аналогично логике выше, но теперь один «третий уровень» указывает
		// на несколько «вторых уровней», каждый второй — на набор «первых уровней», etc.
		serviceBlocks += 1; // сам блок triply

		const triplyCapacity = pointersPerBlock ** 3;
		let usedTriply = Math.min(leftover, triplyCapacity);
		usedFileBlocks += usedTriply;
		leftover -= usedTriply;

		// Сколько блоков второго уровня понадобилось?
		let fullDoublyBlocks = Math.floor(usedTriply / (pointersPerBlock ** 2));
		let partialForDoubly = usedTriply % (pointersPerBlock ** 2);

		// Число «полных» doubly-блоков
		serviceBlocks += fullDoublyBlocks; // это сами doubly-блоки

		// Для каждого «полного» doubly-блока (который вмещает pointersPerBlock^2 блоков данных)
		// мы добавляем ещё blocks первого уровня (singly).
		// Т.к. в полном doubly-блоке используется pointersPerBlock указателей на singly.
		serviceBlocks += fullDoublyBlocks * pointersPerBlock;

		// Теперь обрабатываем «частично занятый» doubly-блок (если partialForDoubly > 0):
		if (partialForDoubly > 0) {
			// Нам нужен ещё один doubly-блок (неполный)
			serviceBlocks += 1; 
			// Внутри этого неполного doubly-блока может быть несколько singly-блоков
			// Аналогично тому, как мы считали выше:
			let usedInPartialDoubly = partialForDoubly;
			let singlyBlocksInPartial = Math.floor(usedInPartialDoubly / pointersPerBlock);
			if (usedInPartialDoubly % pointersPerBlock !== 0) {
			singlyBlocksInPartial += 1;
			}
			serviceBlocks += singlyBlocksInPartial;
		}

		// Если после трёхуровневой индирекции всё ещё leftover > 0, 
		// то в классической схеме (где только до triple-indirect) 
		// хранить уже некуда. Но в рамках учебной задачи можно считать,
		// что файл влезает (или расширять схему дальше).
		// Здесь завершаем.

		const ans = usedFileBlocks + serviceBlocks;
		res += `## Ответ: ${ans}`;
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