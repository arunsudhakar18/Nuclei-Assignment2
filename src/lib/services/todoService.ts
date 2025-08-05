import { db } from '$lib/services/firebase';
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
import { user } from '$lib/stores/authStore.ts';

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
	if (!currentUser) throw new Error('You must be logged in to view your todos.');
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
	if (!currentUser) throw new Error('You must be logged in to add a todo.');
	if (!text.trim()) throw new Error('Task description cannot be empty.');
	if (text.length > 250) throw new Error('Task description must be less than 250 characters.');
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
	if (!currentUser) throw new Error('You must be logged in to delete a todo.');
	if (!id) throw new Error('Todo ID is missing.');
	try {
		await deleteDoc(doc(db, 'users', currentUser.email, 'todos', id));
	} catch (e) {
		throw new Error('Failed to delete todo. Please try again.');
	}
}

export async function updateTodo(id: string, updatedFields: Partial<Todo>) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('You must be logged in to update a todo.');
	if (!id) throw new Error('Todo ID is missing.');
	if (updatedFields.text && !updatedFields.text.trim())
		throw new Error('Task description cannot be empty.');
	if (updatedFields.text && updatedFields.text.length > 250)
		throw new Error('Task description must be less than 250 characters.');
	const todoRef = doc(db, 'users', currentUser.email, 'todos', id);
	try {
		await updateDoc(todoRef, {
			...updatedFields
		});
	} catch (e) {
		throw new Error('Failed to update todo. Please try again.');
	}
}

export async function toggleTodoCompleted(id: string, completed: boolean) {
	const currentUser = get(user);
	if (!currentUser) throw new Error('You must be logged in to update a todo.');
	if (!id) throw new Error('Todo ID is missing.');
	const todoRef = doc(db, 'users', currentUser.email, 'todos', id);
	try {
		await updateDoc(todoRef, { completed });
	} catch (e) {
		throw new Error('Failed to update completion status. Please try again.');
	}
}
