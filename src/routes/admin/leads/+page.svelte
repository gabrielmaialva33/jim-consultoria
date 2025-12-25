<script lang="ts">
import { enhance } from '$app/forms';
import { goto } from '$app/navigation';
import Avatar from '$lib/components/admin/ui/Avatar.svelte';
import { culturalAreaLabels, leadStatusLabels, organizationTypeLabels } from '$lib/schemas/lead';
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();

let searchValue = $state(data.filters.search);
let selectedStatus = $state(data.filters.status);

function applyFilters() {
	const params = new URLSearchParams();
	if (searchValue) params.set('search', searchValue);
	if (selectedStatus) params.set('status', selectedStatus);
	goto(`/admin/leads?${params.toString()}`);
}

function clearFilters() {
	searchValue = '';
	selectedStatus = '';
	goto('/admin/leads');
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
}

const statusBadgeClasses: Record<string, string> = {
	NEW: 'badge-new',
	QUALIFICATION: 'badge-qualification',
	PROPOSAL: 'badge-proposal',
	NEGOTIATION: 'badge-negotiation',
	WON: 'badge-won',
	LOST: 'badge-lost'
};

$effect(() => {
	// Update local state when data changes
	searchValue = data.filters.search;
	selectedStatus = data.filters.status;
});

const totalPages = $derived(Math.ceil(data.total / data.perPage));
</script>

<svelte:head>
	<title>Leads | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Leads</h1>
			<p class="text-muted-foreground">
				{data.total} lead{data.total !== 1 ? 's' : ''} encontrado{data.total !== 1 ? 's' : ''}
			</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="card">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end">
			<div class="flex-1">
				<label for="search" class="label">Buscar</label>
				<div class="relative">
					<svg
						class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						id="search"
						class="input pl-10"
						placeholder="Nome ou e-mail..."
						bind:value={searchValue}
						onkeydown={(e) => e.key === 'Enter' && applyFilters()}
					/>
				</div>
			</div>
			<div class="w-full sm:w-48">
				<label for="status" class="label">Status</label>
				<select id="status" class="input select" bind:value={selectedStatus}>
					<option value="">Todos</option>
					{#each Object.entries(leadStatusLabels) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			</div>
			<div class="flex gap-2">
				<button type="button" class="btn btn-primary btn-md" onclick={applyFilters}> Filtrar </button>
				<button type="button" class="btn btn-outline btn-md" onclick={clearFilters}>
					Limpar
				</button>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden p-0">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Lead</th>
						<th>Organizacao</th>
						<th>Areas</th>
						<th>Status</th>
						<th>Data</th>
						<th class="text-right">Acoes</th>
					</tr>
				</thead>
				<tbody>
					{#each data.leads as lead}
						<tr>
							<td>
								<div class="flex items-center gap-3">
									<Avatar name={lead.name} size="sm" />
									<div>
										<p class="font-medium text-foreground">{lead.name}</p>
										<p class="text-sm text-muted-foreground">{lead.email}</p>
									</div>
								</div>
							</td>
							<td>
								<p class="text-sm text-foreground">
									{organizationTypeLabels[lead.organization_type] || lead.organization_type}
								</p>
								{#if lead.city && lead.state_code}
									<p class="text-sm text-muted-foreground">{lead.city}, {lead.state_code}</p>
								{/if}
							</td>
							<td>
								<div class="flex flex-wrap gap-1">
									{#each (lead.cultural_areas || []).slice(0, 2) as area}
										<span class="badge badge-primary badge-sm">
											{culturalAreaLabels[area] || area}
										</span>
									{/each}
									{#if (lead.cultural_areas || []).length > 2}
										<span class="badge badge-default badge-sm">
											+{(lead.cultural_areas || []).length - 2}
										</span>
									{/if}
								</div>
							</td>
							<td>
								<form method="POST" action="?/updateStatus" use:enhance>
									<input type="hidden" name="leadId" value={lead.id} />
									<select
										name="status"
										class="badge cursor-pointer border-0 {statusBadgeClasses[lead.status]}"
										value={lead.status}
										onchange={(e) => e.currentTarget.form?.requestSubmit()}
									>
										{#each Object.entries(leadStatusLabels) as [value, label]}
											<option {value} selected={value === lead.status}>{label}</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="text-sm text-muted-foreground">
								{formatDate(lead.created_at)}
							</td>
							<td class="text-right">
								<a
									href="/admin/leads/{lead.id}"
									class="btn btn-ghost btn-sm text-primary hover:text-primary-dark transition-all duration-200 hover:gap-2"
								>
									Ver detalhes
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6">
								<div class="empty-state">
									<svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<p class="empty-state-title">Nenhum lead encontrado</p>
									<p class="empty-state-description">
										Ajuste os filtros ou aguarde novos cadastros.
									</p>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div
				class="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3"
			>
				<p class="text-sm text-muted-foreground">
					Pagina {data.page} de {totalPages}
				</p>
				<div class="flex gap-2">
					{#if data.page > 1}
						<a
							href="/admin/leads?page={data.page - 1}{data.filters.status
								? '&status=' + data.filters.status
								: ''}{data.filters.search ? '&search=' + data.filters.search : ''}"
							class="btn btn-outline btn-sm"
						>
							Anterior
						</a>
					{/if}
					{#if data.page < totalPages}
						<a
							href="/admin/leads?page={data.page + 1}{data.filters.status
								? '&status=' + data.filters.status
								: ''}{data.filters.search ? '&search=' + data.filters.search : ''}"
							class="btn btn-primary btn-sm"
						>
							Proxima
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
