<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc';
	import type { User } from '@kader/shared';
	import { Button, Separator } from '@shared/ui/components';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let user: User | null = null;

	onMount(async () => {
		const { user: u } = await trpc.user.fromQr.query({
			userId: $page.params.userId,
			token: $page.params.token
		});

		if (!u) {
			toast.error('Invalid QR');
			return goto('/start');
		}

		user = u;
	});
</script>

<div class="flex flex-col h-screen pb-20">
	{#if user}
		<div class="flex flex-col flex-1">
			<div class="flex-1">
				<label for="picture" class=" neu-up">
					<img src={user.pfp} alt="Profile" class="object-cover w-40 h-40 m-auto rounded-full" />
				</label>

				<Separator class="box-content w-64 h-0.5 mx-auto my-12 rounded-full bg-background" />

				<h1>{user.full_name}</h1>
				<p>@{user.username}</p>
			</div>
		</div>
	{:else}
		Loading...
	{/if}
</div>

<Button
	on:click={() => goto('/start')}
	class="box-border absolute h-20 text-2xl w-80 bottom-12 rounded-3xl neu-r neu-up"
>
	Back
</Button>
