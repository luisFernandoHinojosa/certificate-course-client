export interface TemplateConfig {
	imageFile: File | null;
	imageUrl: string | null;
	overlayText: string;
	yOffset: number;
	fontSize: number;
	fontIndex: number;
}

export interface ExcelData {
	file: File | null;
	json: any[];
	headers: string[];
}

export const FONTS = [
	'Inter, system-ui, sans-serif',
	'Poppins, system-ui, sans-serif',
	'Roboto, system-ui, sans-serif',
	'Montserrat, system-ui, sans-serif',
	'Playfair Display, Georgia, serif',
	'Lora, Georgia, serif'
];
