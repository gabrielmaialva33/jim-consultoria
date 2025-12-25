<script lang="ts">
const editais = [
	{
		name: 'ProAC ICMS',
		agency: 'Secretaria de Cultura SP',
		status: 'Aberto',
		statusColor: 'bg-green-100 text-green-800',
		budget: '+R$ 100 milhões',
		deadline: 'Fluxo contínuo',
		description: 'Incentivo fiscal via ICMS para projetos culturais em São Paulo.',
		requirements: ['PJ há 2+ anos em SP', 'CNAE cultural', 'Projeto aprovado'],
		link: 'https://fomentocultsp.sp.gov.br'
	},
	{
		name: 'Lei Rouanet',
		agency: 'Ministério da Cultura',
		status: 'Aberto',
		statusColor: 'bg-green-100 text-green-800',
		budget: 'Até R$ 10 milhões/projeto',
		deadline: '31/10/2025',
		description: 'Incentivo fiscal federal para captação de patrocínio cultural.',
		requirements: ['CNAE cultural', 'Cadastro Salic', 'Projeto aprovado'],
		link: 'https://salic.cultura.gov.br'
	},
	{
		name: 'PNAB SP',
		agency: 'Secretaria de Cultura SP',
		status: 'Aberto',
		statusColor: 'bg-green-100 text-green-800',
		budget: 'Varia por edital',
		deadline: '12/01/2026',
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
        Editais Ativos 2025
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        Conheça as principais oportunidades de financiamento cultural disponíveis agora
      </p>
    </div>

    <!-- Editais grid -->
    <div class="mt-12 grid gap-8 lg:grid-cols-3">
      {#each editais as edital}
        <article class="card hover:shadow-lg transition-shadow">
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
              class="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Ver edital oficial &rarr;
            </a>
          </div>
        </article>
      {/each}
    </div>

    <!-- CTA -->
    <div class="mt-12 text-center">
      <a
        href="/register"
        class="btn-primary px-8 py-3 text-lg"
      >
        Verificar minha elegibilidade
      </a>
    </div>
  </div>
</section>
