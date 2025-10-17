<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let message: string;
	export let templateFileName: string | undefined;
	export let participantCount: number;

	const dispatch = createEventDispatcher();
</script>

<div class="p-8">
	<div class="mb-6">
		<h2 class="text-lg font-semibold text-slate-900">Mensaje de Envío</h2>
		<p class="mt-1 text-sm text-slate-600">Redacta el mensaje que acompañará los certificados</p>
	</div>

	<div class="space-y-6">
		<div>
			<label class="mb-2 block text-sm font-medium text-slate-700">Mensaje personalizado</label>
			<textarea
				rows="10"
				class="focus:ring-opacity-20 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={message}
				placeholder="Escribe aquí el mensaje que acompañará el envío de los certificados..."
			></textarea>
			<p class="mt-2 text-xs text-slate-500">
				{message.length} caracteres
			</p>
		</div>

		<!-- Summary Card -->
		<div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
			<h4 class="mb-3 text-sm font-medium text-slate-900">Resumen del envío</h4>
			<dl class="space-y-2 text-sm">
				<div class="flex justify-between">
					<dt class="text-slate-600">Plantilla:</dt>
					<dd class="font-medium text-slate-900">{templateFileName || 'No configurada'}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-slate-600">Participantes:</dt>
					<dd class="font-medium text-slate-900">{participantCount} registros</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-slate-600">Mensaje:</dt>
					<dd class="font-medium text-slate-900">{message.trim() ? 'Configurado' : 'Pendiente'}</dd>
				</div>
			</dl>
		</div>

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
				on:click={() => dispatch('send')}
				disabled={!message.trim()}
				class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Enviar certificados
			</button>
		</div>
	</div>
</div>
