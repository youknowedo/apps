<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { logout } from '$lib/utils';
	import { Button } from '@shared/ui/components';
	import { Buffer } from 'buffer';
	import QrCode from 'lucide-svelte/icons/qr-code';
	import * as OTPAuth from 'otpauth';
	import QRCode from 'qrcode';

	let token: string;
	let qr: string;

	user.subscribe(async (u) => {
		if (!u) return;

		let localQrId = localStorage.getItem('qr_id');
		if (!localQrId) return logout();

		const { success } = await trpc.qr.validate.query(localQrId);
		if (!success) return logout();

		const qrId = Uint8Array.from(Buffer.from(localQrId, 'hex'));

		let secret = new OTPAuth.Secret({ buffer: qrId.buffer });
		let totp = new OTPAuth.TOTP({
			algorithm: 'SHA1',
			digits: 6,
			period: 10,
			secret
		});

		const generate = async () => {
			token = totp.generate() ?? token;
			let seconds = totp.period - (Math.floor(Date.now() / 1000) % totp.period);

			qr = await QRCode.toDataURL(
				JSON.stringify({
					userId: u.id,
					token
				}),
				{ errorCorrectionLevel: 'H', scale: 10 }
			);

			setTimeout(generate, seconds * 1000);
		};

		generate();
	});
</script>

<div class="relative flex flex-col items-center justify-center flex-1 w-full pb-24">
	<Button
		on:click={() => goto('/start/scan')}
		class="absolute top-0 right-0 h-12"
		variant="ghost"
		size="sm"
	>
		<QrCode class="w-6 h-6 border-black drop-shadow-2xl" />
	</Button>

	{#if qr}
		<img class="h-64" src={qr} alt="" />
	{:else}
		Loading...
	{/if}
</div>
