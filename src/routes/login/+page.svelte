<script lang="ts">
	import { auth } from '$lib/firebase';
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
			alert('Login successful');
			goto('/app');
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-2 text-center text-2xl font-semibold text-gray-800">Sign In</h2>
		<p class="mb-6 text-center text-sm text-gray-500">Enter your email and password to continue</p>

		<form on:submit|preventDefault={login} class="space-y-4">
			<input
				type="email"
				placeholder="Email"
				bind:value={email}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>

			<input
				type="password"
				placeholder="Password"
				bind:value={password}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>

			<button
				type="submit"
				disabled={!email || !password}
				class="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Login
			</button>

			{#if error}
				<p class="rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-600">
					{error}
				</p>
			{/if}
		</form>

		<div class="mt-6 flex flex-col gap-2 text-center text-sm text-gray-600">
			<a href="/register" class="text-blue-600 hover:underline">Don't have an account? Register</a>
			<a href="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</a>
		</div>
	</div>
</div>
