<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	// You'll need to install `xlsx` for Excel parsing: npm i xlsx
	import * as XLSX from 'xlsx';

	let step = 1;

	// --- Step 1 state ---
	let imageFile: File | null = null;
	let imageUrl: string | null = null;
	let overlayText = 'Texto de ejemplo';

	// control sliders
	// horizontal slider (0..100) controls vertical translation of text
	let yControl = 0; // -100 .. 100
	let fontSize = 36; // px

	// fonts carousel
	const fonts = [
		'Inter, system-ui, sans-serif',
		'Poppins, system-ui, sans-serif',
		'Roboto, system-ui, sans-serif',
		'Montserrat, system-ui, sans-serif',
		'Playfair Display, Georgia, serif',
		'Times New Roman, Times, serif'
	];
	let fontIndex = 0;

	// --- Step 2 state ---
	let excelFile: File | null = null;
	let excelJson: any[] = [];
	let excelHeaders: string[] = [];

	// --- Step 3 state ---
	let longMessage = '';

	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files && target.files[0];
		if (!file) return;
		imageFile = file;
		if (imageUrl) URL.revokeObjectURL(imageUrl);
		imageUrl = URL.createObjectURL(file);
	}

	function handleExcelUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files && target.files[0];
		if (!file) return;
		excelFile = file;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const data = ev.target?.result;
			if (!data) return;
			const workbook = XLSX.read(data, { type: 'array' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
			excelJson = json as any[];
			excelHeaders = excelJson.length > 0 ? Object.keys(excelJson[0]) : [];
		};
		reader.readAsArrayBuffer(file);
	}

	function prevFont() {
		fontIndex = (fontIndex - 1 + fonts.length) % fonts.length;
	}
	function nextFont() {
		fontIndex = (fontIndex + 1) % fonts.length;
	}

	function resetStep1() {
		// keep overlay text but reset controls
		yControl = 0;
		fontSize = 36;
		fontIndex = 0;
	}

	function goNext() {
		if (step === 1) {
			step = 2;
		} else if (step === 2) {
			step = 3;
		}
	}

	function goPrev() {
		if (step > 1) step -= 1;
	}

	// dummy send functions
	function sendExcel() {
		// just log to console for now
		console.log('Send Excel', { excelHeaders, excelJson });
		alert('Excel listo para enviar (simulado). Revisa la consola.');
	}

	function sendMessage() {
		console.log('Sending message:', longMessage);
		alert('Mensaje enviado (simulado).');
	}

	// ensure we free the object URL when component destroyed
	onMount(() => {
		return () => {
			if (imageUrl) URL.revokeObjectURL(imageUrl);
		};
	});
</script>

