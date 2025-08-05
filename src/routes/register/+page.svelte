<script lang="ts">
	import { auth } from '$lib/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';

	let email = '';
	let password = '';
	let cpassword = '';
	let error = '';

	function isValidPassword(pass: string): boolean {
		const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
		return pattern.test(pass);
	}

	async function signup() {
		error = '';
		if (password !== cpassword) {
			error = 'Passwords is not matching.';
			return;
		}

		if (!isValidPassword(password)) {
			error =
				'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.';
			return;
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			toast.push('Account created successfully!', {
				theme: {
					'--toastBackground': '#333',
					'--toastColor': '#fff',
					'--toastBarBackground': '#0f0'
				}
			});
			goto('/login');
		} catch (e: any) {
			error = e;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#222831] px-4">
	<div class="w-full max-w-md rounded-2xl bg-[#393E46] p-8 shadow-xl">
		<h2 class="mb-2 text-center text-3xl font-bold text-[#EEEEEE]">Create Account</h2>
		<p class="mb-6 text-center text-sm text-[#B6B09F]">Sign up to get started</p>

		<form on:submit|preventDefault={signup} class="space-y-4">
			<input
				type="email"
				placeholder="Email"
				bind:value={email}
				required
				class="w-full rounded-lg border border-[#00ADB5] bg-[#222831] px-4 py-3 text-[#EEEEEE] placeholder-gray-400 focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
			/>

			<input
				type="password"
				placeholder="Password"
				bind:value={password}
				required
				class="w-full rounded-lg border border-[#00ADB5] bg-[#222831] px-4 py-3 text-[#EEEEEE] placeholder-gray-400 focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
			/>

			<input
				type="password"
				placeholder="Confirm Password"
				bind:value={cpassword}
				required
				class="w-full rounded-lg border border-[#00ADB5] bg-[#222831] px-4 py-3 text-[#EEEEEE] placeholder-gray-400 focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
			/>

			<button
				type="submit"
				disabled={!email || !password || !cpassword}
				class="hover:bg-opacity-80 w-full rounded-lg bg-[#00ADB5] py-3 font-semibold text-[#222831] transition duration-200 focus:ring-2 focus:ring-[#EEEEEE] disabled:cursor-not-allowed disabled:opacity-50"
			>
				Create Account
			</button>

			{#if error}
				<p class="rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700">
					{error}
				</p>
			{/if}
		</form>

		<div class="mt-6 text-center text-sm text-[#EEEEEE]">
			<p>
				Already have an account?
				<a href="/login" class="text-[#00ADB5] hover:underline">Sign in</a>
			</p>
		</div>
	</div>
</div>
