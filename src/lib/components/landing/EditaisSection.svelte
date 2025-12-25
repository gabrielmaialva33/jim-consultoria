<script lang="ts">
const editais = [
	{
		name: 'ProAC ICMS 2026',
		agency: 'Secretaria de Cultura SP',
		status: 'Aberto',
		statusColor: 'badge badge-success',
		budget: '+R$ 100 milhões',
		deadline: 'Fluxo contínuo',
		description: 'Incentivo fiscal via ICMS para projetos culturais em São Paulo.',
		requirements: ['PJ há 2+ anos em SP', 'CNAE cultural', 'Projeto aprovado'],
		link: 'https://fomentocultsp.sp.gov.br'
	},
	{
		name: 'Lei Rouanet 2026',
		agency: 'Ministério da Cultura',
		status: 'Aberto',
		statusColor: 'badge badge-success',
		budget: 'Até R$ 10 milhões/projeto',
		deadline: '31/10/2026',
		description: 'Incentivo fiscal federal para captação de patrocínio cultural.',
		requirements: ['CNAE cultural', 'Cadastro Salic', 'Projeto aprovado'],
		link: 'https://salic.cultura.gov.br'
	},
	{
		name: 'PNAB SP 2026',
		agency: 'Secretaria de Cultura SP',
		status: 'Aberto',
		statusColor: 'badge badge-success',
		budget: 'Varia por edital',
		deadline: '12/01/2027',
		description: 'Política Nacional Aldir Blanc - fomento direto para cultura.',
		requirements: ['Atuação cultural comprovada', 'Cotas de inclusão'],
		link: 'https://www.cultura.sp.gov.br'
	}
];
</script>

<section id="editais" class="bg-gray-50 py-20 lg:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Section header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Editais Ativos 2026
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        Conheça as principais oportunidades de financiamento cultural disponíveis agora
      </p>
    </div>

    <!-- Editais grid -->
    <div class="mt-12 grid gap-8 lg:grid-cols-3">
      {#each editais as edital}
        <article class="card hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{edital.name}</h3>
              <p class="text-sm text-gray-500">{edital.agency}</p>
            </div>
            <span class="badge {edital.statusColor}">{edital.status}</span>
          </div>

          <!-- Description -->
          <p class="mt-4 text-gray-600">{edital.description}</p>

          <!-- Stats -->
          <div class="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div>
              <p class="text-sm text-gray-500">Recursos</p>
              <p class="font-semibold text-gray-900">{edital.budget}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Prazo</p>
              <p class="font-semibold text-gray-900">{edital.deadline}</p>
            </div>
          </div>

          <!-- Requirements -->
          <div class="mt-6">
            <p class="text-sm font-medium text-gray-700">Requisitos principais:</p>
            <ul class="mt-2 space-y-1">
              {#each edital.requirements as req}
                <li class="flex items-center text-sm text-gray-600">
                  <svg class="mr-2 h-4 w-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {req}
                </li>
              {/each}
            </ul>
          </div>

          <!-- Action -->
          <div class="mt-6">
            <a
              href={edital.link}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-all duration-200 hover:gap-3"
            >
              Ver edital oficial
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </article>
      {/each}
    </div>

    <!-- CTA -->
    <div class="mt-12 text-center">
      <a
        href="/register"
        class="btn-primary px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
      >
        Verificar minha elegibilidade
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </a>
    </div>
  </div>
</section>
