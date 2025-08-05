import { writable } from 'svelte/store';

export const user = writable<null | { email: string }>(null);
