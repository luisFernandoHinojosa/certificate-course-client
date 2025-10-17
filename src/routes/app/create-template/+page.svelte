<script lang="ts">
	import ProgressSteps from '$lib/components/ui/progressSteps.svelte';
	import StepData from '$lib/components/ui/stepData.svelte';
	import StepDesign from '$lib/components/ui/stepDesign.svelte';
	import StepSend from '$lib/components/ui/stepSend.svelte';
	import type { ExcelData, TemplateConfig } from '$lib/interfaces/createTemplatee.interface';
	import { onMount } from 'svelte';
	import * as XLSX from 'xlsx';

	let step = 1;

	// Template configuration
	let templateConfig: TemplateConfig = {
		imageFile: null,
		imageUrl: null,
		overlayText: 'Nombre del participante',
		yOffset: 0,
		fontSize: 48,
		fontIndex: 0
	};

	// Excel data
	let excelData: ExcelData = {
		file: null,
		json: [],
		headers: []
	};

	// Message
	let message = '';

	function goNext() {
		if (step < 3) step += 1;
	}

	function goPrev() {
		if (step > 1) step -= 1;
	}

	function handleTemplateUpdate(config: TemplateConfig) {
		templateConfig = config;
	}

	function handleExcelUpdate(data: ExcelData) {
		excelData = data;
	}

	function handleSendExcel() {
		console.log('Send Excel', { headers: excelData.headers, data: excelData.json });
		alert('Excel procesado correctamente. Los datos están listos para generar certificados.');
	}

	function handleSendMessage() {
		console.log('Sending message:', message);
		alert('Mensaje enviado correctamente.');
	}

	onMount(() => {
		return () => {
			if (templateConfig.imageUrl) {
				URL.revokeObjectURL(templateConfig.imageUrl);
			}
		};
	});
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Header -->
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto max-w-6xl px-6 py-6">
			<h1 class="text-2xl font-semibold text-slate-900">Generador de Certificados</h1>
			<p class="mt-1 text-sm text-slate-600">
				Crea plantillas, importa datos y envía certificados personalizados
			</p>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-6xl px-6 py-8">
		<!-- Progress Steps -->
		<ProgressSteps {step} />

		<!-- Content Card -->
		<div class="rounded-lg border border-slate-200 bg-white shadow-sm">
			{#if step === 1}
				<StepDesign
					config={templateConfig}
					on:update={(e) => handleTemplateUpdate(e.detail)}
					on:next={goNext}
				/>
			{:else if step === 2}
				<StepData
					data={excelData}
					on:update={(e) => handleExcelUpdate(e.detail)}
					on:prev={goPrev}
					on:next={goNext}
					on:process={handleSendExcel}
				/>
			{:else if step === 3}
				<StepSend
					bind:message
					templateFileName={templateConfig.imageFile?.name}
					participantCount={excelData.json.length}
					on:prev={goPrev}
					on:send={handleSendMessage}
				/>
			{/if}
		</div>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&family=Lora:wght@400;700&display=swap');
</style>
