<script lang="ts">
import { enhance } from '$app/forms';
import Avatar from '$lib/components/admin/ui/Avatar.svelte';
import {
	companyAgeLabels,
	culturalAreaLabels,
	grantInterestLabels,
	leadStatusLabels,
	organizationTypeLabels
} from '$lib/schemas/lead';
import type { ActionData, PageData } from './$types';

const { data, form }: { data: PageData; form: ActionData } = $props();

let showNoteForm = $state(false);
let showTaskForm = $state(false);
let isAnalyzingAI = $state(false);
let showAIResults = $state(false);
let aiResults = $state<typeof form extends { aiAnalysis: infer T } ? T : null>(null);
let selectedProgram = $state<string | null>(null);

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

function formatShortDate(dateStr: string) {
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

const statusBadgeClasses: Record<string, string> = {
	NEW: 'badge-new',
	QUALIFICATION: 'badge-qualification',
	PROPOSAL: 'badge-proposal',
	NEGOTIATION: 'badge-negotiation',
	WON: 'badge-won',
	LOST: 'badge-lost'
};

const activityIcons: Record<string, string> = {
	NOTE: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
	EMAIL:
		'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
	CALL: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
	MEETING: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
	STATUS_CHANGE:
		'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
	TASK_CREATED:
		'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
	DOCUMENT_UPLOADED:
		'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
};

const activityTypeLabels: Record<string, string> = {
	NOTE: 'Nota',
	EMAIL: 'E-mail',
	CALL: 'Ligacao',
	MEETING: 'Reuniao',
	STATUS_CHANGE: 'Mudanca de Status',
	TASK_CREATED: 'Tarefa Criada',
	DOCUMENT_UPLOADED: 'Documento Enviado'
};

const priorityClasses: Record<string, string> = {
	LOW: 'badge-default',
	MEDIUM: 'badge-primary',
	HIGH: 'badge-warning',
	URGENT: 'badge-destructive'
};

const priorityLabels: Record<string, string> = {
	LOW: 'Baixa',
	MEDIUM: 'Media',
	HIGH: 'Alta',
	URGENT: 'Urgente'
};
</script>

<svelte:head>
	<title>{data.lead.name} | Leads | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div class="flex items-start gap-5">
				<Avatar name={data.lead.name} size="lg" />
				<div>
					<h1 class="text-3xl font-bold tracking-tight text-foreground">{data.lead.name}</h1>
					<div class="flex items-center gap-2 mt-1 text-muted-foreground">
						<span>{data.lead.email}</span>
						{#if data.lead.phone}
							<span>•</span>
							<span>{data.lead.phone}</span>
						{/if}
					</div>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<form method="POST" action="?/updateStatus" use:enhance>
					<input type="hidden" name="leadId" value={data.lead.id} />
					<select
						name="status"
						class="badge h-9 px-3 cursor-pointer appearance-none border-0 text-center font-medium {statusBadgeClasses[data.lead.status]}"
						value={data.lead.status}
						onchange={(e) => e.currentTarget.form?.requestSubmit()}
					>
						{#each Object.entries(leadStatusLabels) as [value, label]}
							<option {value} selected={value === data.lead.status}>{label}</option>
						{/each}
					</select>
				</form>
				<div class="w-px h-8 bg-border"></div>
				<form method="POST" action="?/recalculateEligibility" use:enhance>
					<button type="submit" class="btn btn-outline btn-sm h-9 gap-2">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Recalcular
					</button>
				</form>
			</div>
		</div>


	{#if form?.message}
		<div class="rounded-lg bg-success-light p-4 text-success border border-success/20">
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				{form.message}
			</div>
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-[1fr_340px]">
		<!-- Main Content -->
		<div class="space-y-6">
			
			<!-- Lead Info Grid -->
			<div class="card p-6">
				<h2 class="text-lg font-semibold mb-4">Detalhes do Lead</h2>
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<div class="space-y-1">
						<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Organizacao</span>
						<div class="font-medium">{organizationTypeLabels[data.lead.organization_type]}</div>
					</div>
					{#if data.lead.company_age}
						<div class="space-y-1">
							<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tempo</span>
							<div class="font-medium">{companyAgeLabels[data.lead.company_age]}</div>
						</div>
					{/if}
					{#if data.lead.tax_id}
						<div class="space-y-1">
							<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">CNPJ</span>
							<div class="font-mono text-sm">{data.lead.tax_id}</div>
						</div>
					{/if}
					
					<div class="space-y-1">
						<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Localizacao</span>
						<div class="flex items-center gap-1.5">
							<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span>{data.lead.city || '-'}, {data.lead.state_code}</span>
						</div>
					</div>
					
					<div class="space-y-1">
						<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cadastro</span>
						<div class="flex items-center gap-1.5">
							<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span>{formatShortDate(data.lead.created_at)}</span>
						</div>
					</div>

					<div class="space-y-1">
						<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fonte</span>
						<div class="flex items-center gap-1.5">
							<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
							</svg>
							<span class="capitalize">{data.lead.source || 'Landing Page'}</span>
						</div>
					</div>
				</div>

				{#if data.lead.estimated_budget}
					<div class="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
						<div>
							<span class="text-xs font-medium text-primary uppercase tracking-wider">Orcamento Estimado</span>
							<div class="text-2xl font-bold text-primary mt-1">{formatCurrency(data.lead.estimated_budget)}</div>
						</div>
						<div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
				{/if}

				{#if data.lead.project_description}
					<div class="mt-8">
						<h3 class="text-sm font-medium mb-2">Sobre o Projeto</h3>
						<p class="text-muted-foreground leading-relaxed text-sm bg-muted/30 p-4 rounded-lg border border-border">
							{data.lead.project_description}
						</p>
					</div>
				{/if}

				<div class="grid gap-6 sm:grid-cols-2 mt-6 pt-6 border-t border-border">
					{#if data.lead.cultural_areas && data.lead.cultural_areas.length > 0}
						<div>
							<h3 class="text-sm font-medium mb-3">Areas Culturais</h3>
							<div class="flex flex-wrap gap-2">
								{#each data.lead.cultural_areas as area}
									<span class="badge badge-primary badge-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
										{culturalAreaLabels[area] || area}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if data.lead.interested_grants && data.lead.interested_grants.length > 0}
						<div>
							<h3 class="text-sm font-medium mb-3">Interesse</h3>
							<div class="flex flex-wrap gap-2">
								{#each data.lead.interested_grants as grant}
									<span class="badge badge-success badge-sm bg-success/10 text-success border-success/20 hover:bg-success/20">
										{grantInterestLabels[grant] || grant}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Tasks -->
			<div class="card overflow-hidden">
				<div class="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
					<h2 class="font-semibold text-foreground">Tarefas</h2>
					<button
						type="button"
						class="btn btn-primary btn-sm h-8"
						onclick={() => (showTaskForm = !showTaskForm)}
					>
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						Nova
					</button>
				</div>

				<div class="p-6">
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
							class="mb-6 p-4 bg-muted/40 rounded-lg border border-border"
						>
							<div class="space-y-3">
								<input
									type="text"
									name="title"
									class="input"
									placeholder="O que precisa ser feito?"
									required
								/>
								<div class="grid gap-3 sm:grid-cols-2">
									<div>
										<label for="due_date" class="label text-xs">Prazo</label>
										<input type="date" name="due_date" id="due_date" class="input" />
									</div>
									<div>
										<label for="priority" class="label text-xs">Prioridade</label>
										<select name="priority" id="priority" class="input select">
											<option value="LOW">Baixa</option>
											<option value="MEDIUM" selected>Media</option>
											<option value="HIGH">Alta</option>
											<option value="URGENT">Urgente</option>
										</select>
									</div>
								</div>
							</div>
							<div class="mt-4 flex justify-end gap-2">
								<button
									type="button"
									class="btn btn-ghost btn-sm"
									onclick={() => (showTaskForm = false)}
								>
									Cancelar
								</button>
								<button type="submit" class="btn btn-primary btn-sm">Salvar</button>
							</div>
						</form>
					{/if}

					{#if data.tasks.length > 0}
						<ul class="space-y-1">
							{#each data.tasks as task}
								<li class="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
									<form method="POST" action="?/toggleTask" use:enhance>
										<input type="hidden" name="taskId" value={task.id} />
										<input type="hidden" name="currentStatus" value={task.status} />
										<button
											type="submit"
											class="h-5 w-5 rounded border flex items-center justify-center transition-all {task.status === 'COMPLETED' ? 'bg-success border-success text-white' : 'border-muted-foreground/30 hover:border-primary text-transparent'}"
										>
											<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
											</svg>
										</button>
									</form>
									<span class="flex-1 text-sm {task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}">
										{task.title}
									</span>
									<div class="flex items-center gap-2">
										{#if task.priority && task.priority !== 'MEDIUM'}
											<span class="badge badge-sm uppercase text-[10px] {priorityClasses[task.priority]}">
												{priorityLabels[task.priority]}
											</span>
										{/if}
										{#if task.due_date}
											<span class="text-xs text-muted-foreground flex items-center gap-1">
												<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												{new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
											</span>
										{/if}
									</div>
								</li>
							{/each}
						</ul>
					{:else if !showTaskForm}
						<div class="py-6 text-center">
							<p class="text-sm text-muted-foreground">Nenhuma tarefa pendente</p>
							<button class="text-sm text-primary font-medium hover:underline mt-1" onclick={() => showTaskForm = true}>
								Criar primeira tarefa
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Activities -->
			<div class="card overflow-hidden">
				<div class="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
					<h2 class="font-semibold text-foreground">Timeline</h2>
					<button
						type="button"
						class="btn btn-outline btn-sm h-8 bg-background"
						onclick={() => (showNoteForm = !showNoteForm)}
					>
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						Nota
					</button>
				</div>

				<div class="p-6">
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
							class="mb-6"
						>
							<textarea
								name="content"
								rows="3"
								class="input w-full resize-none"
								placeholder="Escreva uma nota..."
								required
							></textarea>
							<div class="mt-2 flex justify-end gap-2">
								<button
									type="button"
									class="btn btn-ghost btn-sm"
									onclick={() => (showNoteForm = false)}
								>
									Cancelar
								</button>
								<button type="submit" class="btn btn-primary btn-sm">Salvar</button>
							</div>
						</form>
					{/if}

					{#if data.activities.length > 0}
						<div class="relative pl-4 space-y-6">
							<div class="absolute left-4 top-2 bottom-2 w-px bg-border/60"></div>
							{#each data.activities as activity}
								<div class="relative pl-8">
									<div class="absolute left-0 top-1 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center z-10 shadow-sm">
										<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={activityIcons[activity.activity_type] || activityIcons['NOTE']} />
										</svg>
									</div>
									<div>
										<div class="flex items-baseline justify-between">
											<span class="font-medium text-sm text-foreground">
												{activityTypeLabels[activity.activity_type]}
											</span>
											<span class="text-xs text-muted-foreground tabular-nums">
												{formatDate(activity.created_at)}
											</span>
										</div>
										{#if activity.content}
											<p class="mt-1 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-md border border-border/50">
												{activity.content}
											</p>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else if !showNoteForm}
						<div class="py-6 text-center text-muted-foreground">
							<p class="text-sm">Nenhuma atividade registrada</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Eligibility Score -->
			<div class="card p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="font-semibold">Elegibilidade</h2>
					<form
						method="POST"
						action="?/analyzeWithAI"
						use:enhance={() => {
							isAnalyzingAI = true
							return async ({ result, update }) => {
								isAnalyzingAI = false
								if (result.type === 'success' && result.data?.aiAnalysis) {
									aiResults = result.data.aiAnalysis
									showAIResults = true
								}
								await update()
							}
						}}
					>
						<button
							type="submit"
							class="text-xs font-medium text-primary hover:underline flex items-center gap-1"
							disabled={isAnalyzingAI}
						>
							{#if isAnalyzingAI}
								<svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
								Analisando...
							{:else}
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
								Analisar com IA
							{/if}
						</button>
					</form>
				</div>

				<div class="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-xl border border-border/50">
					<div class="relative h-28 w-28 flex items-center justify-center">
						<svg class="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
							<path class="text-muted/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
							<path
								class="{data.lead.eligibility_score >= 70 ? 'text-success' : data.lead.eligibility_score >= 50 ? 'text-warning' : 'text-destructive'} transition-all duration-1000 ease-out"
								stroke-dasharray="{data.lead.eligibility_score ?? 0}, 100"
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
							/>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<span class="text-3xl font-bold {data.lead.eligibility_score >= 70 ? 'text-success' : data.lead.eligibility_score >= 50 ? 'text-warning' : 'text-destructive'}">
								{data.lead.eligibility_score ?? 0}%
							</span>
						</div>
					</div>
					<p class="text-sm font-medium mt-2 text-muted-foreground">Pontuacao Geral</p>
				</div>

				{#if showAIResults && aiResults}
					<div class="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-semibold text-sm text-primary flex items-center gap-2">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
								Analise IA
							</h3>
							<button type="button" class="text-muted-foreground hover:text-foreground" onclick={() => showAIResults = false}>
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
							</button>
						</div>

						{#if aiResults.bestProgram}
							<p class="text-sm border-b border-primary/10 pb-2 mb-2">
								Melhor: <span class="font-medium text-foreground">{aiResults.bestProgram}</span>
							</p>
						{/if}

						{#if aiResults.generalRecommendations?.length > 0}
							<ul class="space-y-1.5">
								{#each aiResults.generalRecommendations as rec}
									<li class="text-xs text-muted-foreground flex items-start gap-2">
										<svg class="h-3 w-3 mt-0.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" /></svg>
										{rec}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}

				<div class="mt-6 space-y-4">
					<h3 class="text-sm font-semibold mb-3">Detalhamento por Edital</h3>
					{#each data.eligibility as result}
						<div class="text-sm border-b border-border pb-3 last:border-0">
							<div class="flex items-center justify-between mb-1.5">
								<span class="font-medium">{result.grantName}</span>
								<span class="text-xs font-bold {result.score >= 50 ? 'text-success' : 'text-muted-foreground'}">{result.score}%</span>
							</div>
							<div class="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
								<div class="h-full {result.score >= 70 ? 'bg-success' : result.score >= 50 ? 'bg-warning' : 'bg-destructive'}" style="width: {result.score}%"></div>
							</div>
						</div>
					{/each}
				</div>

			</div>

			<!-- Internal Notes (Moved to sidebar for cleaner layout or kept in Activity tabs? Decided to keep Quick Actions here) -->
			<!-- Quick Actions -->
			<div class="card p-6">
				<h2 class="font-semibold mb-4">Acoes Rapidas</h2>
				<div class="space-y-2">
					<a
						href="mailto:{data.lead.email}"
						class="btn btn-outline w-full justify-start h-9"
						target="_blank"
					>
						<svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						Enviar E-mail
					</a>
					{#if data.lead.phone}
						<a
							href="https://wa.me/55{data.lead.phone.replace(/\D/g, '')}"
							class="btn btn-outline w-full justify-start h-9"
							target="_blank"
						>
							<svg class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
								/>
							</svg>
							WhatsApp
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
