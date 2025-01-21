import persistentWritable from "./persistentWritable";

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

export type TaskData2 = {
    A: number;
    B: number;
    C: number;
    D: number;
};

export type TaskData3 = {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    Question: string;
}

export type TaskData4 = {
    A: string;
    B: number;
    C: number;
    D: string;
};

export type TaskData5 = {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
    H: number;
};

export const task1Store = persistentWritable<TaskData1>('task1Store',{
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0
});



export const task2Store = persistentWritable<TaskData2>('task2Store',{
	A: 0,
	B: 0,
    C: 0,
    D: 0
});

export const task3Store = persistentWritable('task3Store',{
	A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    Question: '',
});

export const task4Store = persistentWritable('task4Store',{
	A: "0x",
    B: 0,
    C: 0,
    D: "0x"
});

export const task5Store = persistentWritable('task5Store',{
	A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0
});
