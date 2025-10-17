<script lang="ts">
	import type { ExcelData } from '$lib/interfaces/createTemplatee.interface';
	import { createEventDispatcher } from 'svelte';
	import * as XLSX from 'xlsx';
	import FileUpload from './fileUpload.svelte';
	import DataTable from './dataTable.svelte';

	export let data: ExcelData;

	const dispatch = createEventDispatcher();

	function handleExcelUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
			const fileData = ev.target?.result;
			if (!fileData) return;

			const workbook = XLSX.read(fileData, { type: 'array' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });

			const newData: ExcelData = {
				file,
				json: json as any[],
				headers: json.length > 0 ? Object.keys(json[0]) : []
			};

			dispatch('update', newData);
		};
		reader.readAsArrayBuffer(file);
	}
</script>

<div class="p-8">
	<div class="mb-6">
		<h2 class="text-lg font-semibold text-slate-900">Importar Datos</h2>
		<p class="mt-1 text-sm text-slate-600">Sube un archivo Excel con la lista de participantes</p>
	</div>

	<div class="space-y-6">
		<!-- Upload Excel -->
		<FileUpload
			label="Archivo Excel"
			accept=".xlsx,.xls"
			fileName={data.file?.name}
			helpText="XLSX o XLS"
			icon="document"
			on:change={handleExcelUpload}
		/>

		<!-- Preview Table -->
		{#if data.json.length > 0}
			<DataTable headers={data.headers} rows={data.json} />
		{/if}

		<!-- Actions -->
		<div class="flex gap-3 pt-4">
			<button
				on:click={() => dispatch('prev')}
				class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
			>
				Atrás
			</button>
			<div class="flex-1"></div>
			<button
				on:click={() => dispatch('process')}
				disabled={data.json.length === 0}
				class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Procesar datos
			</button>
			<button
				on:click={() => dispatch('next')}
				disabled={data.json.length === 0}
				class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Continuar
			</button>
		</div>
	</div>
</div>
