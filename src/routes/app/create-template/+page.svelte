<script lang="ts">
	import ProgressSteps from '$lib/components/ui/progressSteps.svelte';
	import StepData from '$lib/components/ui/stepData.svelte';
	import StepDesign from '$lib/components/ui/stepDesign.svelte';
	import StepSend from '$lib/components/ui/stepSend.svelte';
	import type { TemplatePayload } from '$lib/interfaces/compaing.interface';
	import type { ExcelData, TemplateConfig } from '$lib/interfaces/createTemplatee.interface';
	import { campaignService } from '$lib/services/campaingService.service';
	import { idcampañaStore } from '$lib/stores/campaingStore';
	import { onMount } from 'svelte';
	import * as XLSX from 'xlsx';

	let step = 1;
	let campaignCreated = false;
	let isCreatingCampaign = false;
	let campaignId: string | null = null;
	let isUpdatingTemplateStep1 = false;
	let isUpdatingTemplateStep2 = false;

	// Template configuration
	let templateConfig: TemplateConfig = {
		imageFile: null,
		imageUrl: null,
		overlayText: 'Nombre del participante',
		yOffset: 0,
		fontSize: 48,
		fontIndex: 0
	};

	const compaingData: TemplatePayload = {
		x: 0,
		y: 0,
		font_size: 48,
		font_family: '001',
		certificate: null
	};

	// Excel data
	let excelData: ExcelData = {
		file: null,
		json: [],
		headers: []
	};

	// Message
	let message = '';

	onMount(() => {
		// Verificar si ya existe una campaña creada
		const storedId = idcampañaStore.get();
		if (storedId) {
			campaignId = storedId;
			campaignCreated = true;
		}

		return () => {
			if (templateConfig.imageUrl) {
				URL.revokeObjectURL(templateConfig.imageUrl);
			}
		};
	});

	async function createCampaign() {
		isCreatingCampaign = true;
		try {
			const response = await fetch('https://certhub-backend.onrender.com/campaigns/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Error al crear la campaña');
			}

			const data = await response.json();
			campaignId = data.campaign_id;

			// Guardar en el store
			idcampañaStore.set(campaignId as string);

			campaignCreated = true;

			console.log('Campaña creada exitosamente:', campaignId);
		} catch (error) {
			console.error('Error creando campaña:', error);
			alert('Error al crear la campaña. Por favor, intenta nuevamente.');
		} finally {
			isCreatingCampaign = false;
		}
	}

	function resetCampaign() {
		if (confirm('¿Estás seguro de que deseas reiniciar la campaña?')) {
			idcampañaStore.reset();
			campaignId = null;
			campaignCreated = false;
			step = 1;

			// Reset template config
			if (templateConfig.imageUrl) {
				URL.revokeObjectURL(templateConfig.imageUrl);
			}

			templateConfig = {
				imageFile: null,
				imageUrl: null,
				overlayText: 'Nombre del participante',
				yOffset: 0,
				fontSize: 48,
				fontIndex: 0
			};

			// Reset excel data
			excelData = {
				file: null,
				json: [],
				headers: []
			};

			message = '';
		}
	}

	const updateTemplate = async () => {
		console.log('Updating template...');
		if (!campaignId) {
			alert('No se ha creado una campaña. Por favor, crea una campaña primero.');
			return;
		}
		try {
			isUpdatingTemplateStep1 = true;
			compaingData.x = 0;
			compaingData.y = 60;
			compaingData.font_size = templateConfig.fontSize;
			compaingData.font_family = '001';
			compaingData.certificate = templateConfig.imageFile;
			const response = await campaignService.updateTemplate(
				idcampañaStore.get() as string,
				compaingData
			);
			console.log('Response: ', response);
			goNext();
		} catch (error) {
			console.error('Error al actualizar la plantilla:', error);
			alert('Error al actualizar la plantilla. Por favor, intenta nuevamente.');
		} finally {
			isUpdatingTemplateStep1 = false;
		}
	};

	const updateTemplateStep2Students = async () => {
		console.log('Updating template...');
		if (!campaignId) {
			alert('No se ha creado una campaña. Por favor, crea una campaña primero.');
			return;
		}
		try {
			isUpdatingTemplateStep2 = true;
			compaingData.x = 0;
			compaingData.y = 60;
			compaingData.font_size = templateConfig.fontSize;
			compaingData.font_family = '001';
			compaingData.certificate = templateConfig.imageFile;
			const response = await campaignService.uploadStudentsFile(
				idcampañaStore.get() as string,
				excelData.file as File
			);
			console.log('Response: ', response);
			goNext();
		} catch (error) {
			console.error('Error al actualizar la plantilla:', error);
			alert('Error al actualizar la plantilla. Por favor, intenta nuevamente.');
		} finally {
			isUpdatingTemplateStep2 = false;
		}
	};

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
		console.log('Send Excel', {
			campaignId,
			headers: excelData.headers,
			data: excelData.json
		});
		alert('Excel procesado correctamente. Los datos están listos para generar certificados.');
	}

	function handleSendMessage() {
		console.log('Sending message:', { campaignId, message });
		alert('Mensaje enviado correctamente.');
	}
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Header -->
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto max-w-6xl px-6 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-semibold text-slate-900">Generador de Certificados</h1>
					<p class="mt-1 text-sm text-slate-600">
						Crea plantillas, importa datos y envía certificados personalizados
					</p>
					{#if campaignId}
						<p class="mt-1 text-xs text-slate-500">
							ID de campaña: <span class="font-mono">{campaignId}</span>
						</p>
					{/if}
				</div>

				{#if campaignCreated}
					<button
						on:click={resetCampaign}
						class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
					>
						Nueva Campaña
					</button>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-6xl px-6 py-8">
		{#if !campaignCreated}
			<!-- Vista inicial: Crear Campaña -->
			<div class="rounded-lg border border-slate-200 bg-white p-12 shadow-sm">
				<div class="mx-auto max-w-md text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<svg
							class="h-8 w-8 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</div>

					<h2 class="mb-2 text-2xl font-semibold text-slate-900">Crear Nueva Campaña</h2>
					<p class="mb-8 text-slate-600">
						Comienza creando una campaña para generar y enviar certificados personalizados
					</p>

					<button
						on:click={createCampaign}
						disabled={isCreatingCampaign}
						class="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isCreatingCampaign}
							<span class="flex items-center justify-center gap-2">
								<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Creando campaña...
							</span>
						{:else}
							Crear Campaña
						{/if}
					</button>
				</div>
			</div>
		{:else}
			<!-- Vista de pasos -->
			<!-- Progress Steps -->
			<ProgressSteps {step} />

			<!-- Content Card -->
			<div class="rounded-lg border border-slate-200 bg-white shadow-sm">
				{#if step === 1}
					<StepDesign
						config={templateConfig}
						on:update={(e) => handleTemplateUpdate(e.detail)}
						on:next={updateTemplate}
					/>
				{:else if step === 2}
					<StepData
						data={excelData}
						on:update={(e) => handleExcelUpdate(e.detail)}
						on:prev={goPrev}
						on:next={updateTemplateStep2Students}
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
		{/if}
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&family=Lora:wght@400;700&display=swap');

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
