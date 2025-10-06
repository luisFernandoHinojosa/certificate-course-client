<script lang="ts">
	let code: string = '';
	let isLoading: boolean = false;
	let error: string = '';
	let certificateBase64: string | null = null;

	const mockBase64PDF =
		'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwgL0xlbmd0aCAyIDAgUiA+Pgpcbi9TdHJlYW0KIEJUIAovRm9vIEJhcgplbmRzdHJlYW0KZW5kb2JqCjIgMCBvYmoKMTAKZW5kb2JqCnhyZWYKMAozCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMTIzIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1Jvb3QgMSAwIFIgL1NpemUgMyA+PgpzdGFydHhyZWYKMTQ2CiUlRU9G';

	function fetchCertificate() {
		if (!code.trim()) {
			error = 'Por favor, ingresa un código válido.';
			return;
		}
		error = '';
		isLoading = true;
		setTimeout(() => {
			certificateBase64 = mockBase64PDF;
			isLoading = false;
		}, 1500);
	}

	function downloadCertificate() {
		if (!certificateBase64) return;
		const link = document.createElement('a');
		link.href = `data:application/pdf;base64,${certificateBase64}`;
		link.download = `certificado-${code}.pdf`;
		link.click();
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f8f8f2] p-6">
	<div
		class="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-10 text-center shadow-lg"
	>
		<h1 class="mb-2 font-serif text-3xl font-bold text-gray-800">Certificado de Finalización</h1>
		<div class="mx-auto mb-6 h-1 w-24 bg-gray-300"></div>

		<p class="mb-8 leading-relaxed text-gray-700">
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam itaque, maiores aspernatur
			quia iusto ipsam. Et tenetur esse consequuntur debitis expedita maiores reiciendis, labore
			quidem quo facere facilis blanditiis vel.
		</p>

		<input
			bind:value={code}
			type="text"
			placeholder="Ingresa tu código"
			class="w-full rounded-md border px-4 py-2 focus:ring focus:ring-gray-400 focus:outline-none"
		/>

		{#if error}
			<p class="mt-2 text-sm text-red-600">{error}</p>
		{/if}

		<button
			on:click={fetchCertificate}
			class="mt-6 w-full rounded-md bg-gray-800 py-2 text-white disabled:opacity-50"
			disabled={isLoading}
		>
			{#if isLoading}
				Generando...
			{:else}
				Obtener Certificado
			{/if}
		</button>

		{#if certificateBase64}
			<div class="mt-10">
				<h2 class="mb-4 font-serif text-lg font-semibold">Vista previa</h2>
				<iframe
					src={`data:application/pdf;base64,${certificateBase64}`}
					class="h-64 w-full rounded-md border"
				></iframe>

				<button
					on:click={downloadCertificate}
					class="mt-4 rounded-md bg-gray-700 px-6 py-2 text-white"
				>
					Descargar PDF
				</button>
			</div>
		{/if}
	</div>
</div>
