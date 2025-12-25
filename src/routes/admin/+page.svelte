<script lang="ts">
import StatCard from '$lib/components/admin/ui/StatCard.svelte';
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

function getDaysColor(days: number): string {
	if (days <= 7) return 'badge-destructive';
	if (days <= 14) return 'badge-warning';
	return 'badge-success';
}
</script>

<svelte:head>
	<title>Dashboard | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
		<p class="text-muted-foreground">Visao geral do seu negocio</p>
	</div>

	<!-- Stats grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard
			value={data.stats.totalLeads}
			label="Total de Leads"
			change="+{data.stats.recentLeads} esta semana"
			variant="primary"
			icon="users"
		/>
		<StatCard
			value={data.stats.newLeads}
			label="Novos Leads"
			change="Aguardando qualificacao"
			variant="warning"
			icon="clock"
		/>
		<StatCard
			value={data.stats.inProgress}
			label="Em Andamento"
			change="Qualificacao, Proposta, Negociacao"
			variant="info"
			icon="chart"
		/>
		<StatCard
			value={data.stats.won}
			label="Fechados"
			change="Contratos assinados"
			variant="success"
			icon="check"
		/>
	</div>

	<!-- Two column layout -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Quick actions -->
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Acoes Rapidas</h2>
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<a
					href="/admin/leads"
					class="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
						<svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div>
						<p class="font-medium text-foreground">Ver Leads</p>
						<p class="text-sm text-muted-foreground">Gerenciar prospects</p>
					</div>
				</a>

				<a
					href="/admin/pipeline"
					class="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light">
						<svg class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<div>
						<p class="font-medium text-foreground">Pipeline</p>
						<p class="text-sm text-muted-foreground">Visao Kanban</p>
					</div>
				</a>

				<a
					href="/admin/grants"
					class="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light">
						<svg class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div>
						<p class="font-medium text-foreground">Editais</p>
						<p class="text-sm text-muted-foreground">{data.stats.activeGrants} ativos</p>
					</div>
				</a>

				<a
					href="/"
					target="_blank"
					class="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
						<svg
							class="h-5 w-5 text-muted-foreground"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</div>
					<div>
						<p class="font-medium text-foreground">Ver Site</p>
						<p class="text-sm text-muted-foreground">Abrir landing page</p>
					</div>
				</a>
			</div>
		</div>

		<!-- Upcoming deadlines -->
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Prazos Proximos</h2>
			</div>
			{#if data.upcomingDeadlines.length === 0}
				<div class="empty-state">
					<svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<p class="empty-state-title">Sem prazos proximos</p>
					<p class="empty-state-description">Nenhum edital com prazo nos proximos 30 dias.</p>
				</div>
			{:else}
				<ul class="space-y-3">
					{#each data.upcomingDeadlines as grant}
						{@const days = daysUntil(grant.closes_at!)}
						<li
							class="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
						>
							<div>
								<p class="font-medium text-foreground">{grant.name}</p>
								<p class="text-sm text-muted-foreground">Encerra em {formatDate(grant.closes_at!)}</p>
							</div>
							<span class="badge {getDaysColor(days)}">
								{days} dias
							</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
