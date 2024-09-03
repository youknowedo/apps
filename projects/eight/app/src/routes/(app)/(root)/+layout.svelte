<script lang="ts">
	import Compass from 'lucide-svelte/icons/compass';
	import Users from 'lucide-svelte/icons/users';

	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { sessionStarted, user } from '$lib/stores';
	import { BottomNavigation, type NavigationItem } from '@shared/ui/app';
	import { onMount, SvelteComponent } from 'svelte';

	let items: NavigationItem<typeof Compass>[] = [
		{
			href: '/explore',
			icon: Compass
		},
		{
			href: '/start',
			img: '/logo.svg'
		},
		{
			href: '/social',
			icon: Users
		}
	];

	onMount(() => {
		if (!$user?.completed_profile) goto('/completeProfile');
	});
</script>

<div class="flex flex-col h-screen pb-20">
	<slot />
</div>
<BottomNavigation {items} border={$sessionStarted} />
