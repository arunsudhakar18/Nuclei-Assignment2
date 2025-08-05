<script lang="ts">
	import { auth } from '$lib/services/firebase'
	import { toast } from '@zerodevx/svelte-toast';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/authStore';

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

<div class="flex min-h-screen items-center justify-center bg-[#222831] px-4 text-[#EEEEEE]">
	<div class="mx-auto w-full max-w-md rounded-xl bg-[#393E46] p-8 text-center shadow-lg">
		<div class="mb-8">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#00ADB5] text-3xl text-[#222831] shadow-lg"
			>
				👤
			</div>
			<h2 class="mb-3 text-3xl font-bold">Sign In</h2>
			<p class="text-base text-[#EEEEEE]">Enter your credentials to continue</p>
		</div>

		<form on:submit|preventDefault={login} class="space-y-5">
			<div>
				<input
					type="email"
					placeholder="Email address"
					bind:value={email}
					required
					class="w-full rounded-lg border border-[#00ADB5] bg-[#222831] px-4 py-3.5 text-[#EEEEEE] placeholder-[#B6B09F] focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
				/>
			</div>
			<div>
				<input
					type="password"
					placeholder="Password"
					bind:value={password}
					required
					class="w-full rounded-lg border border-[#00ADB5] bg-[#222831] px-4 py-3.5 text-[#EEEEEE] placeholder-[#B6B09F] focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				disabled={!email || !password}
				class="hover:bg-opacity-90 w-full rounded-lg bg-[#00ADB5] px-6 py-3.5 font-semibold text-[#222831] shadow transition disabled:opacity-50"
			>
				Sign In
			</button>

			{#if error}
				<div class="rounded-lg border border-[#00ADB5] bg-[#393E46] p-4 text-sm text-red-400">
					{error}
				</div>
			{/if}
		</form>

		<div class="mt-8 space-y-3 border-t border-[#00ADB5] pt-6 text-center">
			<a href="/register" class="block font-medium text-[#00ADB5] hover:underline">
				Don't have an account? Create one
			</a>
		</div>
	</div>
</div>
