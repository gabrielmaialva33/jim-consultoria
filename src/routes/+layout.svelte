<script lang="ts">
import '../app.css';
import { onMount } from 'svelte';
import { invalidate } from '$app/navigation';

const { children, data } = $props();
const { session, supabase } = data;

onMount(() => {
	const {
		data: { subscription }
	} = supabase.auth.onAuthStateChange((_event, _session) => {
		if (_session?.expires_at !== session?.expires_at) {
			invalidate('supabase:auth');
		}
	});

	return () => subscription.unsubscribe();
});
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>JIM Consultoria | Especialistas em Editais Culturais</title>
  <meta name="description" content="Consultoria especializada em editais culturais: ProAC ICMS, Lei Rouanet e PNAB. Maximize suas chances de aprovação." />
</svelte:head>

{@render children()}
