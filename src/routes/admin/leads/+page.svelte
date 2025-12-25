<script lang="ts">
import { enhance } from '$app/forms';
import { goto } from '$app/navigation';
import { page } from '$app/state';
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
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

const statusColors: Record<string, string> = {
	NEW: 'bg-gray-100 text-gray-700',
	QUALIFICATION: 'bg-yellow-100 text-yellow-700',
	PROPOSAL: 'bg-blue-100 text-blue-700',
	NEGOTIATION: 'bg-purple-100 text-purple-700',
	WON: 'bg-green-100 text-green-700',
	LOST: 'bg-red-100 text-red-700'
};

const totalPages = Math.ceil(data.total / data.perPage);
</script>

<svelte:head>
  <title>Leads | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Leads</h1>
      <p class="text-gray-600">{data.total} lead{data.total !== 1 ? 's' : ''} encontrado{data.total !== 1 ? 's' : ''}</p>
    </div>
  </div>

  <!-- Filters -->
  <div class="card">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div class="flex-1">
        <label for="search" class="label">Buscar</label>
        <input
          type="text"
          id="search"
          class="input"
          placeholder="Nome ou e-mail..."
          bind:value={searchValue}
          onkeydown={(e) => e.key === 'Enter' && applyFilters()}
        />
      </div>
      <div class="w-full sm:w-48">
        <label for="status" class="label">Status</label>
        <select id="status" class="input" bind:value={selectedStatus}>
          <option value="">Todos</option>
          {#each Object.entries(leadStatusLabels) as [value, label]}
            <option {value}>{label}</option>
          {/each}
        </select>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn-primary px-4 py-2" onclick={applyFilters}>
          Filtrar
        </button>
        <button type="button" class="btn-outline px-4 py-2" onclick={clearFilters}>
          Limpar
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card overflow-hidden p-0">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Lead
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Organização
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Áreas
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Data
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each data.leads as lead}
            <tr class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-4 py-4">
                <div>
                  <p class="font-medium text-gray-900">{lead.name}</p>
                  <p class="text-sm text-gray-500">{lead.email}</p>
                  {#if lead.phone}
                    <p class="text-sm text-gray-500">{lead.phone}</p>
                  {/if}
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-4">
                <p class="text-sm text-gray-900">
                  {organizationTypeLabels[lead.organization_type] || lead.organization_type}
                </p>
                {#if lead.city && lead.state_code}
                  <p class="text-sm text-gray-500">{lead.city}, {lead.state_code}</p>
                {/if}
              </td>
              <td class="px-4 py-4">
                <div class="flex flex-wrap gap-1">
                  {#each (lead.cultural_areas || []).slice(0, 3) as area}
                    <span class="badge bg-brand-100 text-brand-700">
                      {culturalAreaLabels[area] || area}
                    </span>
                  {/each}
                  {#if (lead.cultural_areas || []).length > 3}
                    <span class="badge bg-gray-100 text-gray-600">
                      +{(lead.cultural_areas || []).length - 3}
                    </span>
                  {/if}
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-4">
                <form method="POST" action="?/updateStatus" use:enhance>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <select
                    name="status"
                    class="rounded-full border-0 py-1 px-3 text-xs font-medium {statusColors[lead.status]}"
                    value={lead.status}
                    onchange={(e) => e.currentTarget.form?.requestSubmit()}
                  >
                    {#each Object.entries(leadStatusLabels) as [value, label]}
                      <option {value} selected={value === lead.status}>{label}</option>
                    {/each}
                  </select>
                </form>
              </td>
              <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                {formatDate(lead.created_at)}
              </td>
              <td class="whitespace-nowrap px-4 py-4 text-right">
                <a
                  href="/admin/leads/{lead.id}"
                  class="text-brand-600 hover:text-brand-700 text-sm font-medium"
                >
                  Ver detalhes
                </a>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                Nenhum lead encontrado.
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
        <p class="text-sm text-gray-700">
          Página {data.page} de {totalPages}
        </p>
        <div class="flex gap-2">
          {#if data.page > 1}
            <a
              href="/admin/leads?page={data.page - 1}{data.filters.status ? '&status=' + data.filters.status : ''}{data.filters.search ? '&search=' + data.filters.search : ''}"
              class="btn-outline px-3 py-1 text-sm"
            >
              Anterior
            </a>
          {/if}
          {#if data.page < totalPages}
            <a
              href="/admin/leads?page={data.page + 1}{data.filters.status ? '&status=' + data.filters.status : ''}{data.filters.search ? '&search=' + data.filters.search : ''}"
              class="btn-primary px-3 py-1 text-sm"
            >
              Próxima
            </a>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
