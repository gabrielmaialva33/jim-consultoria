<script lang="ts">
import { flip } from 'svelte/animate';
import { dndzone } from 'svelte-dnd-action';
import { invalidateAll } from '$app/navigation';
import Avatar from '$lib/components/admin/ui/Avatar.svelte';
import { grantInterestLabels, organizationTypeLabels } from '$lib/schemas/lead';
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();

type LeadStatus = 'NEW' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

type Lead = {
	id: string;
	name: string;
	email: string;
	organization_type: string;
	cultural_areas: string[];
	status: LeadStatus;
	created_at: string;
	interested_grants: string[];
	eligibility_score?: number;
};

const columns: { id: LeadStatus; label: string; colorClass: string; bgClass: string }[] = [
	{ id: 'NEW', label: 'Novo', colorClass: 'bg-success', bgClass: 'kanban-column-new' },
	{
		id: 'QUALIFICATION',
		label: 'Qualificacao',
		colorClass: 'bg-warning',
		bgClass: 'kanban-column-qualification'
	},
	{ id: 'PROPOSAL', label: 'Proposta', colorClass: 'bg-info', bgClass: 'kanban-column-proposal' },
	{
		id: 'NEGOTIATION',
		label: 'Negociacao',
		colorClass: 'bg-primary',
		bgClass: 'kanban-column-negotiation'
	},
	{ id: 'WON', label: 'Fechado', colorClass: 'bg-success', bgClass: 'kanban-column-won' },
	{
		id: 'LOST',
		label: 'Perdido',
		colorClass: 'bg-destructive',
		bgClass: 'kanban-column-lost'
	}
];

// Group leads by status
let leadsByStatus = $state<Record<LeadStatus, Lead[]>>({
	NEW: [],
	QUALIFICATION: [],
	PROPOSAL: [],
	NEGOTIATION: [],
	WON: [],
	LOST: []
});

// Initialize leads by status
$effect(() => {
	const grouped: Record<LeadStatus, Lead[]> = {
		NEW: [],
		QUALIFICATION: [],
		PROPOSAL: [],
		NEGOTIATION: [],
		WON: [],
		LOST: []
	};

	for (const lead of data.leads) {
		const status = lead.status as LeadStatus;
		if (grouped[status]) {
			grouped[status].push(lead as Lead);
		}
	}

	leadsByStatus = grouped;
});

const flipDurationMs = 200;

function handleDndConsider(status: LeadStatus, e: CustomEvent<{ items: Lead[] }>) {
	leadsByStatus[status] = e.detail.items;
}

async function handleDndFinalize(
	status: LeadStatus,
	e: CustomEvent<{ items: Lead[]; info: { id: string } }>
) {
	leadsByStatus[status] = e.detail.items;

	const movedLeadId = e.detail.info.id;
	const movedLead = e.detail.items.find((l) => l.id === movedLeadId);

	if (movedLead && movedLead.status !== status) {
		// Update via form submission
		const formData = new FormData();
		formData.set('leadId', movedLeadId);
		formData.set('status', status);

		await fetch('?/updateStatus', {
			method: 'POST',
			body: formData
		});

		// Update local state
		movedLead.status = status;

		// Refresh data
		invalidateAll();
	}
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short'
	});
}

const totalLeads = $derived(data.leads.length);
const activeLeads = $derived(data.leads.filter((l) => !['WON', 'LOST'].includes(l.status)).length);
</script>

