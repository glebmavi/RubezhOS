<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import InputBlock from '$lib/components/InputBlock.svelte';
	import OutputBlock from '$lib/components/OutputBlock.svelte';
	import { tasks } from '$lib/tasksInfo';
	import { task3Store, type TaskData3 as TaskData} from '$lib/stores/tasksStore';
	import img from '$lib/images/photo_3.jpg';
	import { marked } from 'marked';

	const taskIdx = 2;
	let taskData: TaskData;
	task3Store.subscribe((data) => (taskData = data));

	let result = '';
	$: result = task(taskData);
	$: markdownHTML = marked(result);

	function task(data: TaskData) {
		const A = Number(data.A); // байт на сектор
		const B = Number(data.B); // секторов на дорожке
		const C = Number(data.C); // дорожек на поверхности (не используется прямо в формулах, но хранится)
		const D = Number(data.D); // поверхностей у диска (аналогично, хранится)
		const E = Number(data.E); // число записей в файле
		const F = Number(data.F); // размер одной записи, байт
		const question = data.Question; // выбранный вопрос

		// Если не все поля заполнены или вопрос не выбран – не считаем
		if (!A || !B || !C || !D || !E || !F || !question) return '';

		// 1) Сколько записей влезет в один сектор
		const recordsPerSector = Math.floor(A / F);

		// 2) Сколько секторов понадобится для всего файла
		const fileSectors = Math.ceil(E / recordsPerSector);

		// Вспомогательные вычисления:
		// Внутренняя фрагментация (байт)
		const unusedBytes = fileSectors * A - E * F;

		// Полный объём (байт), включая фрагментацию
		const fullSize = fileSectors * A;

		// Общее количество дорожек (каждая дорожка = B секторов)
		const totalTracks = Math.ceil(fileSectors / B);

		// Секторов на последней дорожке
		const lastTrackSectors = (fileSectors % B === 0) ? B : (fileSectors % B);

		let res = '### Решение\n';
		res += `**1. Количество записей, помещающихся в сектор**: \n\`\`\`\n`;
		res += `recordsPerSector = floor(${A} / ${F}) = ${recordsPerSector}\n\`\`\`\n\n`;
		res += `**2. Общее число занятых секторов**: \n\`\`\`\n`;
		res += `fileSectors = ceil(${E} / ${recordsPerSector}) = ${fileSectors}\n\`\`\`\n\n`;

		switch (question) {
			case 'unused-bytes':
				res += `**Вопрос**: Какое количество байт будет неиспользованным во всех секторах (внутренняя фрагментация) для хранения всех записей?\n\n`;
				res += `**Внутренняя фрагментация** рассчитывается по формуле:\n\n`;
				res += `\`\`\`\nunusedBytes = fileSectors * A - E * F\n`;
				res += `= ${fileSectors} * ${A} - ${E} * ${F}\n`;
				res += `= ${unusedBytes} байт\n\`\`\`\n`;
				break;

			case 'full-size':
				res += `**Вопрос**: Какое полное количество байт (включая потери фрагментации) займет файл?\n\n`;
				res += `**Полный объем** (включая потери) = \n\`\`\`\n`;
				res += `fullSize = fileSectors * A = ${fileSectors} * ${A} = ${fullSize} байт\n\`\`\`\n`;
				break;

			case 'total-sectors':
				res += `**Вопрос**: Какое общее количество секторов необходимо для хранения всех записей?\n\n`;
				res += `**Общее число секторов**: \n\`\`\`\n`;
				res += `= ${fileSectors}\n\`\`\`\n`;
				break;

			case 'total-tracks':
				res += `**Вопрос**: Какое общее количество дорожек необходимо для хранения всех записей?\n\n`;
				res += `Одна дорожка содержит ${B} секторов.\n\n`;
				res += `**Число дорожек**: \n\`\`\`\n`;
				res += `totalTracks = ceil(fileSectors / B) = ceil(${fileSectors} / ${B}) = ${totalTracks}\n\`\`\`\n`;
				break;

			case 'last-track-sectors':
				res += `**Вопрос**: Сколько секторов будет занято на последней дорожке файла?\n\n`;
				res += `**Занятые сектора на последней дорожке**: \n\`\`\`\n`;
				res += `lastTrackSectors = (fileSectors % B === 0) ? B : (fileSectors % B)\n`;
				res += `= ${lastTrackSectors}\n\`\`\`\n`;
				break;

			default:
				res += `Выберите вопрос из списка выше.`;
		}

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
    <!-- Дополнительный select для выбора вопроса -->
    <div class="input-block">
        <label for="select-question">Вопрос</label>
        <select 
            id="select-question" 
            bind:value={taskData.Question}
            on:change={(e) => handleInputChange('Question', (e.target as HTMLSelectElement).value)}
        >
            <option value="" disabled selected>Выберите вопрос</option>
            <option value="unused-bytes">
				Какое количество байт будет неиспользованным во всех секторах (внутренняя фрагментация) для хранения всех записей?
			</option>
            <option value="full-size">
				Какое полное количество байт (включая потери фрагментации) займет файл?
			</option>
            <option value="total-sectors">
				Какое общее количество секторов необходимо для хранения всех записей?
			</option>
            <option value="total-tracks">
				Какое общее количество дорожек необходимо для хранения всех записей?
			</option>
            <option value="last-track-sectors">
				Сколько секторов будет занято на последней дорожке файла?
			</option>
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
	select {
		width: 100%;
	}
</style>
