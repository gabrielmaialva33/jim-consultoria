<script lang="ts">
import { flip } from 'svelte/animate';
import { dndzone } from 'svelte-dnd-action';
import { enhance } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { leadStatusLabels, organizationTypeLabels } from '$lib/schemas/lead';
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
};

const columns: { id: LeadStatus; label: string; color: string }[] = [
	{ id: 'NEW', label: 'Novo', color: 'bg-gray-500' },
	{ id: 'QUALIFICATION', label: 'Qualificação', color: 'bg-yellow-500' },
	{ id: 'PROPOSAL', label: 'Proposta', color: 'bg-blue-500' },
	{ id: 'NEGOTIATION', label: 'Negociação', color: 'bg-purple-500' },
	{ id: 'WON', label: 'Fechado', color: 'bg-green-500' },
	{ id: 'LOST', label: 'Perdido', color: 'bg-red-500' }
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
let pendingUpdate: { leadId: string; newStatus: string } | null = null;

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
		pendingUpdate = { leadId: movedLeadId, newStatus: status };

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
		pendingUpdate = null;

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
</script>

<svelte:head>
  <title>Pipeline | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Pipeline</h1>
      <p class="text-gray-600">Arraste os cards para atualizar o status</p>
    </div>
    <div class="flex gap-2">
      <a href="/admin/leads" class="btn-outline px-4 py-2 text-sm">
        Ver lista
      </a>
    </div>
  </div>

  <!-- Kanban board -->
  <div class="flex gap-4 overflow-x-auto pb-4">
    {#each columns as column}
      <div class="flex-shrink-0 w-72">
        <!-- Column header -->
        <div class="flex items-center gap-2 mb-3">
          <div class="h-3 w-3 rounded-full {column.color}"></div>
          <h3 class="font-medium text-gray-900">{column.label}</h3>
          <span class="ml-auto text-sm text-gray-500">
            {leadsByStatus[column.id].length}
          </span>
        </div>

        <!-- Column content -->
        <div
          class="rounded-lg bg-gray-100 p-2 min-h-[500px]"
          use:dndzone={{
            items: leadsByStatus[column.id],
            flipDurationMs,
            dropTargetStyle: { outline: '2px dashed #6366f1', outlineOffset: '-2px' }
          }}
          onconsider={(e) => handleDndConsider(column.id, e)}
          onfinalize={(e) => handleDndFinalize(column.id, e)}
        >
          {#each leadsByStatus[column.id] as lead (lead.id)}
            <div
              class="card mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
              animate:flip={{ duration: flipDurationMs }}
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">{lead.name}</p>
                  <p class="text-sm text-gray-500 truncate">{lead.email}</p>
                </div>
              </div>

              <div class="mt-2">
                <span class="badge bg-gray-100 text-gray-700 text-xs">
                  {organizationTypeLabels[lead.organization_type] || lead.organization_type}
                </span>
              </div>

              {#if lead.interested_grants && lead.interested_grants.length > 0}
                <div class="mt-2 flex flex-wrap gap-1">
                  {#each lead.interested_grants as grant}
                    <span class="text-xs text-brand-600 font-medium">
                      {grant === 'proac_icms' ? 'ProAC' : grant === 'rouanet' ? 'Rouanet' : 'PNAB'}
                    </span>
                  {/each}
                </div>
              {/if}

              <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(lead.created_at)}</span>
                <a
                  href="/admin/leads/{lead.id}"
                  class="text-brand-600 hover:text-brand-700"
                >
                  Ver
                </a>
              </div>
            </div>
          {:else}
            <div class="p-4 text-center text-sm text-gray-500">
              Nenhum lead
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* Custom scrollbar for kanban */
  .overflow-x-auto::-webkit-scrollbar {
    height: 8px;
  }
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
