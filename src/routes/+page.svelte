<script lang="ts">
	import { goto } from '$app/navigation';
	import CheckCircle from 'lucide-svelte/icons/check-circle';
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-[#222831] p-4">
	<div class="mx-auto w-full max-w-md rounded-xl bg-[#393E46] p-8 text-center shadow-2xl">
		<div class="mb-8">
			<div
				class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00ADB5] text-white shadow-lg"
			>
				<CheckCircle class="h-10 w-10" />
			</div>
			<h1 class="mb-3 text-3xl font-bold text-[#EEEEEE]">TaskFlow</h1>
			<p class="text-base text-[#B6B09F]">Organize your work, simplify your life</p>
		</div>

		<div class="space-y-4">
			<button
				class="w-full rounded-lg bg-[#00ADB5] px-6 py-3.5 text-base font-semibold text-[#EEEEEE] transition hover:bg-[#00a3ab] focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
				on:click={() => goto('/login')}
			>
				Sign in to your account
			</button>

			<button
				class="w-full rounded-lg border-2 border-[#B6B09F] bg-[#393E46] px-6 py-3.5 text-base font-semibold text-[#EEEEEE] transition hover:bg-[#4a4f56] focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
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
		background-color: #222831;
		color: #eeeeee;
		overflow-x: hidden;
	}
</style>
