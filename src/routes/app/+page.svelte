<script lang="ts">
	import { user } from '$lib/authStore';
	import { todos, sub, addTodo, deleteTodo, updateTodo, type Todo } from '$lib/todoService';
	import { onMount } from 'svelte';
	import { uploadFileToCloudinary } from '$lib/fileUpload';
	import { toast } from '@zerodevx/svelte-toast';

	let newTodo = '';
	let error = '';
	let imageFile: File | null = null;
	let videoFile: File | null = null;
	let unsub: (() => void) | undefined = undefined;

	let editingTodoId: string | null = null;
	let editedText = '';
	let editedImageFile: File | null = null;
	let editedVideoFile: File | null = null;

	function cleartodo() {
		todos.set([]);
		if (unsub) {
			unsub();
			unsub = undefined;
		}
	}

	onMount(() => {
		cleartodo();
		unsub = sub() || undefined;
		return () => cleartodo();
	});

	$user;

	$: if (!$user) {
		cleartodo();
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
			toast.push('Added successfully!', {
				theme: {
					'--toastBackground': '#d1fae5',
					'--toastColor': '#065f46',
					'--toastBarBackground': '#10b981'
				}
			});
			newTodo = '';
			imageFile = null;
			videoFile = null;
		} catch (e: any) {
			error = e.message;
		}
	}

	async function handleDeleteTodo(id: string | undefined) {
		if (!id) return;
		await deleteTodo(id);
		toast.push('Deleted successfully!', {
			theme: {
				'--toastBackground': '#d1fae5',
				'--toastColor': '#065f46',
				'--toastBarBackground': '#10b981'
			}
		});
	}

	async function handleEditTodo(todo: any) {
		try {
			let newImageUrl = todo.imageUrl || '';
			let newVideoUrl = todo.videoUrl || '';

			if (editedImageFile) {
				newImageUrl = await uploadFileToCloudinary(editedImageFile, 'image');
			}
			if (editedVideoFile) {
				newVideoUrl = await uploadFileToCloudinary(editedVideoFile, 'video');
			}

			await updateTodo(todo.id, {
				text: editedText,
				imageUrl: newImageUrl,
				videoUrl: newVideoUrl
			});

			toast.push('Task updated!', {
				theme: {
					'--toastBackground': '#d1fae5',
					'--toastColor': '#065f46',
					'--toastBarBackground': '#10b981'
				}
			});

			editingTodoId = null;
			editedText = '';
			editedImageFile = null;
			editedVideoFile = null;
		} catch (e: any) {
			error = e.message;
		}
	}
</script>

<div class="min-h-screen bg-blue-50 px-4 py-10 text-gray-800">
	<div class="mx-auto max-w-4xl">
		<header class="mb-10 text-center">
			<h1 class="text-4xl font-bold text-blue-600">My Tasks</h1>
		</header>

		<!-- Add Task Form -->
		<div class="mb-10 rounded-lg bg-white p-6 shadow-md">
			<h2 class="text-blue-1000 mb-4 text-center text-xl font-semibold">Add New Task</h2>
			<form class="space-y-6" on:submit|preventDefault={handleAddTodo}>
				<div>
					<label class="block text-sm font-medium text-gray-700">Task Description</label>
					<input
						type="text"
						placeholder="What needs to be done?"
						class="mt-1 w-full rounded-md border bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						bind:value={newTodo}
						required
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700">Add Image</label>
						<div
							class="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:border-blue-400"
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
							class="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:border-blue-400"
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
					class="w-full rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
					disabled={!newTodo.trim()}
				>
					Add Task
				</button>

				{#if error}
					<div
						class="flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 p-3 text-red-700"
					>
						<p>{error}</p>
					</div>
				{/if}
			</form>
		</div>

		<!-- Task List -->
		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-blue-600">Your Tasks</h2>
				<span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
					{$todos.length}
					{$todos.length === 1 ? 'task' : 'tasks'}
				</span>
			</div>

			<div class="space-y-4">
				{#each $todos as todo (todo.id)}
					{#if todo && todo.id}
						<div
							class="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
						>
							<div class="flex-1">
								{#if editingTodoId === todo.id}
									<div class="space-y-2">
										<input
											class="w-full rounded border px-3 py-2"
											bind:value={editedText}
											placeholder="Update task text"
										/>

										<input
											type="file"
											accept="image/*"
											on:change={(e) => {
												const files = (e.target as HTMLInputElement).files;
												editedImageFile = files && files.length > 0 ? files[0] : null;
											}}
										/>

										<input
											type="file"
											accept="video/*"
											on:change={(e) => {
												const files = (e.target as HTMLInputElement).files;
												editedVideoFile = files && files.length > 0 ? files[0] : null;
											}}
										/>

										<div class="mt-2 flex gap-2">
											<button
												on:click={() => handleEditTodo(todo)}
												class="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
											>
												Save
											</button>
											<button
												on:click={() => (editingTodoId = null)}
												class="rounded bg-gray-400 px-3 py-2 text-white hover:bg-gray-500"
											>
												✖ Cancel
											</button>
										</div>
									</div>
								{:else}
									<p class="mb-2 text-lg font-medium">{todo.text}</p>
									<div class="space-y-2">
										{#if todo.imageUrl}
											<img
												src={todo.imageUrl}
												alt="Task image"
												class="w-full max-w-xs rounded border"
											/>
										{/if}
										{#if todo.videoUrl}
											<video src={todo.videoUrl} controls class="w-full max-w-xs rounded border"
											></video>
										{/if}
									</div>
								{/if}
							</div>

							<div class="flex gap-2">
								{#if editingTodoId !== todo.id}
									<button
										on:click={() => {
											editingTodoId = todo.id!;
											editedText = todo.text;
											editedImageFile = null;
											editedVideoFile = null;
										}}
										class="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
									>
										Edit
									</button>
								{/if}

								<button
									on:click={() => handleDeleteTodo(todo.id)}
									class="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
								>
									Delete
								</button>
							</div>
						</div>
					{/if}
				{/each}

				{#if $todos.length === 0}
					<div class="rounded-xl bg-white/30 py-10 text-center text-gray-600">
						<h3 class="mb-1 text-xl font-semibold">No tasks yet</h3>
						<p class="text-sm">Start by adding your first task above.</p>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
