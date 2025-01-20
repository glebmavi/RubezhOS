<script>
    import { tasks } from "$lib/tasksInfo";
</script>

<h1>Welcome to the Task App</h1>
<p>Select a task below:</p>

<div class="all-tasks-container">
    {#each tasks as task}
        <div class="task-container">
            <a data-sveltekit-preload-code="eager" href={`/task/${task.id}`}>
                {task.name}
            </a>
            <p>{task.description || 'This is a placeholder description.'}</p>
        </div>
    {/each}
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
        cursor: pointer;
    }
</style>
