<script lang="ts">
	import { user } from '$lib/authStore';
	import { todos, subscribeToTodos, addTodo, deleteTodo } from '$lib/todoService';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { uploadFileToCloudinary } from '$lib/fileUpload';

	let newTodo = '';
	let error = '';
	let imageFile: File | null = null;
	let videoFile: File | null = null;
	let unsubscribe: (() => void) | undefined = undefined;

	function clearTodosAndUnsub() {
		todos.set([]);
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = undefined;
		}
	}

	onMount(() => {
		clearTodosAndUnsub();
		unsubscribe = subscribeToTodos() || undefined;
		return () => clearTodosAndUnsub();
	});

	$user;

	$: if (!$user) {
		clearTodosAndUnsub();
	}

	async function handleAddTodo() {
		error = '';
		let imageDownloadUrl = '';
		let videoDownloadUrl = '';
		try {
			if (imageFile) {
				imageDownloadUrl = await uploadFileToCloudinary(imageFile, 'image');
			}
			if (videoFile) {
				videoDownloadUrl = await uploadFileToCloudinary(videoFile, 'video');
			}
			await addTodo(newTodo, imageDownloadUrl, videoDownloadUrl);
			newTodo = '';
			imageFile = null;
			videoFile = null;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function handleDeleteTodo(id: string | undefined) {
		if (!id) return;
		await deleteTodo(id);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 px-4 py-10 text-white">
	<div class="mx-auto max-w-4xl">
		<header class="mb-10 text-center">
			<h1 class="text-4xl font-bold drop-shadow-sm">My Tasks</h1>
			<div
				class="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
			></div>
		</header>

		<div class="mb-8 rounded-xl bg-white p-6 text-gray-800 shadow-lg">
			<h2 class="mb-6 text-center text-2xl font-semibold">Add New Task</h2>
			<form class="space-y-6" on:submit|preventDefault={handleAddTodo}>
				<div>
					<label for="task-input" class="block text-sm font-medium text-gray-700"
						>Task Description</label
					>
					<input
						id="task-input"
						type="text"
						placeholder="What needs to be done?"
						class="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						bind:value={newTodo}
						required
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700">Add Image</label>
						<div
							class="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:border-indigo-400"
						>
							<input
								type="file"
								accept="image/*"
								class="absolute inset-0 cursor-pointer opacity-0"
								on:change={(e) => {
									const files = (e.target as HTMLInputElement).files;
									imageFile = files && files.length > 0 ? files[0] : null;
								}}
							/>
							<p class="text-sm text-gray-500">
								{imageFile ? imageFile.name : 'Click to add image 📸'}
							</p>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Add Video</label>
						<div
							class="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:border-indigo-400"
						>
							<input
								type="file"
								accept="video/*"
								class="absolute inset-0 cursor-pointer opacity-0"
								on:change={(e) => {
									const files = (e.target as HTMLInputElement).files;
									videoFile = files && files.length > 0 ? files[0] : null;
								}}
							/>
							<p class="text-sm text-gray-500">
								{videoFile ? videoFile.name : 'Click to add video 🎥'}
							</p>
						</div>
					</div>
				</div>

				<button
					type="submit"
					class="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
					disabled={!newTodo.trim()}
				>
					Add Task
				</button>

				{#if error}
					<div
						class="flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 p-3 text-red-700"
					>
						<span>⚠️</span>
						<p>{error}</p>
					</div>
				{/if}
			</form>
		</div>

		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold">Your Tasks</h2>
				<div class="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
					{$todos.length}
					{$todos.length === 1 ? 'task' : 'tasks'}
				</div>
			</div>

			<div class="space-y-4">
				{#each $todos as todo (todo.id)}
					{#if todo && todo.id}
						<div
							class="flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-4 text-gray-800 shadow-md sm:flex-row sm:items-center"
							in:fly={{ y: 20, duration: 300 }}
							out:fade={{ duration: 500 }}
						>
							<div class="flex-1">
								<p class="mb-2 text-lg font-medium">{todo.text}</p>
								<div class="space-y-2">
									{#if todo.imageUrl}
										<img
											src={todo.imageUrl}
											alt="Task image"
											class="w-full max-w-xs rounded-md border"
										/>
									{/if}
									{#if todo.videoUrl}
										<video src={todo.videoUrl} controls class="w-full max-w-xs rounded-md border"
										></video>
									{/if}
								</div>
							</div>
							<button
								on:click={() => handleDeleteTodo(todo.id)}
								class="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
								title="Delete task"
							>
								🗑️ Delete
							</button>
						</div>
					{/if}
				{/each}

				{#if $todos.length === 0}
					<div class="rounded-xl bg-white/10 py-10 text-center">
						<p class="mb-2 text-4xl">📝</p>
						<h3 class="mb-1 text-xl font-semibold">No tasks yet</h3>
						<p class="text-white/80">Start by adding your first task above.</p>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
