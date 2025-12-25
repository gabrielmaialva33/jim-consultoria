<script lang="ts">
const steps = [
	{
		number: '01',
		title: 'Diagnóstico',
		description: 'Analisamos seu perfil e projeto para identificar os melhores editais para você.',
		icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>`
	},
	{
		number: '02',
		title: 'Estratégia',
		description: 'Desenvolvemos um plano personalizado com cronograma e documentação necessária.',
		icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>`
	},
	{
		number: '03',
		title: 'Execução',
		description: 'Preparamos e revisamos toda a documentação para submissão nos editais.',
		icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>`
	},
	{
		number: '04',
		title: 'Acompanhamento',
		description: 'Monitoramos o processo e apoiamos em todas as etapas até a aprovação.',
		icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`
	}
];
</script>

<section id="como-funciona" class="bg-white py-20 lg:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Section header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Como Funciona
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        Um processo estruturado para maximizar suas chances de aprovação
      </p>
    </div>

    <!-- Steps -->
    <div class="mt-16 grid gap-8 lg:grid-cols-4">
      {#each steps as step, index}
        <div class="relative">
          <!-- Connector line -->
          {#if index < steps.length - 1}
            <div class="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gray-200 lg:block"></div>
          {/if}

          <div class="relative flex flex-col items-center text-center">
            <!-- Icon circle -->
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
              {@html step.icon}
            </div>

            <!-- Number badge -->
            <span class="mt-4 inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
              Passo {step.number}
            </span>

            <!-- Content -->
            <h3 class="mt-4 text-xl font-bold text-gray-900">{step.title}</h3>
            <p class="mt-2 text-gray-600">{step.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
