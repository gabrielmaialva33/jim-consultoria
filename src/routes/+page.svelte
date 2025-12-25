<script lang="ts">
import CTA from '$lib/components/landing/CTA.svelte';
import EditaisSection from '$lib/components/landing/EditaisSection.svelte';
import Footer from '$lib/components/landing/Footer.svelte';
import Hero from '$lib/components/landing/Hero.svelte';
import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
import Timeline from '$lib/components/landing/Timeline.svelte';
</script>

<main class="min-h-screen">
  <Hero />
  <EditaisSection />
  <HowItWorks />
  <Timeline />
  <CTA />
  <Footer />
</main>
