<script lang="ts">
    export let labels: string[] = [];
    export let values: { [key: string]: unknown };
    export let onInputChange: (name: string, value: string) => void;
    export let inputType: string = 'text';
</script>

<div class="input-block main-block">
    {#each labels as label, i}
        <div class="input-row">
            <label for="input-{i}">{label}</label>
            <input
                id="input-{i}"
                type={inputType}
                bind:value={values[label]}
                on:input={(e) => onInputChange(label, (e.target as HTMLInputElement).value)}
            />
        </div>
        {/each}
    </div>
    <slot/>
<style>
    :root {
    --gap-size: 10px;
    --label-width: 15px;
    }
    .input-block {
    margin: 1rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-size);
    }
    .input-row {
    display: flex;
    flex-direction: row;
    margin: 0.5rem 0;
    width: calc(33.33% - var(--gap-size)); /* Adjust width to fit 3 in a row with gap */
    }
    label {
    font-weight: bold;
    width: var(--label-width);
    display: flex;
    align-items: center;
    }
    input {
    padding: 0.2rem;
    font-size: 1rem;
    flex: 1;
    width: calc(100% - var(--label-width));
    }
</style>