<div class="mx-auto max-w-5xl p-4">
	<div class="mb-4 flex items-center justify-between">
		<div class="space-x-2">
			<button class="rounded bg-gray-200 px-3 py-1" on:click={goPrev} disabled={step === 1}
				>Prev</button
			>
			<button
				class="rounded bg-blue-600 px-3 py-1 text-white"
				on:click={goNext}
				disabled={step === 3}>Next</button
			>
		</div>
	</div>

	<!-- STEP INDICATOR -->
	<div class="mb-6 flex gap-2">
		<div class="flex-1">
			<div class="h-2 w-full overflow-hidden rounded bg-gray-200">
				<div class="h-2 bg-blue-600" style="width: {(step / 3) * 100}%"></div>
			</div>
			<div class="mt-1 text-sm">Paso {step} de 3</div>
		</div>
	</div>

	<!-- STEP 1 -->
	{#if step === 1}
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Left: preview area -->
			<div
				class="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded border border-gray-700 bg-gray-800"
			>
				{#if imageUrl}
					<img src={imageUrl} alt="preview" class="h-full w-full object-contain" />
				{:else}
					<div class="text-gray-400">Sube una imagen para comenzar</div>
				{/if}

				<!-- overlay text -->
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 transform"
					style="translate: 0px {yControl}px; font-size: {fontSize}px; font-family: {fonts[
						fontIndex
					]};"
				>
					<div class="pointer-events-none text-center whitespace-pre-wrap select-none">
						{overlayText}
					</div>
				</div>
			</div>

			<!-- Right: controls -->
			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium">Subir imagen</label>
					<input type="file" accept="image/*" on:change={handleImageUpload} />
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium">Texto (se muestra sobre la imagen)</label>
					<input class="w-full rounded bg-gray-100 p-2" bind:value={overlayText} />
				</div>

				<div class="flex items-center justify-between gap-4">
					<!-- Slider that moves the text on Y when moved horizontally -->
					<div class="flex-1">
						<label class="mb-1 block text-sm font-medium"
							>Mover texto (arrastra de izquierda a derecha)</label
						>
						<input type="range" min="-150" max="150" bind:value={yControl} />
						<div class="mt-1 text-xs">Desplazamiento Y: {yControl}px</div>
					</div>

					<!-- Font size control -->
					<div style="width: 160px;">
						<label class="mb-1 block text-sm font-medium">Tamaño de texto</label>
						<input type="range" min="12" max="120" bind:value={fontSize} />
						<div class="mt-1 text-xs">{fontSize}px</div>
					</div>
				</div>

				<!-- Fonts carousel -->
				<div class="rounded border p-3">
					<div class="mb-2 flex items-center justify-between">
						<button class="rounded border px-2 py-1" on:click={prevFont} aria-label="Anterior"
							>◀</button
						>
						<div class="text-sm">Tipografías</div>
						<button class="rounded border px-2 py-1" on:click={nextFont} aria-label="Siguiente"
							>▶</button
						>
					</div>

					<div class="flex h-20 items-center justify-center rounded bg-white">
						<!-- preview of current font -->
						<div style="font-family: {fonts[fontIndex]}; font-size: 18px;">
							Aa — {fonts[fontIndex].split(',')[0]}
						</div>
					</div>
				</div>

				<div class="flex gap-2">
					<button class="flex-1 rounded bg-gray-200 px-4 py-2" on:click={resetStep1}>Reset</button>
					<button
						class="flex-1 rounded bg-blue-600 px-4 py-2 text-white"
						on:click={() => (step = 2)}>Siguiente (Paso 2)</button
					>
				</div>
			</div>
		</div>
	{/if}

	<!-- STEP 2 -->
	{#if step === 2}
		<div class="space-y-4">
			<div>
				<label class="mb-1 block text-sm font-medium">Subir archivo Excel (.xlsx)</label>
				<input type="file" accept=".xlsx,.xls" on:change={handleExcelUpload} />
			</div>

			<div class="rounded border p-3">
				<div class="mb-2 text-sm font-medium">Vista previa del Excel (datos de prueba)</div>
				{#if excelJson.length === 0}
					<div class="text-sm text-gray-500">
						No hay datos. Sube un archivo Excel para verlo aquí.
					</div>
				{:else}
					<div class="max-h-64 overflow-auto">
						<table class="min-w-full text-sm">
							<thead>
								<tr>
									{#each excelHeaders as h}
										<th class="border px-2 py-1 text-left">{h}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each excelJson as row}
									<tr>
										{#each excelHeaders as h}
											<td class="border px-2 py-1">{row[h]}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>

			<div class="flex gap-2">
				<button class="rounded bg-gray-200 px-4 py-2" on:click={() => (step = 1)}
					>Volver al Paso 1</button
				>
				<button
					class="rounded bg-green-600 px-4 py-2 text-white"
					on:click={sendExcel}
					disabled={excelJson.length === 0}>Enviar Excel (simulado)</button
				>
			</div>
		</div>
	{/if}

	<!-- STEP 3 -->
	{#if step === 3}
		<div class="space-y-4">
			<label class="block text-sm font-medium">Mensaje largo</label>
			<textarea rows={8} class="w-full rounded bg-gray-50 p-3" bind:value={longMessage}></textarea>
			<div class="flex gap-2">
				<button class="rounded bg-gray-200 px-4 py-2" on:click={() => (step = 2)}
					>Volver al Paso 2</button
				>
				<button
					class="rounded bg-blue-600 px-4 py-2 text-white"
					on:click={sendMessage}
					disabled={!longMessage.trim()}>Enviar mensaje</button
				>
			</div>
		</div>
	{/if}
</div>

<!-- Load Google fonts used in carousel -->
<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@400;600&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
</style>
