<script>
    import { tasks } from "$lib/tasksInfo";
</script>

<h1>Рубежка ОС 2024-2025</h1>
<h3>Задания:</h3>

<div class="all-tasks-container">
    {#each tasks as task}
        <div class="task-container">
            <a data-sveltekit-preload-code="eager" href={`/task/${task.id}`}>
                {task.name}
            </a>
            <p>{task.description || ''}</p>
        </div>
    {/each}

    <p>Всем удачи! :)</p>
</div>

<style>
    h1, p, a {
        text-align: center;
    }
    .all-tasks-container, .task-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    a {
        font-weight: bold;
        font-size: large;
        cursor: pointer;
    }
</style>
