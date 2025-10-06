<script>
	import { goto } from '$app/navigation';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<!-- <button onclick={() => goto('auth/sign-in')} class="p-3"> login </button> -->
<button onclick={() => goto('/generate-certificate-by-user')} class="p-3">
	generate-certificate-by-user
</button>
<button onclick={() => goto('/app/create-template')} class="p-3"> create-template </button>
