<script lang="ts">
	import { auth } from '$lib/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';

	async function signup() {
		error = '';
		try {
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			goto('/login');
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-2 text-center text-2xl font-semibold text-gray-800">Create Account</h2>
		<p class="mb-6 text-center text-sm text-gray-500">Sign up to get started</p>

		<form on:submit|preventDefault={signup} class="space-y-4">
			<input
				type="email"
				placeholder="Email"
				bind:value={email}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
			/>

			<input
				type="password"
				placeholder="Password"
				bind:value={password}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
			/>

			<button
				type="submit"
				disabled={!email || !password}
				class="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Create Account
			</button>

			{#if error}
				<p class="rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-600">
					{error}
				</p>
			{/if}
		</form>

		<div class="mt-6 text-center text-sm text-gray-600">
			<p>
				Already have an account?
				<a href="/login" class="text-green-600 hover:underline">Sign in</a>
			</p>
		</div>
	</div>
</div>
