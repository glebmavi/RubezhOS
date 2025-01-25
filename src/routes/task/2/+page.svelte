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
		res += `\`blocksNeeded\` = ${data.D} / ${data.C} = ${formattedDc} = ${blocksNeeded}\n`;

		if (blocksNeeded === 0) {
			res += `
Файл размера 0 байт, но обычно всё равно есть один служебный блок.
## Ответ: 1
`;
			return res;
		}

		res += `### Размер одного указателя в байтах\n`;
		const pointerSize = Number(data.B) / 8;
		res += `\`pointerSize\` = ${data.B} / 8 = ${pointerSize} байт\n`;

		res += `### Сколько указателей помещается в одном блоке:\n`;
		const pointersPerBlock = Math.floor(Number(data.C) / pointerSize);
		res += `\`pointersPerBlock\` = ${data.C} / ${pointerSize} = ${pointersPerBlock} штук\n`;

		res += `### Подсчитываем служебные блоки. Начинаем с 1 (первый inode)\n`;
		let serviceBlocks = 1;
		res += `\`serviceBlocks\` = 1\n`;

		// Сколько блоков данных «уже размещено»
		let usedFileBlocks = 0;

		res += `### Оставшееся количество блоков, которые нужно выделить для файла:\n`
		let leftover = blocksNeeded;
		res += `Осталось распределить = ${leftover} blocks\n`;
		
		res += ` ## Заполнение за счёт прямых указателей (direct)\n`;
		const usedDirect = Math.min(leftover, Number(data.A));
		usedFileBlocks += usedDirect;
		leftover -= usedDirect;
		res += `Использовано прямых указателей = ${usedDirect}\n\n`;
		res += `Осталось распределить = ${leftover} blocks\n`;

		if (leftover <= 0) {
			res += `\nВсё уместилось в прямых указателях\n`;
			res += `## Итог = все блоки данных + один блок под i-узел\n`;
			const ans = usedFileBlocks + serviceBlocks;
			res += `\`usedFileBlocks + serviceBlocks\` = ${usedFileBlocks} + ${serviceBlocks} = ${ans}\n`;
			res += `## Ответ: ${ans}`;
			return res;
		}

		res += `## Одноуровневые указатели\n`;
		res += `+1 служебный блок под «массив» указателей\n\n`;
		serviceBlocks += 1;
		res += `\`serviceBlocks\` = ${serviceBlocks - 1} (пред) + 1 = ${serviceBlocks} (всего)\n\n`;

		const singlyCapacity = pointersPerBlock;
		const usedSingly = Math.min(leftover, singlyCapacity);
		usedFileBlocks += usedSingly;
		leftover -= usedSingly;
		res += `Использовано указателей первого уровня = ${usedSingly}\n\n`;
		res += `Осталось распределить = ${leftover} blocks\n`;

		if (leftover <= 0) {
			const ans = usedFileBlocks + serviceBlocks;
			res += `## Ответ: ${ans}`;
			return res;
		}

		res += `## Двухуровневые указатели\n`;

		const doublyCapacity = pointersPerBlock * pointersPerBlock;
		let usedDoubly = Math.min(leftover, doublyCapacity);
		usedFileBlocks += usedDoubly;
		leftover -= usedDoubly;
		res += `Использовано указателей второго уровня = ${usedDoubly}\n\n`;
		res += `Осталось распределить = ${leftover} blocks\n\n`;

		// Теперь нужно учесть число блоков первого уровня, которые задействованы во втором уровне.
		// Для каждого "указателя" во втором уровне выделяется свой singly-блок с указателями.
		// То есть сколько раз реально потребовался блок первого уровня?
		let doublyPointersUsed = Math.floor(usedDoubly / pointersPerBlock);
		if (usedDoubly % pointersPerBlock !== 0) {
			doublyPointersUsed += 1;
		}

		// Служебные
		serviceBlocks += 1; // сам блок 'double level'
		// Это число блоков singly, которые выделили под данные во втором уровне.
		serviceBlocks += doublyPointersUsed;
		res += `Служебные: ${serviceBlocks - 1 - doublyPointersUsed} (пред) + 1 + ${doublyPointersUsed} = ${serviceBlocks} (всего)\n\n`;
		res += `- 1 блок (указатель на блоки первого уровня)\n`;
		res += `- внутри него может быть до \`pointersPerBlock\` ${pointersPerBlock} указателей на блоки первого уровня. В данном случае: ${doublyPointersUsed}\n\n`;
		
		if (leftover <= 0) {
			const ans = usedFileBlocks + serviceBlocks;
			res += `## Ответ: ${ans}`;
			return res;
		}

		res += `## Трёхуровневые указатели\n`;
		serviceBlocks += 1; // сам блок 'triple level'

		const triplyCapacity = pointersPerBlock ** 3;
		
		res += `\`triplyCapacity\` = ${pointersPerBlock}^3 = ${triplyCapacity}\n\n`;
		// Если (теоретически) leftover > triplyCapacity, то файл слишком большой
		// для классической трёхуровневой схемы. Но в задаче предполагаем, что влезет.
		if (leftover > triplyCapacity) {
			res += `### Осталось ${leftover} блоков, но 3-х уровней недостаточно (макс. ${triplyCapacity}).\n`;
			res += `Файл слишком большой для данной FS.\n`;
			const ans = usedFileBlocks + serviceBlocks;
			res += `## Ответ (неполный): ${ans}`;
			return res;
		}

		// Сколько блоков второго уровня понадобилось?
		let fullSecondPointers = Math.floor(leftover / (pointersPerBlock ** 2));
		res += `Полных указателей второго уровня: \`usedTriply\` / \`pointersPerBlock\` ^ 2 = ${leftover} / ${pointersPerBlock} ^ 2 = ${fullSecondPointers} (округлено в меньшую сторону)\n\n`;

		let usedTriply = fullSecondPointers * (pointersPerBlock ** 2);
		res += `Использовано указателей третьего уровня = ${fullSecondPointers} * ${pointersPerBlock} ^ 2 = ${usedTriply}\n\n`;
		usedFileBlocks += usedTriply;
		leftover -= usedTriply;
		res += `Осталось распределить = ${leftover} blocks\n\n`;

		// За каждый «полный» блок второго уровня нужно: +1 doubly-блок + pointersPerBlock singly-блоков
		// Но прежде всего: сколько «второуровневых» блоков?
		serviceBlocks += fullSecondPointers; // блоки второго уровня
		serviceBlocks += fullSecondPointers * pointersPerBlock; // вложенные singly-блоки
		res += `Добавили служебных блоков:\n`;
		res += `${serviceBlocks - 1 - fullSecondPointers - (fullSecondPointers * pointersPerBlock)} (было) + 1 (первого уровня) + ${fullSecondPointers} (второго уровня) + ${fullSecondPointers} * ${pointersPerBlock} (третьего уровня)\n`;
		res += `Итого \`serviceBlocks\` = ${serviceBlocks}\n\n`;

		// Проверяем, остались ли ещё не распределённые блоки
		if (leftover <= 0) {
			// Всё уместилось
			const ans = usedFileBlocks + serviceBlocks;
			res += `### Все данные уже распределены\n`;
			res += `## Ответ: ${ans}`;
			return res;
		}

		// Иначе остался «частично занятый» блок второго уровня
		res += `Осталось распределить = ${leftover} blocks < ${pointersPerBlock}^2 = ${pointersPerBlock ** 2}\n`;
		const singlyNeeded = Math.ceil(leftover / pointersPerBlock);
		res += `=> заводим ещё указатели: ${leftover} / ${pointersPerBlock} = ${leftover / pointersPerBlock} = ${singlyNeeded}\n\n`;
		
		const usedInPartialDoubly = singlyNeeded * pointersPerBlock;
		usedFileBlocks += usedInPartialDoubly;
		leftover -= usedInPartialDoubly;

		// Добавляем служебные блоки первого уровня
		serviceBlocks += singlyNeeded;
		res += `Нужно ${singlyNeeded} блок(ов) первого уровня => \`serviceBlocks\` = ${serviceBlocks}\n\n`;
		res += `Распределено ещё ${usedInPartialDoubly + leftover} блок(ов) данных\n\n`;
		res += `Осталось распределить = ${leftover} blocks\n`;
		if (leftover < 0) res += `Всё распределено.\n\n`;

		const ans = (usedFileBlocks + leftover) + serviceBlocks;
		res += `Блоки на файл + служебные = ${(usedFileBlocks + leftover)} + ${serviceBlocks} = ${ans}\n\n`
		res += `## Ответ: ${ans}`;
		return res;
	}

	function handleInputChange(label: string, value: string) {
		task2Store.update(current => ({ ...current, [label]: value }));
	}
</script>

<InputBlock 
	labels={['A', 'B', 'C', 'D']}
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