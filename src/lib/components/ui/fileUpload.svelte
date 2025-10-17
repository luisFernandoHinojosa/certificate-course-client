<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label: string;
	export let accept: string;
	export let fileName: string | undefined = undefined;
	export let helpText: string = '';
	export let icon: 'image' | 'document' = 'image';

	const dispatch = createEventDispatcher();

	function handleChange(e: Event) {
		dispatch('change', e.target); // Pasar e.target en lugar del evento completo
	}
</script>

<div>
	<label class="mb-2 block text-sm font-medium text-slate-700">{label}</label>
	<label
		class="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-4 transition hover:border-blue-400 hover:bg-blue-50"
	>
		<div class="text-center">
			{#if icon === 'image'}
				<svg
					class="mx-auto h-8 w-8 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
			{:else}
				<svg
					class="mx-auto h-8 w-8 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			{/if}
			<p class="mt-2 text-sm text-slate-600">
				{fileName || 'Seleccionar archivo'}
			</p>
			{#if helpText}
				<p class="mt-1 text-xs text-slate-500">{helpText}</p>
			{/if}
		</div>
		<input type="file" {accept} on:change={handleChange} class="hidden" />
	</label>
</div>
