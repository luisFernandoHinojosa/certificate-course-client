<script lang="ts">
	import { FONTS, type TemplateConfig } from '$lib/interfaces/createTemplatee.interface';
	import { createEventDispatcher } from 'svelte';
	import CertificatePreview from './certificatePreview.svelte';
	import FileUpload from './fileUpload.svelte';
	import RangeSlider from './rangeSlider.svelte';
	import FontSelector from './fontSelector.svelte';

	export let config: TemplateConfig;

	const dispatch = createEventDispatcher();

	let imageContainer: HTMLDivElement;
	let containerHeight = 0;

	function handleImageUpload(e: CustomEvent) {
		const target = e.detail as HTMLInputElement; // e.detail ahora contiene el target
		const file = target.files?.[0];
		if (!file) return;

		if (config.imageUrl) {
			URL.revokeObjectURL(config.imageUrl);
		}

		const newConfig = {
			...config,
			imageFile: file,
			imageUrl: URL.createObjectURL(file)
		};

		dispatch('update', newConfig);
	}

	function updateConfig(updates: Partial<TemplateConfig>) {
		dispatch('update', { ...config, ...updates });
	}

	function prevFont() {
		updateConfig({ fontIndex: (config.fontIndex - 1 + FONTS.length) % FONTS.length });
	}

	function nextFont() {
		updateConfig({ fontIndex: (config.fontIndex + 1) % FONTS.length });
	}

	function reset() {
		updateConfig({ yOffset: 0, fontSize: 48, fontIndex: 0 });
	}

	function handleNext() {
		console.log('config: ', config);

		dispatch('next');
	}

	// Calculate max Y offset based on container height
	$: maxYOffset = containerHeight > 0 ? Math.floor(containerHeight / 2) : 200;
</script>

<div class="p-8">
	<div class="mb-6">
		<h2 class="text-lg font-semibold text-slate-900">Diseño de Plantilla</h2>
		<p class="mt-1 text-sm text-slate-600">Sube tu certificado base y personaliza el texto</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Preview -->
		<div>
			<label class="mb-3 block text-sm font-medium text-slate-700">Vista previa</label>
			<CertificatePreview
				imageUrl={config.imageUrl}
				overlayText={config.overlayText}
				yOffset={config.yOffset}
				fontSize={config.fontSize}
				fontFamily={FONTS[config.fontIndex]}
				bind:containerElement={imageContainer}
				bind:containerHeight
			/>
		</div>

		<!-- Controls -->
		<div class="space-y-6">
			<!-- Upload Image -->
			<FileUpload
				label="Imagen del certificado"
				accept="image/*"
				fileName={config.imageFile?.name}
				helpText="PNG, JPG hasta 10MB"
				on:change={handleImageUpload}
			/>

			<!-- Text Input -->
			<div>
				<label class="mb-2 block text-sm font-medium text-slate-700">Texto del certificado</label>
				<input
					type="text"
					class="focus:ring-opacity-20 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					value={config.overlayText}
					on:input={(e) => updateConfig({ overlayText: e.currentTarget.value })}
					placeholder="Ingresa el texto a mostrar"
				/>
			</div>

			<!-- Position Control -->
			<RangeSlider
				label="Posición vertical"
				min={-maxYOffset}
				max={maxYOffset}
				value={config.yOffset}
				unit="px"
				on:input={(e) => updateConfig({ yOffset: parseInt(e.detail) })}
			/>

			<!-- Font Size -->
			<RangeSlider
				label="Tamaño de fuente"
				min={20}
				max={100}
				value={config.fontSize}
				unit="px"
				on:input={(e) => updateConfig({ fontSize: parseInt(e.detail) })}
			/>

			<!-- Font Selector -->
			<FontSelector
				fonts={FONTS}
				currentIndex={config.fontIndex}
				on:prev={prevFont}
				on:next={nextFont}
			/>

			<!-- Actions -->
			<div class="flex gap-3 pt-4">
				<button
					on:click={reset}
					class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
				>
					Restablecer
				</button>
				<button
					on:click={handleNext}
					disabled={!config.imageUrl}
					class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Continuar
				</button>
			</div>
		</div>
	</div>
</div>
