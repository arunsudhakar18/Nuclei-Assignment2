<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-blue-50 p-4">
	<div class="mx-auto w-full max-w-md rounded-xl bg-blue-50 p-8 text-center">
		<div class="mb-8">
			<div
				class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl text-white"
			>
				✓
			</div>
			<h1 class="mb-3 text-3xl font-bold text-blue-900">TaskFlow</h1>
			<p class="text-base text-blue-600">Organize your work, simplify your life</p>
		</div>

		<div class="space-y-4">
			<button
				class="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-3 focus:ring-blue-300 focus:outline-none"
				on:click={() => goto('/login')}
			>
				Sign in to your account
			</button>

			<button
				class="w-full rounded-lg border-2 border-blue-200 bg-blue-50 px-6 py-3.5 text-base font-semibold text-blue-700 transition-colors hover:bg-blue-100 focus:ring-3 focus:ring-blue-300 focus:outline-none"
				on:click={() => goto('/register')}
			>
				Create new account
			</button>
		</div>
	</div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background-color: #dbeafe;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
