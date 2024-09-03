import BottomNavigation from './bottom-navigation.svelte';

export { BottomNavigation };

export type NavigationItem<T = unknown> = {
	href: string;
	icon?: T;
	img?: string;
};
