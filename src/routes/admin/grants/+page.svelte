<script lang="ts">
import { enhance } from '$app/forms';
import type { ActionData, PageData } from './$types';

const { data, form }: { data: PageData; form: ActionData } = $props();

let showModal = $state(false);
let editingGrant = $state<(typeof data.grants)[0] | null>(null);

const grantTypeLabels: Record<string, string> = {
	TAX_INCENTIVE: 'Incentivo Fiscal',
	DIRECT_FUNDING: 'Fomento Direto',
	SPONSORSHIP: 'Patrocinio'
};

const grantTypeClasses: Record<string, string> = {
	TAX_INCENTIVE: 'badge-primary',
	DIRECT_FUNDING: 'badge-success',
	SPONSORSHIP: 'badge-info'
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

const activeGrants = $derived(data.grants.filter((g) => g.is_active).length);
</script>

<svelte:head>
	<title>Editais | JIM Consultoria</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Editais</h1>
			<p class="text-muted-foreground">
				{activeGrants} ativo{activeGrants !== 1 ? 's' : ''} de {data.grants.length} cadastrado{data
					.grants.length !== 1
					? 's'
					: ''}
			</p>
		</div>
		<button type="button" class="btn btn-primary btn-md" onclick={() => openModal()}>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Novo Edital
		</button>
	</div>

	<!-- Success/Error messages -->
	{#if form?.message}
		<div
			class="flex items-center gap-2 rounded-lg border border-success/30 bg-success-light p-4"
			style="color: #496b3b;"
		>
			<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div
			class="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-light p-4"
			style="color: #6e2828;"
		>
			<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			{form.error}
		</div>
	{/if}

	<!-- Grants list -->
	{#if data.grants.length > 0}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.grants as grant}
				{@const daysLeft = daysUntilClose(grant.closes_at)}
				<div class="card hover:shadow-lg hover:border-primary/20 transition-all duration-200 {!grant.is_active ? 'opacity-60' : ''}">
					<!-- Card header -->
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-foreground truncate">{grant.name}</h3>
							<p class="text-sm text-muted-foreground">{grant.agency}</p>
						</div>
						<span
							class="badge badge-sm font-semibold {grant.is_active
								? 'badge-success'
								: 'bg-gray-200 text-gray-600'}"
						>
							{grant.is_active ? 'Ativo' : 'Inativo'}
						</span>
					</div>

					<!-- Grant type badge -->
					<div class="mt-3">
						<span class="badge badge-sm {grantTypeClasses[grant.grant_type]}">
							{grantTypeLabels[grant.grant_type]}
						</span>
					</div>

					<!-- Grant details -->
					<div class="mt-4 space-y-3">
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">Abertura</span>
							<span class="font-medium text-foreground">{formatDate(grant.opens_at)}</span>
						</div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">Encerramento</span>
							<span class="flex items-center gap-2">
								<span class="font-medium text-foreground">{formatDate(grant.closes_at)}</span>
								{#if daysLeft !== null}
									<span
										class="badge badge-sm {daysLeft <= 0
											? 'badge-destructive'
											: daysLeft <= 7
												? 'badge-destructive'
												: daysLeft <= 30
													? 'badge-warning'
													: 'badge-success'}"
									>
										{#if daysLeft <= 0}
											Encerrado
										{:else}
											{daysLeft}d
										{/if}
									</span>
								{/if}
							</span>
						</div>
						{#if grant.max_per_project}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Max/Projeto</span>
								<span class="font-medium text-primary">{formatCurrency(grant.max_per_project)}</span
								>
							</div>
						{/if}
						{#if grant.total_budget}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Orcamento Total</span>
								<span class="font-medium text-foreground">{formatCurrency(grant.total_budget)}</span
								>
							</div>
						{/if}
					</div>

					<!-- Card actions -->
					<div class="mt-4 pt-4 border-t border-border flex items-center justify-between">
						<div class="flex items-center gap-3">
							<button
								type="button"
								class="text-sm font-semibold text-primary hover:text-primary-dark transition-all duration-200 hover:underline"
								onclick={() => openModal(grant)}
							>
								Editar
							</button>
							{#if grant.official_url}
								<a
									href={grant.official_url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 hover:gap-1.5"
								>
									Link
									<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
								</a>
							{/if}
						</div>
						<form method="POST" action="?/toggleActive" use:enhance>
							<input type="hidden" name="id" value={grant.id} />
							<input type="hidden" name="is_active" value={grant.is_active.toString()} />
							<button
								type="submit"
								class="text-sm font-semibold {grant.is_active
									? 'text-destructive hover:text-destructive/80'
									: 'text-success hover:text-success/80'} transition-all duration-200 hover:underline"
							>
								{grant.is_active ? 'Desativar' : 'Ativar'}
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="card">
			<div class="empty-state py-12">
				<svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<p class="empty-state-title">Nenhum edital cadastrado</p>
				<p class="empty-state-description">
					Clique em "Novo Edital" para cadastrar o primeiro edital.
				</p>
				<button type="button" class="btn btn-primary btn-md mt-4" onclick={() => openModal()}>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Novo Edital
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 bg-foreground/50 backdrop-blur-sm"
			onclick={closeModal}
			aria-label="Fechar modal"
		></button>

		<!-- Modal content -->
		<div class="card relative max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold text-foreground">
					{editingGrant ? 'Editar Edital' : 'Novo Edital'}
				</h2>
				<button
					type="button"
					class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
					onclick={closeModal}
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
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
						placeholder="Ex: ProAC ICMS 2025"
						value={editingGrant?.name ?? ''}
					/>
				</div>

				<div>
					<label for="agency" class="label">Orgao *</label>
					<input
						type="text"
						id="agency"
						name="agency"
						required
						class="input"
						placeholder="Ex: Secretaria de Cultura SP"
						value={editingGrant?.agency ?? ''}
					/>
				</div>

				<div>
					<label for="grant_type" class="label">Tipo *</label>
					<select
						id="grant_type"
						name="grant_type"
						required
						class="input select"
						value={editingGrant?.grant_type ?? 'TAX_INCENTIVE'}
					>
						<option value="TAX_INCENTIVE">Incentivo Fiscal</option>
						<option value="DIRECT_FUNDING">Fomento Direto</option>
						<option value="SPONSORSHIP">Patrocinio</option>
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
						<label for="total_budget" class="label">Orcamento Total (R$)</label>
						<input
							type="number"
							id="total_budget"
							name="total_budget"
							class="input"
							placeholder="0"
							step="1"
							min="0"
							value={editingGrant?.total_budget ?? ''}
						/>
					</div>
					<div>
						<label for="max_per_project" class="label">Maximo por Projeto (R$)</label>
						<input
							type="number"
							id="max_per_project"
							name="max_per_project"
							class="input"
							placeholder="0"
							step="1"
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

				<div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
					<input
						type="checkbox"
						id="is_active"
						name="is_active"
						class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
						checked={editingGrant?.is_active ?? true}
					/>
					<label for="is_active" class="text-sm text-foreground">Edital ativo</label>
				</div>

				<div class="flex justify-end gap-3 pt-4 border-t border-border">
					<button type="button" class="btn btn-outline btn-md" onclick={closeModal}>
						Cancelar
					</button>
					<button type="submit" class="btn btn-primary btn-md">
						{editingGrant ? 'Salvar Alteracoes' : 'Criar Edital'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
