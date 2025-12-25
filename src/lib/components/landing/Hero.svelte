<script lang="ts">
// Hero section with main value proposition
</script>

<section class="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-20 lg:py-32">
  <!-- Background pattern -->
  <div class="absolute inset-0 opacity-10">
    <svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  </div>

  <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- Badge -->
      <div class="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
        <span class="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm font-medium text-white">Editais 2026 abertos</span>
      </div>

      <!-- Main heading -->
      <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Transforme seu projeto cultural em
        <span class="block text-brand-200">realidade aprovada</span>
      </h1>

      <!-- Subheading -->
      <p class="mx-auto mt-6 max-w-2xl text-lg text-brand-100 lg:text-xl">
        Consultoria especializada em editais culturais: ProAC ICMS, Lei Rouanet e PNAB.
        Aumentamos suas chances de aprovação com estratégia e experiência comprovada.
      </p>

      <!-- CTA Buttons -->
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/register"
          class="btn-primary w-full bg-white text-brand-700 hover:bg-brand-50 sm:w-auto px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Quero ser aprovado
        </a>
        <a
          href="#como-funciona"
          class="w-full border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 sm:w-auto px-8 py-3 text-lg font-medium rounded-xl transition-all duration-300 inline-flex items-center justify-center"
        >
          Como funciona
        </a>
      </div>

      <!-- Trust indicators -->
      <div class="mt-16 flex flex-wrap items-center justify-center gap-8 text-brand-200">
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>+R$ 100M em editais ativos</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>Foco em São Paulo</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>Consultoria completa</span>
        </div>
      </div>
    </div>
  </div>
</section>
