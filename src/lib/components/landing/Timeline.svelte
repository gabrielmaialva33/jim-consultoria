<script lang="ts">
const timeline = [
	{
		date: 'Agora',
		title: 'ProAC ICMS 2026',
		description: 'Inscrições abertas para novos projetos',
		status: 'active',
		color: 'bg-success',
		badgeClass: 'badge badge-success'
	},
	{
		date: 'Até 31/10/2026',
		title: 'Lei Rouanet 2026',
		description: 'Prazo final para submissão de propostas',
		status: 'upcoming',
		color: 'bg-warning',
		badgeClass: 'badge badge-warning'
	},
	{
		date: 'Até 12/01/2027',
		title: 'PNAB SP 2026',
		description: 'Editais da Política Nacional Aldir Blanc',
		status: 'upcoming',
		color: 'bg-info',
		badgeClass: 'badge badge-info'
	},
	{
		date: 'Fev/2027',
		title: 'ProAC ICMS 2027',
		description: 'Previsão de reabertura de inscrições',
		status: 'future',
		color: 'bg-muted',
		badgeClass: 'badge badge-default'
	}
];
</script>

<section id="prazos" class="bg-gray-50 py-20 lg:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Section header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Cronograma de Editais
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        Fique atento aos prazos e não perca nenhuma oportunidade
      </p>
    </div>

    <!-- Timeline -->
    <div class="mt-12 mx-auto max-w-3xl">
      <div class="relative">
        <!-- Vertical line -->
        <div class="absolute left-4 top-0 h-full w-0.5 bg-gray-200 lg:left-1/2 lg:-ml-0.5"></div>

        <!-- Timeline items -->
        <div class="space-y-12">
          {#each timeline as item, index}
            <div class="relative flex items-start lg:items-center">
              <!-- Left side (date) - hidden on mobile -->
              <div class="hidden lg:flex lg:w-1/2 lg:justify-end lg:pr-8">
                {#if index % 2 === 0}
                  <div class="text-right">
                    <span class="{item.badgeClass}">
                      {item.date}
                    </span>
                    <h3 class="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
                    <p class="mt-1 text-gray-600">{item.description}</p>
                  </div>
                {/if}
              </div>

              <!-- Circle marker -->
              <div class="absolute left-4 lg:left-1/2 lg:-ml-2">
                <div class="flex h-4 w-4 items-center justify-center rounded-full {item.color} ring-4 ring-white">
                  {#if item.status === 'active'}
                    <span class="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                  {/if}
                </div>
              </div>

              <!-- Right side (content) - or mobile content -->
              <div class="ml-12 lg:ml-0 lg:w-1/2 lg:pl-8 {index % 2 === 0 ? 'lg:hidden' : ''}">
                <!-- Mobile date badge -->
                <span class="{item.badgeClass} lg:hidden">
                  {item.date}
                </span>
                <!-- Desktop odd items -->
                {#if index % 2 !== 0}
                  <div class="hidden lg:block">
                    <span class="{item.badgeClass}">
                      {item.date}
                    </span>
                    <h3 class="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
                    <p class="mt-1 text-gray-600">{item.description}</p>
                  </div>
                {/if}
                <!-- Mobile content -->
                <h3 class="mt-2 text-lg font-bold text-gray-900 lg:hidden">{item.title}</h3>
                <p class="mt-1 text-gray-600 lg:hidden">{item.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Alert banner -->
    <div class="mt-16 mx-auto max-w-2xl rounded-xl bg-brand-600 p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <p class="text-lg font-medium">
        Não deixe para a última hora! Projetos bem preparados têm muito mais chances de aprovação.
      </p>
      <a
        href="/register"
        class="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2 font-semibold text-brand-700 hover:bg-brand-50 transition-all duration-300 hover:scale-105 hover:gap-3 shadow-md hover:shadow-lg"
      >
        Começar agora
        <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>
