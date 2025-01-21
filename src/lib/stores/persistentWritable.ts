import { writable } from 'svelte/store';

function persistentWritable<T>(key: string, initialValue: T) {
    const storedValue = localStorage.getItem(key);
    const value = storedValue ? JSON.parse(storedValue) : initialValue;

    const store = writable<T>(value);

    store.subscribe((val) => {
        localStorage.setItem(key, JSON.stringify(val));
    });

    return store;
}

export default persistentWritable;
