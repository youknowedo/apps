<script lang="ts">
	import Compass from 'lucide-svelte/icons/compass';
	import User from 'lucide-svelte/icons/user';

	import { BottomNavigation, type NavigationItem } from '@shared/ui/app';

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

<div class="flex flex-col h-screen pb-20">
	<slot />
</div>
<BottomNavigation {items} />
