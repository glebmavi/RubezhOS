<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task3Store, type TaskData3 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_3.jpg'
	import { marked } from 'marked';

	const taskIdx = 2;
	let taskData: TaskData;
	task3Store.subscribe((data) => (taskData = data));

	let result = '';
	$: result = task(taskData);
	$: markdownHTML = marked(result);

	function task(data: TaskData) {
		let res = '';
		const sectorBytes = Number(data.A);
		const trackSectors = Number(data.B);
		const surfaceTracks = Number(data.C);
		const surfaces = Number(data.D);
		const fileRecords = Number(data.E);
		const recordBytes = Number(data.F);

		const sectorRecords = Math.floor(sectorBytes / recordBytes);
		res += `### Сколько записей влезет в 1 сектор:\n`;
		res += `\`sectorBytes\` / \`recordBytes\` = ${sectorBytes} / ${recordBytes} = ${sectorRecords} (округляя в меньшую сторону)\n\n`;

		const fileSectors = Math.ceil(fileRecords / sectorRecords);
		res += `### Сколько секторов придётся заполнить чтобы влез весь файл:\n`;
		res += `\`fileRecords\` / \`sectorRecords\` = ${fileRecords} / ${sectorRecords} = ${fileSectors} (округляя в большую сторону)\n\n`;

		return res;
	}

	function handleInputChange(label: string, value: string) {
		task3Store.update(current => ({ ...current, [label]: value }));
	}
</script>

<Task title={tasks[taskIdx].name}>
	<img src={img} alt="" style="width: 90%;" />
</Task>
<InputBlock 
	labels={['A', 'B', 'C', 'D', 'E', 'F']}
	values={taskData}
	onInputChange={handleInputChange}
	inputType={tasks[taskIdx].inputType}
>
    <div class="input-row">
        <label for="select-question">Вопрос</label>
        <select 
            id="select-question" 
            bind:value={taskData.Question} 
            on:change={(e) => handleInputChange('Вопрос', (e.target as HTMLInputElement).value)}
        >
            <option value="" disabled selected>Select an option</option>
            <option value="Option1">Option 1</option>
            <option value="Option2">Option 2</option>
            <option value="Option3">Option 3</option>
        </select>
    </div>
</InputBlock>

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
