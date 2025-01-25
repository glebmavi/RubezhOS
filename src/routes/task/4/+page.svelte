<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task4Store, type TaskData4 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_4.jpg'
	import { marked } from 'marked';

	const taskIdx = 3;
	let taskData: TaskData;
	task4Store.subscribe((data) => (taskData = data));

	let result = '';
	$: result = task(taskData);
	$: markdownHTML = marked(result);

	function task(data: TaskData) {
		const virtualAddress = data.A;
		const binaryVirtualAddress = parseInt(virtualAddress, 16).toString(2);
		const binaryVirtualAddressLen = binaryVirtualAddress.length;

		const pageSize = Number(data.B);
		const offsetSize = Number(data.C);

		const offset = parseInt(
				binaryVirtualAddress.slice(
						binaryVirtualAddressLen - offsetSize,
						binaryVirtualAddressLen
				), 2
		).toString(16)

		const pageNumber = parseInt(
				binaryVirtualAddress.slice(
						0,
						binaryVirtualAddressLen - offsetSize
				), 2
		).toString(16)

		// xor all bits of the page number
		const xor = pageNumber.split('').reduce((acc, curr) => acc ^ parseInt(curr, 16), 0).toString(16);

		const chain = data.D
		let binaryChain = parseInt(chain, 16).toString(2);
		let binaryChainLen = binaryChain.length;

		binaryChain = "0".repeat(Math.max(0,pageSize + offsetSize - binaryChainLen)) + binaryChain
		binaryChainLen = binaryChain.length;

		const frame = parseInt(
				binaryChain.slice(
						binaryChainLen - pageSize,
						binaryChainLen
				), 2
		).toString(16)

		const nextChain = parseInt(
				binaryChain.slice(
						0,
						binaryChainLen - pageSize
				), 2
		).toString(16)

		const answer = frame + offset;

		return `
виртуальный адрес: ${virtualAddress}

в двоичной системе: ${binaryVirtualAddress}

размер номера страницы = ${pageSize} бит

размер смещения = ${offsetSize} бит

номер страницы = ${pageNumber}

смещение = ${offset}

\`xor\` всех бит номера страницы = ${xor} (${parseInt(xor, 16)} в десятичной системе)

Значит, начнем проверку записей со строчки номер ${parseInt(xor, 16)}

Введите chain (Input D) из строки ${parseInt(xor, 16)} (${xor}).

Если значение page в строке ${parseInt(xor, 16)} (${xor}) равно ${pageNumber}, то cм. ответ, иначе перейти к другой строке (см. следующую цепочку)

введенная цепочка = ${chain}

в двоичной системе = ${binaryChain}

**следующая цепочка = ${nextChain}**

Если значение page в строке ${nextChain} равно ${pageNumber}, то введите chain и cм. ответ, иначе введите chain и перейти к другой строке (см. следующую цепочку)

кадр = ${frame}

## Ответ:
\`frame\` + \`offset\` = ${frame} + ${offset} = **${answer}**
		`;
	}

	function handleInputChange(label: string, value: string) {
		task4Store.update(current => ({ ...current, [label]: value }));
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

