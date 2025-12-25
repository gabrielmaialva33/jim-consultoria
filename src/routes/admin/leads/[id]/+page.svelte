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
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="flex items-start gap-4">
			<Avatar name={data.lead.name} size="xl" />
			<div>
				<a
					href="/admin/leads"
					class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-1"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Voltar para leads
				</a>
				<h1 class="text-2xl font-bold text-foreground">{data.lead.name}</h1>
				<p class="text-muted-foreground">{data.lead.email}</p>
				{#if data.lead.phone}
					<p class="text-sm text-muted-foreground">{data.lead.phone}</p>
				{/if}
			</div>
		</div>
		<div class="flex items-center gap-3">
			<form method="POST" action="?/updateStatus" use:enhance>
				<input type="hidden" name="leadId" value={data.lead.id} />
				<select
					name="status"
					class="badge cursor-pointer border-0 text-sm font-medium {statusBadgeClasses[data.lead.status]}"
					value={data.lead.status}
					onchange={(e) => e.currentTarget.form?.requestSubmit()}
				>
					{#each Object.entries(leadStatusLabels) as [value, label]}
						<option {value} selected={value === data.lead.status}>{label}</option>
					{/each}
				</select>
			</form>
			<form method="POST" action="?/recalculateEligibility" use:enhance>
				<button type="submit" class="btn btn-outline btn-sm">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
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

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Main info -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Lead details card -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">Informacoes do Lead</h2>
				</div>

				<dl class="grid gap-4 sm:grid-cols-2">
					<div class="p-3 rounded-lg bg-muted/50">
						<dt class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Organizacao
						</dt>
						<dd class="mt-1 font-medium text-foreground">
							{organizationTypeLabels[data.lead.organization_type]}
						</dd>
					</div>
					{#if data.lead.company_age}
						<div class="p-3 rounded-lg bg-muted/50">
							<dt class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Tempo de CNPJ
							</dt>
							<dd class="mt-1 font-medium text-foreground">
								{companyAgeLabels[data.lead.company_age]}
							</dd>
						</div>
					{/if}
					{#if data.lead.tax_id}
						<div class="p-3 rounded-lg bg-muted/50">
							<dt class="text-xs font-medium text-muted-foreground uppercase tracking-wide">CNPJ</dt>
							<dd class="mt-1 font-medium text-foreground font-mono">{data.lead.tax_id}</dd>
						</div>
					{/if}
					<div class="p-3 rounded-lg bg-muted/50">
						<dt class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Localizacao
						</dt>
						<dd class="mt-1 font-medium text-foreground">
							{data.lead.city || '-'}, {data.lead.state_code}
						</dd>
					</div>
					<div class="p-3 rounded-lg bg-muted/50">
						<dt class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Cadastrado em
						</dt>
						<dd class="mt-1 font-medium text-foreground">{formatShortDate(data.lead.created_at)}</dd>
					</div>
					<div class="p-3 rounded-lg bg-muted/50">
						<dt class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fonte</dt>
						<dd class="mt-1 font-medium text-foreground capitalize">
							{data.lead.source || 'Landing Page'}
						</dd>
					</div>
				</dl>

				{#if data.lead.cultural_areas && data.lead.cultural_areas.length > 0}
					<div class="mt-6 pt-6 border-t border-border">
						<h3 class="text-sm font-medium text-foreground mb-3">Areas Culturais</h3>
						<div class="flex flex-wrap gap-2">
							{#each data.lead.cultural_areas as area}
								<span class="badge badge-primary badge-sm">
									{culturalAreaLabels[area] || area}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if data.lead.interested_grants && data.lead.interested_grants.length > 0}
					<div class="mt-6 pt-6 border-t border-border">
						<h3 class="text-sm font-medium text-foreground mb-3">Editais de Interesse</h3>
						<div class="flex flex-wrap gap-2">
							{#each data.lead.interested_grants as grant}
								<span class="badge badge-success badge-sm">
									{grantInterestLabels[grant] || grant}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if data.lead.project_description}
					<div class="mt-6 pt-6 border-t border-border">
						<h3 class="text-sm font-medium text-foreground mb-3">Descricao do Projeto</h3>
						<p class="text-muted-foreground leading-relaxed">{data.lead.project_description}</p>
					</div>
				{/if}

				{#if data.lead.estimated_budget}
					<div class="mt-6 pt-6 border-t border-border">
						<h3 class="text-sm font-medium text-foreground mb-3">Orcamento Estimado</h3>
						<p class="text-2xl font-bold text-primary">
							{formatCurrency(data.lead.estimated_budget)}
						</p>
					</div>
				{/if}
			</div>

			<!-- Tasks Card -->
			<div class="card">
				<div class="card-header flex items-center justify-between">
					<h2 class="card-title">Tarefas</h2>
					<button
						type="button"
						class="btn btn-primary btn-sm"
						onclick={() => (showTaskForm = !showTaskForm)}
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Nova Tarefa
					</button>
				</div>

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
						class="mb-4 p-4 bg-muted/50 rounded-lg border border-border"
					>
						<div class="space-y-3">
							<input
								type="text"
								name="title"
								class="input"
								placeholder="Titulo da tarefa"
								required
							/>
							<div class="grid gap-3 sm:grid-cols-2">
								<div>
									<label for="due_date" class="label">Prazo</label>
									<input type="date" name="due_date" id="due_date" class="input" />
								</div>
								<div>
									<label for="priority" class="label">Prioridade</label>
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
								class="btn btn-outline btn-sm"
								onclick={() => (showTaskForm = false)}
							>
								Cancelar
							</button>
							<button type="submit" class="btn btn-primary btn-sm">Criar Tarefa</button>
						</div>
					</form>
				{/if}

				{#if data.tasks.length > 0}
					<ul class="space-y-2">
						{#each data.tasks as task}
							<li
								class="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
							>
								<form method="POST" action="?/toggleTask" use:enhance>
									<input type="hidden" name="taskId" value={task.id} />
									<input type="hidden" name="currentStatus" value={task.status} />
									<button
										type="submit"
										class="h-5 w-5 rounded border-2 flex items-center justify-center transition-colors {task.status ===
										'COMPLETED'
											? 'bg-success border-success text-white'
											: 'border-border hover:border-primary'}"
									>
										{#if task.status === 'COMPLETED'}
											<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										{/if}
									</button>
								</form>
								<span
									class="flex-1 {task.status === 'COMPLETED'
										? 'line-through text-muted-foreground'
										: 'text-foreground'}"
								>
									{task.title}
								</span>
								{#if task.priority && task.priority !== 'MEDIUM'}
									<span class="badge badge-sm {priorityClasses[task.priority]}">
										{priorityLabels[task.priority]}
									</span>
								{/if}
								{#if task.due_date}
									<span class="text-xs text-muted-foreground">
										{new Date(task.due_date).toLocaleDateString('pt-BR')}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else if !showTaskForm}
					<div class="empty-state py-8">
						<svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
							/>
						</svg>
						<p class="empty-state-title">Nenhuma tarefa</p>
						<p class="empty-state-description">Crie uma tarefa para acompanhar o progresso.</p>
					</div>
				{/if}
			</div>

			<!-- Activities Card -->
			<div class="card">
				<div class="card-header flex items-center justify-between">
					<h2 class="card-title">Atividades</h2>
					<button
						type="button"
						class="btn btn-outline btn-sm"
						onclick={() => (showNoteForm = !showNoteForm)}
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Adicionar Nota
					</button>
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
						class="mb-4 p-4 bg-muted/50 rounded-lg border border-border"
					>
						<textarea
							name="content"
							rows="3"
							class="input"
							placeholder="Escreva uma nota sobre este lead..."
							required
						></textarea>
						<div class="mt-3 flex justify-end gap-2">
							<button
								type="button"
								class="btn btn-outline btn-sm"
								onclick={() => (showNoteForm = false)}
							>
								Cancelar
							</button>
							<button type="submit" class="btn btn-primary btn-sm">Salvar Nota</button>
						</div>
					</form>
				{/if}

				{#if data.activities.length > 0}
					<div class="relative">
						<div class="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
						<ul class="space-y-4">
							{#each data.activities as activity}
								<li class="relative pl-10">
									<div
										class="absolute left-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background"
									>
										<svg
											class="h-4 w-4 text-muted-foreground"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d={activityIcons[activity.activity_type] || activityIcons['NOTE']}
											/>
										</svg>
									</div>
									<div class="pt-1">
										<div class="flex items-center gap-2">
											<span class="font-medium text-foreground text-sm">
												{activityTypeLabels[activity.activity_type]}
											</span>
											<span class="text-xs text-muted-foreground">
												{formatDate(activity.created_at)}
											</span>
										</div>
										{#if activity.content}
											<p class="mt-1 text-sm text-muted-foreground">{activity.content}</p>
										{/if}
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{:else if !showNoteForm}
					<div class="empty-state py-8">
						<svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						<p class="empty-state-title">Nenhuma atividade</p>
						<p class="empty-state-description">Adicione notas para acompanhar interacoes.</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Eligibility Score -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">Elegibilidade</h2>
				</div>

				<div class="text-center mb-6">
					<div
						class="inline-flex items-center justify-center h-24 w-24 rounded-full text-3xl font-bold {data
							.lead.eligibility_score >= 70
							? 'bg-success-light text-success'
							: data.lead.eligibility_score >= 50
								? 'bg-warning-light text-warning'
								: 'bg-destructive-light text-destructive'}"
					>
						{data.lead.eligibility_score ?? 0}%
					</div>
					<p class="text-sm text-muted-foreground mt-3">Score Geral de Elegibilidade</p>
				</div>

				<div class="space-y-4">
					{#each data.eligibility as result}
						<div class="p-4 rounded-lg border border-border">
							<div class="flex items-center justify-between mb-3">
								<span class="font-medium text-sm text-foreground">{result.grantName}</span>
								<span
									class="badge badge-sm {result.eligible
										? 'badge-success'
										: 'bg-muted text-muted-foreground'}"
								>
									{result.score}%
								</span>
							</div>
							<div class="h-2 bg-muted rounded-full overflow-hidden">
								<div
									class="h-full transition-all duration-300 {result.score >= 70
										? 'bg-success'
										: result.score >= 50
											? 'bg-warning'
											: 'bg-destructive'}"
									style="width: {result.score}%"
								></div>
							</div>
							{#if result.requirements.notMet.length > 0}
								<ul class="mt-3 space-y-1">
									{#each result.requirements.notMet as req}
										<li class="flex items-start gap-2 text-xs text-destructive">
											<svg
												class="h-3 w-3 mt-0.5 flex-shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
											{req}
										</li>
									{/each}
								</ul>
							{/if}
							{#if result.requirements.met && result.requirements.met.length > 0}
								<ul class="mt-2 space-y-1">
									{#each result.requirements.met as req}
										<li class="flex items-start gap-2 text-xs text-success">
											<svg
												class="h-3 w-3 mt-0.5 flex-shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
											{req}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Internal Notes -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">Observacoes Internas</h2>
				</div>
				<form method="POST" action="?/updateLead" use:enhance>
					<textarea
						name="notes"
						rows="5"
						class="input"
						placeholder="Adicione observacoes privadas sobre este lead..."
						>{data.lead.notes || ''}</textarea
					>
					<button type="submit" class="btn btn-outline w-full mt-3">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Salvar Observacoes
					</button>
				</form>
			</div>

			<!-- Quick Actions -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">Acoes Rapidas</h2>
				</div>
				<div class="space-y-2">
					<a
						href="mailto:{data.lead.email}"
						class="btn btn-outline w-full justify-start"
						target="_blank"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						Enviar E-mail
					</a>
					{#if data.lead.phone}
						<a
							href="https://wa.me/55{data.lead.phone.replace(/\D/g, '')}"
							class="btn btn-outline w-full justify-start"
							target="_blank"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
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
