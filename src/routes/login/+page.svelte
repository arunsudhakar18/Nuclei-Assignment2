<script lang="ts">
	import { auth } from '$lib/firebase';
	import { toast } from '@zerodevx/svelte-toast';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { user } from '$lib/authStore';

	let email = '';
	let password = '';
	let error = '';

	async function login() {
		error = '';
		try {
			const cred = await signInWithEmailAndPassword(auth, email, password);
			user.set({ email: cred.user.email ?? '' });
			toast.push('Login successful!', {
				theme: {
					'--toastBackground': '#dcfce7',
					'--toastColor': '#166534',
					'--toastBarBackground': '#22c55e'
				}
			});
			goto('/app');
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-blue-50 p-4">
	<div class="mx-auto w-full max-w-md rounded-xl bg-blue-50 p-8">
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl text-white"
			>
				👤
			</div>
			<h2 class="mb-3 text-3xl font-bold text-blue-900">Welcome Back</h2>
			<p class="text-base text-blue-600">Enter your credentials to continue</p>
		</div>

		<form on:submit|preventDefault={login} class="space-y-5">
			<div>
				<input
					type="email"
					placeholder="Email address"
					bind:value={email}
					required
					class="w-full rounded-lg border-2 border-blue-200 bg-white px-4 py-3.5 text-blue-900 placeholder-blue-400 transition-colors focus:border-blue-500 focus:ring-3 focus:ring-blue-300 focus:outline-none"
				/>
			</div>

			<div>
				<input
					type="password"
					placeholder="Password"
					bind:value={password}
					required
					class="w-full rounded-lg border-2 border-blue-200 bg-white px-4 py-3.5 text-blue-900 placeholder-blue-400 transition-colors focus:border-blue-500 focus:ring-3 focus:ring-blue-300 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				disabled={!email || !password}
				class="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-3 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
			>
				Sign In
			</button>

			{#if error}
				<div class="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{error}
				</div>
			{/if}
		</form>

		<div class="mt-8 space-y-3 border-t border-blue-200 pt-6 text-center">
			<a
				href="/register"
				class="block font-medium text-blue-600 transition-colors hover:text-blue-800"
			>
				Don't have an account? Create one
			</a>
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
