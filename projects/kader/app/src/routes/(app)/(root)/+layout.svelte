<script lang="ts">
	import Compass from 'lucide-svelte/icons/compass';
	import User from 'lucide-svelte/icons/user';

	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { BottomNavigation, type NavigationItem } from '@shared/ui/app';

	let switching = false;

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
			href: '/profile',
			icon: User
		}
	];
</script>

<div class="flex flex-col items-center h-screen pt-12 pb-32 overflow-x-hidden">
	<slot />
	<BottomNavigation
		{items}
		position={$page.url.pathname.startsWith('/explore')
			? 0
			: $page.url.pathname.startsWith('/profile')
				? 2
				: 1}
	/>
</div>
