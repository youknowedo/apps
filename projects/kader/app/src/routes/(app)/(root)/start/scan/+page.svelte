<script lang="ts">
	import { goto } from '$app/navigation';
	import { offline, user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import type { User } from '@kader/shared';
	import { Button } from '@shared/ui/components';
	import ScanQrCode from 'lucide-svelte/icons/scan-qr-code';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let video: HTMLVideoElement;
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

				goto(`/user?userId=${userId}&token=${token}`);
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
</div>

<div class={scanner ? 'hidden' : ''}>Loading...</div>

<video id="scanner" class="absolute inset-0 object-cover h-screen -z-10" bind:this={video}>
	<div class="placeholder">No cameras loaded!</div>
	<track kind="captions" />
</video>
