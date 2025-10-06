<script lang="ts">
	let yCoord: number | null = null;
	let tamanoFuente: number | null = null;
	let plantillaPng: File | null = null;
	let fuenteTtf: File | null = null;
	let previewUrl: string | null = null;
	let error: string = '';
	let successMessage: string = '';

	function handleImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.type === 'image/png') {
			plantillaPng = file;
			previewUrl = URL.createObjectURL(file);
		} else {
			error = 'El archivo debe ser una imagen PNG.';
			previewUrl = null;
			plantillaPng = null;
		}
	}

	function handleSubmit() {
		error = '';
		successMessage = '';

		if (!plantillaPng) {
			error = 'Debes subir una imagen de fondo (PNG).';
			return;
		}

		if (yCoord === null || yCoord < 0 || yCoord > 1000) {
			error = 'La coordenada Y debe estar entre 0 y 1000.';
			return;
		}

		if (tamanoFuente === null || tamanoFuente < 10 || tamanoFuente > 100) {
			error = 'El tamaño de fuente debe estar entre 10 y 100.';
			return;
		}

		// Simulación de respuesta
		const fakeId = crypto.randomUUID();
		successMessage = `✅ Plantilla creada con éxito. ID: ${fakeId}`;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
	<div class="flex w-full max-w-4xl flex-col gap-8 rounded-lg bg-white p-8 shadow-md lg:flex-row">
		<!-- Formulario -->
		<div class="flex-1 space-y-4">
			<h1 class="text-2xl font-semibold text-gray-800">Crear Plantilla de Certificado</h1>

			<!-- Imagen -->
			<div>
				<label class="mb-1 block text-sm font-medium">Imagen de fondo (PNG)</label>
				<input type="file" accept="image/png" on:change={handleImageUpload} class="w-full" />
			</div>

			<!-- Coordenada Y -->
			<div>
				<label class="mb-1 block text-sm font-medium">Coordenada Y (0 a 1000)</label>
				<input
					type="number"
					bind:value={yCoord}
					min="0"
					max="1000"
					class="w-full rounded-md border px-3 py-2"
				/>
			</div>

			<!-- Tamaño de fuente -->
			<div>
				<label class="mb-1 block text-sm font-medium">Tamaño de fuente (10 a 100)</label>
				<input
					type="number"
					bind:value={tamanoFuente}
					min="10"
					max="100"
					class="w-full rounded-md border px-3 py-2"
				/>
			</div>

			<!-- Fuente opcional -->
			<div>
				<label class="mb-1 block text-sm font-medium">Fuente personalizada (opcional)</label>
				<input
					type="file"
					accept=".ttf,.otf"
					on:change={(e) => (fuenteTtf = (e.target as HTMLInputElement).files?.[0] || null)}
					class="w-full"
				/>
			</div>

			<!-- Errores y éxito -->
			{#if error}
				<p class="text-sm text-red-600">{error}</p>
			{/if}

			{#if successMessage}
				<p class="text-sm text-green-600">{successMessage}</p>
			{/if}

			<!-- Botón -->
			<button
				on:click={handleSubmit}
				class="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
			>
				Crear Plantilla
			</button>
		</div>

		<!-- Preview imagen -->
		{#if previewUrl}
			<div class="flex flex-none flex-col items-center justify-start">
				<h2 class="mb-4 text-lg font-medium text-gray-700">Vista previa</h2>
				<div
					class="flex h-36 w-36 items-center justify-center overflow-hidden rounded-md bg-gray-200"
				>
					<img src={previewUrl} alt="Vista previa" class="h-full w-full object-contain" />
				</div>
			</div>
		{/if}
	</div>
</div>
