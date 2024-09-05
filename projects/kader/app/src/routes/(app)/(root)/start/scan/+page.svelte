<script lang="ts">
	import { goto } from '$app/navigation';
	import { offline, user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import type { User } from '@kader/shared';
	import { Button } from '@shared/ui/components';
	import QrCode from 'lucide-svelte/icons/qr-code';
	import ScanQrCode from 'lucide-svelte/icons/scan-qr-code';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let video: HTMLVideoElement;
	let scannedUser: User | null = null;

	let scanner: QrScanner | null = null;

	onMount(() => {
		if ($offline) {
			toast.error('You are offline!');
			goto('/start');
			return;
		}

		scanner = new QrScanner(
			video,
			async (result) => {
				const {
					userId,
					token
				}: {
					userId: string;
					token: string;
				} = JSON.parse(result.data);

				const { user: u } = await trpc.user.fromQr.query({ userId, token });

				if (!u) return;

				scannedUser = u;
			},
			{
				preferredCamera: 'environment'
			}
		);
		scanner.start();
	});
</script>

<div class="relative flex flex-col items-center justify-center flex-1 w-full pb-24">
	<Button
		on:click={() => goto('/start')}
		class="absolute top-0 right-0 h-12"
		variant="secondary"
		size="sm"
	>
		<ScanQrCode class="w-6 h-6 border-black drop-shadow-2xl" />
	</Button>

	{#if $offline && $user?.role === 'vendor'}
		You are offline. Cannot scan QR codes.
	{/if}

	<div class="flex-col items-center justify-center {scannedUser ? 'flex' : 'hidden'}">
		<img class="w-24 h-24 rounded-full" src={scannedUser?.pfp} alt="" />
		<p class="mt-2 text-lg font-semibold">{scannedUser?.full_name}</p>
		<p class="mt-1 text-sm text-gray-500">{scannedUser?.email}</p>

		<Button on:click={() => ((scannedUser = null), scanner?.start())}>Back</Button>
	</div>
</div>

<div class={scanner ? 'hidden' : ''}>Loading...</div>

<video
	id="scanner"
	class="absolute inset-0 h-screen -z-10 object-cover {scannedUser ? 'hidden' : ''}"
	bind:this={video}
>
	<div class="placeholder">No cameras loaded!</div>
	<track kind="captions" />
</video>