<svelte:head>
	<title>Pipeline | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Pipeline</h1>
			<p class="text-muted-foreground">
				{activeLeads} leads ativos de {totalLeads} total
			</p>
		</div>
		<div class="flex items-center gap-3">
			<a href="/admin/leads" class="btn btn-outline btn-md">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 10h16M4 14h16M4 18h16"
					/>
				</svg>
				Ver Lista
			</a>
		</div>
	</div>

	<!-- Instructions -->
	<div
		class="flex items-center gap-3 rounded-lg border border-info/30 bg-info-light p-4 text-sm"
		style="color: #936d0c;"
	>
		<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>Arraste os cards entre as colunas para atualizar o status dos leads.</span>
	</div>

	<!-- Kanban board -->
	<div class="kanban-board">
		{#each columns as column}
			<div class="kanban-column">
				<!-- Column header -->
				<div class="kanban-column-header transition-colors duration-200">
					<div class="flex items-center gap-2">
						<div class="h-2.5 w-2.5 rounded-full {column.colorClass} animate-pulse"></div>
						<h3 class="font-semibold text-foreground">{column.label}</h3>
					</div>
					<span class="kanban-column-count">
						{leadsByStatus[column.id].length}
					</span>
				</div>

				<!-- Column content -->
				<div
					class="kanban-column-content"
					use:dndzone={{
						items: leadsByStatus[column.id],
						flipDurationMs,
						dropTargetStyle: {
							outline: '2px dashed var(--primary)',
							outlineOffset: '-2px',
							background: 'var(--primary-light)'
						}
					}}
					onconsider={(e) => handleDndConsider(column.id, e)}
					onfinalize={(e) => handleDndFinalize(column.id, e)}
				>
					{#each leadsByStatus[column.id] as lead (lead.id)}
						<div class="kanban-card" animate:flip={{ duration: flipDurationMs }}>
							<!-- Card header with avatar -->
							<div class="flex items-start gap-3">
								<Avatar name={lead.name} size="sm" />
								<div class="flex-1 min-w-0">
									<p class="font-medium text-foreground truncate">{lead.name}</p>
									<p class="text-sm text-muted-foreground truncate">{lead.email}</p>
								</div>
							</div>

							<!-- Organization type -->
							<div class="mt-3">
								<span class="badge badge-default badge-sm">
									{organizationTypeLabels[lead.organization_type] || lead.organization_type}
								</span>
							</div>

							<!-- Interested grants -->
							{#if lead.interested_grants && lead.interested_grants.length > 0}
								<div class="mt-2 flex flex-wrap gap-1">
									{#each lead.interested_grants.slice(0, 2) as grant}
										<span class="text-xs font-medium text-primary">
											{grantInterestLabels[grant] || grant}
										</span>
									{/each}
									{#if lead.interested_grants.length > 2}
										<span class="text-xs text-muted-foreground">
											+{lead.interested_grants.length - 2}
										</span>
									{/if}
								</div>
							{/if}

							<!-- Card footer -->
							<div
								class="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs"
							>
								<span class="text-muted-foreground">{formatDate(lead.created_at)}</span>
								<a
									href="/admin/leads/{lead.id}"
									class="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-dark transition-all duration-200 hover:gap-2"
								>
									Detalhes
									<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</a>
							</div>
						</div>
					{:else}
						<div class="kanban-empty">
							<svg
								class="h-8 w-8 text-muted-foreground/50 mx-auto mb-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
							<p class="text-sm text-muted-foreground">Nenhum lead</p>
							<p class="text-xs text-muted-foreground/70 mt-1">Arraste um card para ca</p>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Kanban scrollbar */
	.kanban-board::-webkit-scrollbar {
		height: 8px;
	}
	.kanban-board::-webkit-scrollbar-track {
		background: var(--muted);
		border-radius: 4px;
	}
	.kanban-board::-webkit-scrollbar-thumb {
		background: var(--border);
		border-radius: 4px;
		transition: background 0.2s ease-in-out;
	}
	.kanban-board::-webkit-scrollbar-thumb:hover {
		background: var(--muted-foreground);
	}

	/* Column hover effect */
	.kanban-column {
		transition: transform 0.2s ease-in-out;
	}

	.kanban-column:hover .kanban-column-header {
		background: rgba(0, 0, 0, 0.02);
	}
</style>
