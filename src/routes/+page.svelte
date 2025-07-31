<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">ToDo App</h1>
		<p class="mb-6 text-gray-600">A minimal and clean task manager to keep you organized.</p>

		<div class="flex flex-col gap-4">
			<button
				class="rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
				on:click={() => goto('/login')}
			>
				Sign In
			</button>

			<button
				class="rounded-md bg-green-600 py-3 font-medium text-white hover:bg-green-700"
				on:click={() => goto('/register')}
			>
				Register
			</button>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: sans-serif;
		background-color: #f3f4f6;
	}
</style>
