<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { SvelteComponent } from 'svelte';
	import type { NavigationItem } from './index.js';

	let switching = false;

	export let border = false;
	export let items: NavigationItem[];
	let navigationItems: NavigationItem<typeof SvelteComponent>[] = items as any;

	$: position = items.findIndex((item) => $page.url.pathname.startsWith(item.href));

	const n = items.length;
	const halfSpace = (160 - 36 * n) / n;
	const width = 320 - 2 * halfSpace - 72;
</script>

<div
	class="absolute z-50 flex items-center justify-around h-20 duration-200 bottom-12 rounded-3xl w-80 bg-card text-card-foreground border shadow-sm {border
		? 'border-primary'
		: ''}"
>
	<div
		class="absolute w-16 h-16 duration-500 rounded-full bg-primary neu-r -z-10 {switching
			? 'elongate'
			: ''}"
		style="left: {position * (width / n) + halfSpace + 4 + 36 * position}px;"
	/>

	{#each navigationItems as item}
		<button
			on:click={() => {
				switching = true;
				setTimeout(() => {
					switching = false;
				}, 500);
				goto(item.href);
			}}
		>
			{#if item.icon}
				<svelte:component this={item.icon} class="w-6 h-6 m-6" />
			{:else}
				<img src={item.img} alt="" class="w-6 h-6 m-6" />
			{/if}
		</button>
	{/each}
</div>
