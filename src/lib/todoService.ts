import { db } from '$lib/firebase';
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp,
	updateDoc
} from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { user } from './authStore';

export interface Todo {
	id?: string;
	text: string;
	createdAt?: any;
	imageUrl?: string;
	videoUrl?: string;
	completed?: boolean;
}

export const todos = writable<Todo[]>([]);

export function sub() {
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
		videoUrl: videoUrl || '',
		completed: false
	});
}

export async function deleteTodo(id: string) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('Not authenticated');
	await deleteDoc(doc(db, 'users', currentUser.email, 'todos', id));
}

export async function updateTodo(id: string, updatedFields: Partial<Todo>) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('Not authenticated');
	const todoRef = doc(db, 'users', currentUser.email, 'todos', id);
	await updateDoc(todoRef, {
		...updatedFields
	});
}

export async function toggleTodoCompleted(id: string, completed: boolean) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('Not authenticated');
	const todoRef = doc(db, 'users', currentUser.email, 'todos', id);
	await updateDoc(todoRef, { completed });
}
