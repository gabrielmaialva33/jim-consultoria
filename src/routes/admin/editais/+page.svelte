<script lang="ts">
import { enhance } from '$app/forms';
import type { ActionData, PageData } from './$types';

const { data, form }: { data: PageData; form: ActionData } = $props();

let showModal = $state(false);
let editingGrant = $state<(typeof data.grants)[0] | null>(null);

const grantTypeLabels: Record<string, string> = {
	TAX_INCENTIVE: 'Incentivo Fiscal',
	DIRECT_FUNDING: 'Fomento Direto',
	SPONSORSHIP: 'Patrocínio'
};

function formatDate(dateStr: string | null) {
	if (!dateStr) return '-';
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
}

function formatCurrency(value: number | null) {
	if (value === null) return '-';
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 0
	}).format(value);
}

function daysUntilClose(dateStr: string | null) {
	if (!dateStr) return null;
	const target = new Date(dateStr);
	const now = new Date();
	const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
	return diff;
}

function openModal(grant?: (typeof data.grants)[0]) {
	editingGrant = grant || null;
	showModal = true;
}

function closeModal() {
	showModal = false;
	editingGrant = null;
}
</script>

<svelte:head>
  <title>Editais | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Editais</h1>
      <p class="text-gray-600">{data.grants.length} edital{data.grants.length !== 1 ? 'is' : ''} cadastrado{data.grants.length !== 1 ? 's' : ''}</p>
    </div>
    <button type="button" class="btn-primary px-4 py-2" onclick={() => openModal()}>
      + Novo Edital
    </button>
  </div>

  <!-- Success/Error messages -->
  {#if form?.message}
    <div class="rounded-lg bg-green-50 p-4 text-green-800">
      {form.message}
    </div>
  {/if}
  {#if form?.error}
    <div class="rounded-lg bg-red-50 p-4 text-red-800">
      {form.error}
    </div>
  {/if}

  <!-- Grants list -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.grants as grant}
      {@const daysLeft = daysUntilClose(grant.closes_at)}
      <div class="card {!grant.is_active ? 'opacity-60' : ''}">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">{grant.name}</h3>
            <p class="text-sm text-gray-500">{grant.agency}</p>
          </div>
          <span
            class="badge {grant.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}"
          >
            {grant.is_active ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Tipo</span>
            <span class="font-medium">{grantTypeLabels[grant.grant_type]}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Abertura</span>
            <span>{formatDate(grant.opens_at)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Encerramento</span>
            <span class="flex items-center gap-2">
              {formatDate(grant.closes_at)}
              {#if daysLeft !== null}
                <span
                  class="badge text-xs {daysLeft <= 7 ? 'bg-red-100 text-red-700' : daysLeft <= 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}"
                >
                  {daysLeft > 0 ? `${daysLeft}d` : 'Encerrado'}
                </span>
              {/if}
            </span>
          </div>
          {#if grant.max_per_project}
            <div class="flex justify-between">
              <span class="text-gray-500">Máx/Projeto</span>
              <span>{formatCurrency(grant.max_per_project)}</span>
            </div>
          {/if}
        </div>

        <div class="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex gap-2">
            <button
              type="button"
              class="text-sm text-brand-600 hover:text-brand-700"
              onclick={() => openModal(grant)}
            >
              Editar
            </button>
            {#if grant.official_url}
              <a
                href={grant.official_url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Link &rarr;
              </a>
            {/if}
          </div>
          <form method="POST" action="?/toggleActive" use:enhance>
            <input type="hidden" name="id" value={grant.id} />
            <input type="hidden" name="is_active" value={grant.is_active.toString()} />
            <button
              type="submit"
              class="text-sm {grant.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}"
            >
              {grant.is_active ? 'Desativar' : 'Ativar'}
            </button>
          </form>
        </div>
      </div>
    {:else}
      <div class="col-span-full card text-center text-gray-500">
        Nenhum edital cadastrado. Clique em "Novo Edital" para criar.
      </div>
    {/each}
  </div>
</div>

<!-- Modal -->
{#if showModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="card max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">
          {editingGrant ? 'Editar Edital' : 'Novo Edital'}
        </h2>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          onclick={closeModal}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form
        method="POST"
        action={editingGrant ? '?/update' : '?/create'}
        use:enhance={() => {
          return async ({ update }) => {
            await update();
            closeModal();
          };
        }}
        class="space-y-4"
      >
        {#if editingGrant}
          <input type="hidden" name="id" value={editingGrant.id} />
        {/if}

        <div>
          <label for="name" class="label">Nome *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            class="input"
            value={editingGrant?.name ?? ''}
          />
        </div>

        <div>
          <label for="agency" class="label">Órgão *</label>
          <input
            type="text"
            id="agency"
            name="agency"
            required
            class="input"
            value={editingGrant?.agency ?? ''}
          />
        </div>

        <div>
          <label for="grant_type" class="label">Tipo *</label>
          <select
            id="grant_type"
            name="grant_type"
            required
            class="input"
            value={editingGrant?.grant_type ?? 'TAX_INCENTIVE'}
          >
            <option value="TAX_INCENTIVE">Incentivo Fiscal</option>
            <option value="DIRECT_FUNDING">Fomento Direto</option>
            <option value="SPONSORSHIP">Patrocínio</option>
          </select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="opens_at" class="label">Data Abertura</label>
            <input
              type="date"
              id="opens_at"
              name="opens_at"
              class="input"
              value={editingGrant?.opens_at ?? ''}
            />
          </div>
          <div>
            <label for="closes_at" class="label">Data Encerramento</label>
            <input
              type="date"
              id="closes_at"
              name="closes_at"
              class="input"
              value={editingGrant?.closes_at ?? ''}
            />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="total_budget" class="label">Orçamento Total</label>
            <input
              type="number"
              id="total_budget"
              name="total_budget"
              class="input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={editingGrant?.total_budget ?? ''}
            />
          </div>
          <div>
            <label for="max_per_project" class="label">Máximo por Projeto</label>
            <input
              type="number"
              id="max_per_project"
              name="max_per_project"
              class="input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={editingGrant?.max_per_project ?? ''}
            />
          </div>
        </div>

        <div>
          <label for="official_url" class="label">URL Oficial</label>
          <input
            type="url"
            id="official_url"
            name="official_url"
            class="input"
            placeholder="https://..."
            value={editingGrant?.official_url ?? ''}
          />
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            checked={editingGrant?.is_active ?? true}
          />
          <label for="is_active" class="text-sm text-gray-700">Edital ativo</label>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            class="btn-outline px-4 py-2"
            onclick={closeModal}
          >
            Cancelar
          </button>
          <button type="submit" class="btn-primary px-4 py-2">
            {editingGrant ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
