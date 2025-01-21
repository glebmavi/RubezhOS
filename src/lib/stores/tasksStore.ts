import { writable } from 'svelte/store';

export type TaskData1 = {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
    H: number;
};

export const task1Store = writable<TaskData1>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0
});

export type TaskData2 = {
    A: number;
    B: number;
    C: number;
    D: number;
};

export const task2Store = writable<TaskData2>({
	A: 0,
	B: 0,
    C: 0,
    D: 0
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
