import { writable } from 'svelte/store';

export type TaskData1 = {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
    F: string;
    G: string;
    H: string;
};

// Example shape of data for Task 1
export const task1Store = writable<TaskData1>({
    A: '',
    B: '',
    C: '',
    D: '',
    E: '',
    F: '',
    G: '',
    H: ''
});

// Similar store for each task
export const task2Store = writable({
	input1: '',
	input2: ''
});

export const task3Store = writable({
	// ...
});

export const task4Store = writable({
	// ...
});

export const task5Store = writable({
	// ...
});
