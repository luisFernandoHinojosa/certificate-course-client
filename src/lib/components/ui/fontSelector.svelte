<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let fonts: string[];
	export let currentIndex: number;

	const dispatch = createEventDispatcher();
</script>

<div>
	<label class="mb-2 block text-sm font-medium text-slate-700">Tipografía</label>
	<div class="flex items-center gap-3">
		<button
			on:click={() => dispatch('prev')}
			class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50"
			aria-label="Anterior"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<div class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3">
			<div
				class="text-center text-slate-900"
				style="font-family: {fonts[currentIndex]}; font-size: 20px;"
			>
				{fonts[currentIndex].split(',')[0]}
			</div>
		</div>

		<button
			on:click={() => dispatch('next')}
			class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50"
			aria-label="Siguiente"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</div>
