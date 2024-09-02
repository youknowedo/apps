<script>
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Card } from '@youknowedo/ui/components';
	import '@youknowedo/ui/styles.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	onMount(async () => {
		const { user: u } = await trpc.user.getSingle.query();
		user.set(u ?? null);

		if (u) localStorage.setItem('user', JSON.stringify(u));
	});
</script>

<ModeWatcher />

{#if $user !== undefined}
	<slot />
{:else}
	<div class="flex items-center justify-center w-screen h-screen">Loading...</div>
{/if}
