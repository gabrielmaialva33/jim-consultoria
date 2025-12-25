<script lang="ts">
import { enhance } from '$app/forms';
import {
	companyAgeLabels,
	culturalAreaLabels,
	grantInterestLabels,
	leadStatusLabels,
	organizationTypeLabels
} from '$lib/schemas/lead';
import type { ActionData, PageData } from './$types';

const { data, form }: { data: PageData; form: ActionData } = $props();

const showNoteForm = $state(false);
const showTaskForm = $state(false);

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
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

const statusColors: Record<string, string> = {
	NEW: 'bg-gray-100 text-gray-700',
	QUALIFICATION: 'bg-yellow-100 text-yellow-700',
	PROPOSAL: 'bg-blue-100 text-blue-700',
	NEGOTIATION: 'bg-purple-100 text-purple-700',
	WON: 'bg-green-100 text-green-700',
	LOST: 'bg-red-100 text-red-700'
};

const activityTypeLabels: Record<string, string> = {
	NOTE: 'Nota',
	EMAIL: 'E-mail',
	CALL: 'Ligação',
	MEETING: 'Reunião',
	STATUS_CHANGE: 'Mudança de Status',
	TASK_CREATED: 'Tarefa Criada',
	DOCUMENT_UPLOADED: 'Documento Enviado'
};
</script>

