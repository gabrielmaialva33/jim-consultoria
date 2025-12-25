<script lang="ts">
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
}

function daysUntil(dateStr: string) {
	const target = new Date(dateStr);
	const now = new Date();
	const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
	return diff;
}

const statCards = [
	{
		label: 'Total de Leads',
		value: data.stats.totalLeads,
		change: `+${data.stats.recentLeads} esta semana`,
		color: 'bg-brand-600'
	},
	{
		label: 'Novos Leads',
		value: data.stats.newLeads,
		change: 'Aguardando qualificação',
		color: 'bg-yellow-500'
	},
	{
		label: 'Em Andamento',
		value: data.stats.inProgress,
		change: 'Qualificação, Proposta, Negociação',
		color: 'bg-blue-500'
	},
	{
		label: 'Fechados',
		value: data.stats.won,
		change: 'Contratos assinados',
		color: 'bg-green-500'
	}
];
</script>

<svelte:head>
  <title>Dashboard | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    <p class="text-gray-600">Visão geral do seu negócio</p>
  </div>

  <!-- Stats cards -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each statCards as stat}
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-lg {stat.color} flex items-center justify-center">
            <span class="text-xl font-bold text-white">{stat.value}</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{stat.label}</p>
            <p class="text-xs text-gray-500">{stat.change}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Quick actions -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href="/admin/leads"
          class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center">
            <svg class="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Ver Leads</p>
            <p class="text-sm text-gray-500">Gerenciar prospects</p>
          </div>
        </a>
        <a
          href="/admin/pipeline"
          class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Pipeline</p>
            <p class="text-sm text-gray-500">Visão Kanban</p>
          </div>
        </a>
        <a
          href="/admin/editais"
          class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Editais</p>
            <p class="text-sm text-gray-500">{data.stats.activeGrants} ativos</p>
          </div>
        </a>
        <a
          href="/"
          target="_blank"
          class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Ver Site</p>
            <p class="text-sm text-gray-500">Abrir landing page</p>
          </div>
        </a>
      </div>
    </div>

    <!-- Upcoming deadlines -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900">Prazos Próximos</h2>
      {#if data.upcomingDeadlines.length === 0}
        <p class="mt-4 text-gray-500">Nenhum prazo nos próximos 30 dias.</p>
      {:else}
        <ul class="mt-4 space-y-3">
          {#each data.upcomingDeadlines as grant}
            {@const days = daysUntil(grant.closes_at!)}
            <li class="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p class="font-medium text-gray-900">{grant.name}</p>
                <p class="text-sm text-gray-500">Encerra em {formatDate(grant.closes_at!)}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-medium {days <= 7 ? 'bg-red-100 text-red-700' : days <= 14 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}"
              >
                {days} dias
              </span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
