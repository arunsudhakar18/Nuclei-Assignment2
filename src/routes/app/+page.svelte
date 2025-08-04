<script lang="ts">
	import { user } from '$lib/authStore';
	import {
		todos,
		sub,
		addTodo,
		deleteTodo,
		updateTodo,
		toggleTodoCompleted,
		type Todo
	} from '$lib/todoService';
	import { onMount } from 'svelte';
	import { uploadFileToCloudinary } from '$lib/fileUpload';
	import { toast } from '@zerodevx/svelte-toast';

	let newTodo = '';
	let error = '';
	let imageFile: File | null = null;
	let videoFile: File | null = null;
	let unsub: (() => void) | undefined = undefined;

	let editingTodoId: string | null = null;
	let showCompleted = false;
	let editedText = '';
	let editedImageFile: File | null = null;
	let editedVideoFile: File | null = null;

	let showAddDropdown = false;
	let expandedTodoId: string | null | undefined = null;

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
			showAddDropdown = false;
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

	async function handleEditTodo(todo: Todo) {
		try {
			let newImageUrl = todo.imageUrl || '';
			let newVideoUrl = todo.videoUrl || '';

			if (editedImageFile) {
				newImageUrl = await uploadFileToCloudinary(editedImageFile, 'image');
			}
			if (editedVideoFile) {
				newVideoUrl = await uploadFileToCloudinary(editedVideoFile, 'video');
			}

			if (!todo.id) {
				error = 'Todo ID is missing.';
				return;
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

	async function handleToggleCompleted(todo: Todo) {
		try {
			await toggleTodoCompleted(todo.id!, !todo.completed);
			toast.push(!todo.completed ? 'Marked as completed!' : 'Marked as incomplete!', {
				theme: {
					'--toastBackground': !todo.completed ? '#d1fae5' : '#fee2e2',
					'--toastColor': !todo.completed ? '#065f46' : '#991b1b',
					'--toastBarBackground': !todo.completed ? '#10b981' : '#ef4444'
				}
			});

			if (showCompleted && todo.completed) {
				showCompleted = false;
			}

			if (!showCompleted && !todo.completed) {
				showCompleted = true;
			}
		} catch (e: any) {
			error = e.message;
		}
	}
</script>

<div class="min-h-screen bg-[#222831] px-4 py-10 font-sans text-[#EEEEEE]">
	<div class="mx-auto max-w-4xl">
		<header class="mb-10 text-center">
			<h1 class="text-4xl font-bold text-[#EEEEEE]">My Tasks</h1>
		</header>

		<div class="mb-10 flex justify-center">
			<button
				class="hover:bg-opacity-90 rounded-lg bg-[#00ADB5] px-6 py-3 font-semibold text-white shadow transition"
				on:click={() => (showAddDropdown = !showAddDropdown)}
			>
				➕ Add a list
			</button>
		</div>

		{#if showAddDropdown}
			<div class="mx-auto mb-10 max-w-lg rounded-xl bg-[#393E46] p-6 shadow">
				<form class="space-y-6" on:submit|preventDefault={handleAddTodo}>
					<div>
						<label for="task-desc" class="block text-sm font-medium text-[#EEEEEE]"
							>Task Description</label
						>
						<input
							id="task-desc"
							type="text"
							placeholder="What needs to be done?"
							class="mt-1 w-full rounded-md border border-[#00ADB5] bg-[#222831] px-4 py-3 text-[#EEEEEE] focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
							bind:value={newTodo}
							required
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<!-- Image Upload -->
						<div>
							<label class="block text-sm font-medium text-[#EEEEEE]">Add Image</label>
							<div
								class="relative rounded-lg border-2 border-dashed border-[#00ADB5] bg-[#222831] p-4 text-center hover:border-white"
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
								<p class="text-sm text-[#EEEEEE]">
									{imageFile ? imageFile.name : '📸 Click to add image'}
								</p>
							</div>
						</div>

						<!-- Video Upload -->
						<div>
							<label class="block text-sm font-medium text-[#EEEEEE]">Add Video</label>
							<div
								class="relative rounded-lg border-2 border-dashed border-[#00ADB5] bg-[#222831] p-4 text-center hover:border-white"
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
								<p class="text-sm text-[#EEEEEE]">
									{videoFile ? videoFile.name : '🎥 Click to add video'}
								</p>
							</div>
						</div>
					</div>

					<div class="flex gap-2">
						<button
							type="submit"
							class="hover:bg-opacity-90 flex-1 rounded-md bg-[#00ADB5] px-6 py-3 font-semibold text-white transition"
							disabled={!newTodo.trim()}
						>
							Add Task
						</button>
						<button
							type="button"
							class="flex-1 rounded-md border border-[#00ADB5] bg-[#222831] px-6 py-3 font-semibold text-[#EEEEEE] transition hover:bg-[#393E46]"
							on:click={() => (showAddDropdown = false)}
						>
							Cancel
						</button>
					</div>

					{#if error}
						<div
							class="flex items-center gap-2 rounded-lg border border-red-500 bg-red-100 p-3 text-red-600"
						>
							<p>{error}</p>
						</div>
					{/if}
				</form>
			</div>
		{/if}

		<!-- Filter Buttons -->
		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-[#EEEEEE]">Your Tasks</h2>
				<span class="rounded-full bg-[#00ADB5] px-3 py-1 text-sm font-semibold text-white">
					{$todos.length}
					{$todos.length === 1 ? 'task' : 'tasks'}
				</span>
			</div>

			<div class="mb-4 flex justify-center gap-2">
				<button
					class="rounded-lg px-4 py-2 font-semibold transition-colors focus:outline-none"
					class:bg-[#00ADB5]={!showCompleted}
					class:text-white={!showCompleted}
					class:bg-[#393E46]={showCompleted}
					class:text-[#EEEEEE]={showCompleted}
					on:click={() => (showCompleted = false)}
				>
					Incomplete
				</button>
				<button
					class="rounded-lg px-4 py-2 font-semibold transition-colors focus:outline-none"
					class:bg-[#00ADB5]={showCompleted}
					class:text-white={showCompleted}
					class:bg-[#393E46]={!showCompleted}
					class:text-[#EEEEEE]={!showCompleted}
					on:click={() => (showCompleted = true)}
				>
					Completed
				</button>
			</div>

			<!-- Task List -->
			<div class="space-y-4">
				{#each $todos.filter((t) => (showCompleted ? t.completed : !t.completed)) as todo (todo.id)}
					<div class="rounded-lg bg-[#393E46] shadow">
						<div
							class="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-[#2c2f35]"
							on:click={() => (expandedTodoId = expandedTodoId === todo.id ? null : todo.id)}
						>
							<div class="flex items-center gap-3">
								<input
									type="checkbox"
									checked={todo.completed}
									on:change={(e) => {
										e.stopPropagation();
										handleToggleCompleted(todo);
									}}
									class="h-5 w-5 rounded text-[#00ADB5] focus:ring-[#00ADB5]"
								/>
								<span
									class="text-lg font-medium"
									class:line-through={todo.completed}
									class:text-[#999999]={todo.completed}
								>
									{todo.text}
								</span>
							</div>
							<div class="flex gap-2">
								<button
									on:click={(e) => {
										e.stopPropagation();
										handleDeleteTodo(todo.id);
									}}
									class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
								>
									Delete
								</button>
								<button
									on:click={(e) => {
										e.stopPropagation();
										editingTodoId = todo.id;
										editedText = todo.text;
										editedImageFile = null;
										editedVideoFile = null;
										expandedTodoId = todo.id; // Auto-expand on edit
									}}
									class="hover:bg-opacity-90 rounded-md bg-[#00ADB5] px-4 py-2 text-sm font-semibold text-white"
								>
									Edit
								</button>
							</div>
						</div>

						{#if expandedTodoId === todo.id}
							<div class="border-t border-[#2c2f35] px-4 py-4">
								{#if editingTodoId === todo.id}
									<form class="space-y-3" on:submit|preventDefault={() => handleEditTodo(todo)}>
										<input
											type="text"
											class="w-full rounded-md border border-[#00ADB5] bg-[#222831] px-3 py-2 text-[#EEEEEE]"
											bind:value={editedText}
											required
										/>
										<div class="flex gap-4">
											<div class="flex flex-1 flex-col">
												<input
													type="file"
													accept="image/*"
													on:change={(e) => {
														const files = (e.target as HTMLInputElement).files;
														editedImageFile = files && files.length > 0 ? files[0] : null;
													}}
												/>
												<p class="mt-1 text-center text-xs text-[#D7D7D7]">Image</p>
											</div>
											<div class="flex flex-1 flex-col">
												<input
													type="file"
													accept="video/*"
													on:change={(e) => {
														const files = (e.target as HTMLInputElement).files;
														editedVideoFile = files && files.length > 0 ? files[0] : null;
													}}
												/>
												<p class="mt-1 text-center text-xs text-[#D7D7D7]">Video</p>
											</div>
										</div>
										<div class="flex gap-2">
											<button class="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
												>Update</button
											>
											<button
												type="button"
												class="rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600"
												on:click={() => (editingTodoId = null)}>Cancel</button
											>
										</div>
									</form>
								{:else if todo.imageUrl || todo.videoUrl}
									<div class="flex items-center gap-4">
										{#if todo.imageUrl}
											<img
												src={todo.imageUrl}
												alt=""
												class="mb-2 h-40 w-64 rounded border border-[#00ADB5] object-cover"
											/>
										{/if}
										{#if todo.videoUrl}
											<video
												src={todo.videoUrl}
												controls
												class="mb-2 h-40 w-64 rounded border border-[#00ADB5] object-cover"
											></video>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}

				{#if $todos.filter((t) => (showCompleted ? t.completed : !t.completed)).length === 0}
					<div class="rounded-xl bg-[#393E46] py-10 text-center text-[#EEEEEE]">
						<h3 class="mb-1 text-xl font-semibold">
							No {showCompleted ? 'completed' : 'incomplete'} tasks
						</h3>
						<p class="text-sm">
							{showCompleted
								? 'Tick the checkbox to mark tasks as completed.'
								: 'Start by adding your first task above.'}
						</p>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
