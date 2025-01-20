import { writable } from 'svelte/store';

// Example shape of data for Task 1
export const task1Store = writable({
	inputA: '', 
	inputB: '', 
	// you can add as many fields as you need
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
