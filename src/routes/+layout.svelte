<script lang="ts">
import '../app.css';

const { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>JIM Consultoria | Especialistas em Editais Culturais</title>
  <meta name="description" content="Consultoria especializada em editais culturais: ProAC ICMS, Lei Rouanet e PNAB. Maximize suas chances de aprovação." />
</svelte:head>

{@render children()}
