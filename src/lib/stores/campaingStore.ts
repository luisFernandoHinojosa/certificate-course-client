import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'campaign_id';

// Obtener el valor inicial desde localStorage
function getInitialValue(): string | null {
	if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored;
	}
	return null;
}

// Crear el store
function createCampaignStore() {
	const { subscribe, set: svelteSet } = writable<string | null>(getInitialValue());

	return {
		subscribe,
		set: (value: string) => {
			if (browser) {
				localStorage.setItem(STORAGE_KEY, value);
			}
			svelteSet(value);
		},
		reset: () => {
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
			}
			svelteSet(null);
		},
		get: (): string | null => {
			if (browser) {
				return localStorage.getItem(STORAGE_KEY);
			}
			return null;
		}
	};
}

export const idcampañaStore = createCampaignStore();
