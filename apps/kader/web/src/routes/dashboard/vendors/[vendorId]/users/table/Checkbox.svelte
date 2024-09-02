<script lang="ts">
	import { Checkbox } from '@youknowedo/ui/components';
	import type { Writable } from 'svelte/store';

	export let checked: Writable<boolean>;
</script>

<Checkbox bind:checked={$checked} />
