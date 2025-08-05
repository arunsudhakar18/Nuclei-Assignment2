<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto, afterNavigate } from '$app/navigation';
import { auth } from '$lib/services/firebase';
	import { get, derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/authStore';
	import { signOut } from 'firebase/auth';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { ClipboardList } from 'lucide-svelte';

	function publicpath(path: string) {
		return path === '/' || path === '/login' || path === '/register';
	}

	function privatepath(path: string) {
		return path === '/app' || path.startsWith('/app/');
	}

	const isAppPage = derived(
		page,
		($page) => $page.url.pathname === '/app' || $page.url.pathname.startsWith('/app/')
	);

	onMount(() => {
		const unsub = auth.onAuthStateChanged((firebaseUser) => {
			if (firebaseUser) {
				user.set({ email: firebaseUser.email ?? '' });
			} else {
				user.set(null);
			}
		});

		function guard() {
			const currentUser = get(user);
			const path = window.location.pathname;

			if (currentUser && publicpath(path)) {
				goto('/app');
			} else if (!currentUser && privatepath(path)) {
				goto('/login');
			}
		}

		guard();
		afterNavigate(guard);

		return unsub;
	});

	function logout() {
		signOut(auth).then(() => {
			user.set(null);
			toast.push('Logout successful!', {
				theme: {
					'--toastBackground': '#d1fae5',
					'--toastColor': '#065f46',
					'--toastBarBackground': '#10b981'
				}
			});
			goto('/login');
		});
	}
</script>

{#if $isAppPage}
	<header class="bg-[#222831] text-[#EEEEEE] shadow-md">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<h1 class="flex items-center gap-2 text-xl font-semibold">
				<ClipboardList class="h-6 w-6 text-[#00ADB5]" />
				<span class="hidden sm:inline">TaskFlow</span>
			</h1>
			<div class="flex items-center gap-4">
				{#if $user}
					<div class="hidden text-sm sm:block">
						<span class="font-medium text-[#EEEEEE]">{$user.email}</span>
					</div>
				{/if}
				<button
					class="rounded-md bg-[#00ADB5] px-4 py-1.5 text-sm font-medium text-[#222831] shadow transition hover:bg-[#00a2ab] focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
					on:click={logout}
				>
					Logout
				</button>
			</div>
		</div>
	</header>
{/if}

<main class="min-h-screen bg-[#393E46]">
	<slot />
	<SvelteToast />
</main>
