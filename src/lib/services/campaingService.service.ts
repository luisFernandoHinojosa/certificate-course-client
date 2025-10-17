import type { TemplatePayload } from '$lib/interfaces/compaing.interface';

class CampaignService {
	private readonly baseURL: string;

	constructor(baseURL: string = 'https://certhub-backend.onrender.com') {
		this.baseURL = baseURL;
	}

	/**
	 * Actualiza la plantilla de una campaña
	 * @param campaignId ID de la campaña
	 * @param payload Datos a enviar en el body (incluye el archivo)
	 * @returns Mensaje de respuesta del servidor
	 */
	async updateTemplate(campaignId: string, payload: TemplatePayload): Promise<string> {
		console.log('Updating template...', payload);
		const url = `${this.baseURL}/campaigns/${campaignId}/template`;

		const formData = new FormData();
		formData.append('x', payload.x.toString());
		formData.append('y', payload.y.toString());
		formData.append('font_size', payload.font_size.toString());
		formData.append('font_family', payload.font_family);
		formData.append('certificate', payload.certificate);

		try {
			const response = await fetch(url, {
				method: 'PUT',
				body: formData,
				headers: {
					Accept: 'application/json'
					// No agregamos 'Content-Type' porque el navegador la define automáticamente con el boundary correcto
				}
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Ocurrió un error al actualizar la plantilla.');
			}

			const data = await response.json();
			return data.message || 'Plantilla actualizada correctamente.';
		} catch (error: unknown) {
			console.error('Error al actualizar la plantilla:', error);
			throw new Error(
				(error as Error).message || 'Ocurrió un error inesperado al actualizar la plantilla.'
			);
		}
	}

	async uploadStudentsFile(campaignId: string, studentsFile: File): Promise<string> {
		console.log('Uploading students file...', studentsFile);
		const url = `${this.baseURL}/campaigns/${campaignId}/students`;

		const formData = new FormData();
		formData.append('students_file', studentsFile);

		try {
			const response = await fetch(url, {
				method: 'PUT',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Error al subir el archivo de estudiantes.');
			}

			const data = await response.json();
			return data.message || 'Archivo de estudiantes procesado correctamente.';
		} catch (error: unknown) {
			console.error('Error al subir el archivo de estudiantes:', error);
			throw new Error(error.message || 'Ocurrió un error inesperado al subir el archivo.');
		}
	}
}
export const campaignService = new CampaignService();
