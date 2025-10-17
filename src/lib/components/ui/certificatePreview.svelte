<script lang="ts">
	import { onMount } from 'svelte';

	export let imageUrl: string | null;
	export let overlayText: string;
	export let yOffset: number;
	export let fontSize: number;
	export let fontFamily: string;
	export let containerElement: HTMLDivElement | undefined = undefined;
	export let containerHeight = 0;

	let container: HTMLDivElement;

	onMount(() => {
		const updateHeight = () => {
			if (container) {
				containerHeight = container.clientHeight;
			}
		};

		updateHeight();
		window.addEventListener('resize', updateHeight);

		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	});

	$: if (container) {
		containerElement = container;
	}
</script>

<div
	bind:this={container}
	class="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50"
>
	{#if imageUrl}
		<img src={imageUrl} alt="preview" class="h-full w-full object-contain" />
		<div
			class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-slate-800 select-none"
			style="transform: translate(-50%, calc(-50% + {yOffset}px)); font-size: {fontSize}px; font-family: {fontFamily}; text-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 90%;"
		>
			{overlayText}
		</div>
	{:else}
		<div class="flex h-full flex-col items-center justify-center text-slate-400">
			<svg class="mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<p class="text-sm">No hay imagen cargada</p>
		</div>
	{/if}
</div>
