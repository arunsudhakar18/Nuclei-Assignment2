import { db } from '$lib/firebase';
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp
} from 'firebase/firestore';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { user } from './authStore';

export interface Todo {
	id?: string;
	text: string;
	createdAt?: any;
	imageUrl?: string;
	videoUrl?: string;
}

export const todos = writable<Todo[]>([]);

export function subscribeToTodos() {
	const currentUser = get(user);
	if (!currentUser) return;
	const q = query(
		collection(db, 'users', currentUser.email, 'todos'),
		orderBy('createdAt', 'desc')
	);
	return onSnapshot(q, (snapshot) => {
		todos.set(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Todo));
	});
}

export async function addTodo(text: string, imageUrl?: string, videoUrl?: string) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('Not authenticated');
	if (!text.trim() || text.length > 250) throw new Error('Invalid todo');
	await addDoc(collection(db, 'users', currentUser.email, 'todos'), {
		text,
		createdAt: serverTimestamp(),
		imageUrl: imageUrl || '',
		videoUrl: videoUrl || ''
	});
}

export async function deleteTodo(id: string) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('Not authenticated');
	await deleteDoc(doc(db, 'users', currentUser.email, 'todos', id));
}
