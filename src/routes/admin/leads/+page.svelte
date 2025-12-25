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
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Leads</h1>
			<p class="text-muted-foreground mt-1">
				Gerencie seus potenciais clientes e oportunidades.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="badge badge-default">
				{data.total} lead{data.total !== 1 ? 's' : ''} total
			</span>
		</div>
	</div>

	<!-- Filters -->
	<div class="card p-4">
		<div class="grid gap-4 sm:grid-cols-[1fr_200px_auto]">
			<div class="space-y-1">
				<label for="search" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Buscar</label>
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
						class="input pl-9 h-10"
						placeholder="Nome, e-mail do lead..."
						bind:value={searchValue}
						onkeydown={(e) => e.key === 'Enter' && applyFilters()}
					/>
				</div>
			</div>
			
			<div class="space-y-1">
				<label for="status" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Status</label>
				<select id="status" class="input select h-10" bind:value={selectedStatus}>
					<option value="">Todos os status</option>
					{#each Object.entries(leadStatusLabels) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			</div>
			
			<div class="flex items-end gap-2">
				<button type="button" class="btn btn-primary h-10 px-6" onclick={applyFilters}>
					Filtrar
				</button>
				<button type="button" class="btn btn-outline h-10 w-10 p-0" onclick={clearFilters} title="Limpar filtros">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="border-b border-border bg-muted/40">
					<tr>
						<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lead</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Organizacao</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">Areas</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Status</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Data</th>
						<th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-[100px]">Acoes</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each data.leads as lead}
						<tr class="hover:bg-muted/50 transition-colors">
							<td class="p-4 align-middle">
								<div class="flex items-center gap-3">
									<Avatar name={lead.name} size="md" />
									<div>
										<p class="font-semibold text-foreground">{lead.name}</p>
										<p class="text-sm text-muted-foreground">{lead.email}</p>
									</div>
								</div>
							</td>
							<td class="p-4 align-middle">
								<div class="flex flex-col">
									<span class="font-medium text-foreground">
										{organizationTypeLabels[lead.organization_type] || lead.organization_type}
									</span>
									{#if lead.city && lead.state_code}
										<span class="text-xs text-muted-foreground">{lead.city}, {lead.state_code}</span>
									{/if}
								</div>
							</td>
							<td class="p-4 align-middle">
								<div class="flex flex-wrap gap-1.5">
									{#each (lead.cultural_areas || []).slice(0, 2) as area}
										<span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
											{culturalAreaLabels[area] || area}
										</span>
									{/each}
									{#if (lead.cultural_areas || []).length > 2}
										<span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
											+{ (lead.cultural_areas || []).length - 2 }
										</span>
									{/if}
								</div>
							</td>
							<td class="p-4 align-middle">
								<form method="POST" action="?/updateStatus" use:enhance class="w-full">
									<input type="hidden" name="leadId" value={lead.id} />
									<select
										name="status"
										class="badge w-full cursor-pointer appearance-none border-0 text-center text-xs {statusBadgeClasses[lead.status]}"
										value={lead.status}
										onchange={(e) => e.currentTarget.form?.requestSubmit()}
									>
										{#each Object.entries(leadStatusLabels) as [value, label]}
											<option {value} selected={value === lead.status}>{label}</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="p-4 align-middle whitespace-nowrap text-muted-foreground">
								{formatDate(lead.created_at)}
							</td>
							<td class="p-4 align-middle text-right">
								<a
									href="/admin/leads/{lead.id}"
									class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									title="Ver detalhes"
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="p-8 text-center text-muted-foreground">
								<div class="flex flex-col items-center justify-center gap-2">
									<svg class="h-10 w-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<p>Nenhum lead encontrado com os filtros atuais.</p>
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
