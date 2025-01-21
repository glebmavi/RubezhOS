import { writable } from 'svelte/store';

function persistentWritable<T>(key: string, initialValue: T) {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

    const storedValue = isBrowser ? localStorage.getItem(key) : null;
    const value = storedValue ? JSON.parse(storedValue) : initialValue;

    const store = writable<T>(value);

    if (isBrowser) {
        store.subscribe((val) => {
            localStorage.setItem(key, JSON.stringify(val));
        });
    }

    return store;
}

export default persistentWritable;