<svelte:head>
  <title>{data.lead.name} | Leads | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <a href="/admin/leads" class="text-brand-600 hover:text-brand-700 text-sm mb-2 inline-block">
        &larr; Voltar para leads
      </a>
      <h1 class="text-2xl font-bold text-gray-900">{data.lead.name}</h1>
      <p class="text-gray-600">{data.lead.email}</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="badge text-sm {statusColors[data.lead.status]}">
        {leadStatusLabels[data.lead.status]}
      </span>
      <form method="POST" action="?/recalculateEligibility" use:enhance>
        <button type="submit" class="btn-outline px-3 py-1 text-sm">
          Recalcular Score
        </button>
      </form>
    </div>
  </div>

  {#if form?.message}
    <div class="rounded-lg bg-green-50 p-4 text-green-800">{form.message}</div>
  {/if}

  <div class="grid gap-6 lg:grid-cols-3">
    <!-- Main info -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Lead details -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
        <dl class="grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-sm text-gray-500">Organização</dt>
            <dd class="font-medium">{organizationTypeLabels[data.lead.organization_type]}</dd>
          </div>
          {#if data.lead.company_age}
            <div>
              <dt class="text-sm text-gray-500">Tempo de CNPJ</dt>
              <dd class="font-medium">{companyAgeLabels[data.lead.company_age]}</dd>
            </div>
          {/if}
          {#if data.lead.tax_id}
            <div>
              <dt class="text-sm text-gray-500">CNPJ</dt>
              <dd class="font-medium">{data.lead.tax_id}</dd>
            </div>
          {/if}
          <div>
            <dt class="text-sm text-gray-500">Localização</dt>
            <dd class="font-medium">{data.lead.city || '-'}, {data.lead.state_code}</dd>
          </div>
          {#if data.lead.phone}
            <div>
              <dt class="text-sm text-gray-500">Telefone</dt>
              <dd class="font-medium">{data.lead.phone}</dd>
            </div>
          {/if}
          <div>
            <dt class="text-sm text-gray-500">Cadastrado em</dt>
            <dd class="font-medium">{formatDate(data.lead.created_at)}</dd>
          </div>
        </dl>

        {#if data.lead.cultural_areas && data.lead.cultural_areas.length > 0}
          <div class="mt-4 pt-4 border-t border-gray-100">
            <dt class="text-sm text-gray-500 mb-2">Áreas Culturais</dt>
            <dd class="flex flex-wrap gap-2">
              {#each data.lead.cultural_areas as area}
                <span class="badge bg-brand-100 text-brand-700">
                  {culturalAreaLabels[area] || area}
                </span>
              {/each}
            </dd>
          </div>
        {/if}

        {#if data.lead.interested_grants && data.lead.interested_grants.length > 0}
          <div class="mt-4 pt-4 border-t border-gray-100">
            <dt class="text-sm text-gray-500 mb-2">Editais de Interesse</dt>
            <dd class="flex flex-wrap gap-2">
              {#each data.lead.interested_grants as grant}
                <span class="badge bg-green-100 text-green-700">
                  {grantInterestLabels[grant] || grant}
                </span>
              {/each}
            </dd>
          </div>
        {/if}

        {#if data.lead.project_description}
          <div class="mt-4 pt-4 border-t border-gray-100">
            <dt class="text-sm text-gray-500 mb-2">Descrição do Projeto</dt>
            <dd class="text-gray-700">{data.lead.project_description}</dd>
          </div>
        {/if}

        {#if data.lead.estimated_budget}
          <div class="mt-4 pt-4 border-t border-gray-100">
            <dt class="text-sm text-gray-500 mb-2">Orçamento Estimado</dt>
            <dd class="font-medium text-lg">{formatCurrency(data.lead.estimated_budget)}</dd>
          </div>
        {/if}
      </div>

      <!-- Activity & Tasks -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Atividades</h2>
          <div class="flex gap-2">
            <button
              type="button"
              class="btn-outline px-3 py-1 text-sm"
              onclick={() => showNoteForm = !showNoteForm}
            >
              + Nota
            </button>
            <button
              type="button"
              class="btn-outline px-3 py-1 text-sm"
              onclick={() => showTaskForm = !showTaskForm}
            >
              + Tarefa
            </button>
          </div>
        </div>

        {#if showNoteForm}
          <form
            method="POST"
            action="?/addNote"
            use:enhance={() => {
              return async ({ update }) => {
                await update();
                showNoteForm = false;
              };
            }}
            class="mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <textarea
              name="content"
              rows="3"
              class="input"
              placeholder="Escreva uma nota..."
              required
            ></textarea>
            <div class="mt-2 flex justify-end gap-2">
              <button type="button" class="btn-outline px-3 py-1 text-sm" onclick={() => showNoteForm = false}>
                Cancelar
              </button>
              <button type="submit" class="btn-primary px-3 py-1 text-sm">Salvar</button>
            </div>
          </form>
        {/if}

        {#if showTaskForm}
          <form
            method="POST"
            action="?/addTask"
            use:enhance={() => {
              return async ({ update }) => {
                await update();
                showTaskForm = false;
              };
            }}
            class="mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <input
              type="text"
              name="title"
              class="input mb-2"
              placeholder="Título da tarefa"
              required
            />
            <div class="grid gap-2 sm:grid-cols-2">
              <input type="date" name="due_date" class="input" />
              <select name="priority" class="input">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM" selected>Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <button type="button" class="btn-outline px-3 py-1 text-sm" onclick={() => showTaskForm = false}>
                Cancelar
              </button>
              <button type="submit" class="btn-primary px-3 py-1 text-sm">Criar</button>
            </div>
          </form>
        {/if}

        <!-- Tasks -->
        {#if data.tasks.length > 0}
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Tarefas</h3>
            <ul class="space-y-2">
              {#each data.tasks as task}
                <li class="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <form method="POST" action="?/toggleTask" use:enhance>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="currentStatus" value={task.status} />
                    <button
                      type="submit"
                      class="h-5 w-5 rounded border {task.status === 'COMPLETED' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'} flex items-center justify-center"
                    >
                      {#if task.status === 'COMPLETED'}
                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      {/if}
                    </button>
                  </form>
                  <span class="{task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''} flex-1">
                    {task.title}
                  </span>
                  {#if task.due_date}
                    <span class="text-xs text-gray-500">
                      {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </span>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Activity log -->
        <ul class="space-y-3">
          {#each data.activities as activity}
            <li class="flex gap-3 text-sm">
              <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-gray-500">
                  <span class="font-medium text-gray-700">{activityTypeLabels[activity.activity_type]}</span>
                  <span class="text-xs ml-2">{formatDate(activity.created_at)}</span>
                </p>
                {#if activity.content}
                  <p class="text-gray-700 mt-1">{activity.content}</p>
                {/if}
              </div>
            </li>
          {:else}
            <li class="text-center text-gray-500 py-4">Nenhuma atividade registrada.</li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Eligibility Score -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Elegibilidade</h2>

        <div class="text-center mb-4">
          <div
            class="inline-flex items-center justify-center h-20 w-20 rounded-full text-2xl font-bold {data.lead.eligibility_score >= 70 ? 'bg-green-100 text-green-700' : data.lead.eligibility_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}"
          >
            {data.lead.eligibility_score ?? 0}%
          </div>
          <p class="text-sm text-gray-500 mt-2">Score Geral</p>
        </div>

        <div class="space-y-3">
          {#each data.eligibility as result}
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-sm">{result.grantName}</span>
                <span
                  class="badge text-xs {result.eligible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}"
                >
                  {result.score}%
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full {result.score >= 70 ? 'bg-green-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}"
                  style="width: {result.score}%"
                ></div>
              </div>
              {#if result.requirements.notMet.length > 0}
                <ul class="mt-2 text-xs text-red-600">
                  {#each result.requirements.notMet as req}
                    <li>• {req}</li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Notes -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Observações Internas</h2>
        <form method="POST" action="?/updateLead" use:enhance>
          <textarea
            name="notes"
            rows="4"
            class="input"
            placeholder="Adicione observações..."
          >{data.lead.notes || ''}</textarea>
          <button type="submit" class="btn-outline w-full mt-2 py-2 text-sm">
            Salvar
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
