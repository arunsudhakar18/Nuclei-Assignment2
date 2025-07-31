<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { get, derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { user } from '$lib/authStore';
	import { signOut } from 'firebase/auth';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { toast } from '@zerodevx/svelte-toast';

	function isPublicPath(path: string) {
		return path === '/' || path === '/login' || path === '/register';
	}

	function isPrivatePath(path: string) {
		return path === '/app' || path.startsWith('/app/');
	}

	const isAppPage = derived(
		page,
		($page) => $page.url.pathname === '/app' || $page.url.pathname.startsWith('/app/')
	);

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			if (firebaseUser) {
				user.set({ email: firebaseUser.email ?? '' });
			} else {
				user.set(null);
			}
		});

		function guard() {
			const currentUser = get(user);
			const path = window.location.pathname;
			if (currentUser && isPublicPath(path)) {
				goto('/app');
			} else if (!currentUser && isPrivatePath(path)) {
				goto('/login');
			}
		}

		guard();
		afterNavigate(guard);

		return unsubscribe;
	});

	function logout() {
		signOut(auth).then(() => {
			user.set(null);
			toast.push('Logout successful!', {
				theme: {
					'--toastBackground': '#333',
					'--toastColor': '#fff',
					'--toastBarBackground': '#0f0'
				}
			});
			goto('/');
		});
	}
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
	{#if $isAppPage}
		<header class="border-b border-gray-200 bg-white shadow-sm">
			<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<div class="flex items-center gap-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow"
					>
						📋
					</div>
					<div>
						<h1 class="text-xl font-bold">TODO List</h1>
						<p class="text-sm text-gray-500">Stay organized, stay productive</p>
					</div>
				</div>

				<div class="flex items-center gap-4">
					{#if $user}
						<div
							class="hidden items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 shadow-sm sm:flex"
						>
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white"
							>
								{$user.email.charAt(0).toUpperCase()}
							</div>
							<div class="text-sm">
								<div class="font-medium text-gray-800">Welcome back!</div>
								<div class="w-32 truncate text-gray-600">{$user.email}</div>
							</div>
						</div>
					{/if}

					<button
						class="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow transition hover:bg-red-600"
						on:click={logout}
					>
						<span class="text-lg">🚪</span>
						<span class="hidden text-sm sm:inline">Logout</span>
					</button>
				</div>
			</div>
		</header>
	{/if}

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<slot />
		<SvelteToast />
	</main>
</div>
