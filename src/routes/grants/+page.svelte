<script lang="ts">
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Footer from '$lib/components/landing/Footer.svelte'

let { data } = $props()

let searchInput = $state(data.search)
let isLoading = $state(false)

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value)
}

function formatDate(dateString: string): string {
	if (!dateString) return 'N/A'
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(new Date(dateString))
}

function getPersonTypeLabel(type: string | undefined): string {
	if (!type) return ''
	const types: Record<string, string> = {
		LegalPerson: 'Pessoa Jurídica',
		NaturalPerson: 'Pessoa Física',
		MEI: 'MEI'
	}
	return types[type] || type
}

function getStatusColor(status: string): string {
	const lowerStatus = status.toLowerCase()
	if (lowerStatus.includes('aprovad') || lowerStatus.includes('autorizada')) {
		return 'bg-green-100 text-green-700'
	}
	if (lowerStatus.includes('execu') || lowerStatus.includes('capta')) {
		return 'bg-blue-100 text-blue-700'
	}
	if (lowerStatus.includes('aguard') || lowerStatus.includes('análise')) {
		return 'bg-yellow-100 text-yellow-700'
	}
	return 'bg-gray-100 text-gray-700'
}

function truncateStatus(status: string): string {
	if (status.length <= 20) return status
	return status.slice(0, 20) + '...'
}

async function handleSearch(event: Event) {
	event.preventDefault()
	isLoading = true
	const params = new URLSearchParams($page.url.searchParams)
	if (searchInput.trim()) {
		params.set('busca', searchInput.trim())
	} else {
		params.delete('busca')
	}
	params.set('pagina', '1')
	await goto(`?${params}`, { invalidateAll: true })
	isLoading = false
}

async function handleProgramChange(programId: string) {
	isLoading = true
	const params = new URLSearchParams()
	params.set('programa', programId)
	params.set('pagina', '1')
	if (searchInput.trim()) {
		params.set('busca', searchInput.trim())
	}
	await goto(`?${params}`, { invalidateAll: true })
	isLoading = false
}

async function handlePageChange(newPage: number) {
	if (newPage < 1 || newPage > data.totalPages) return
	isLoading = true
	const params = new URLSearchParams($page.url.searchParams)
	params.set('pagina', newPage.toString())
	await goto(`?${params}`, { invalidateAll: true })
	isLoading = false
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}

	const pages: (number | 'ellipsis')[] = []

	if (current <= 4) {
		pages.push(1, 2, 3, 4, 5, 'ellipsis', total)
	} else if (current >= total - 3) {
		pages.push(1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total)
	} else {
		pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total)
	}

	return pages
}
</script>

<svelte:head>
	<title>Editais e Projetos Culturais | Jim Consultoria</title>
	<meta
		name="description"
		content="Explore editais e projetos culturais aprovados. ProAC ICMS, ProAC Editais, PNAB e Lei Rouanet."
	/>
</svelte:head>

<!-- Header -->
<header class="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-16 lg:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<a
				href="/"
				class="mb-6 inline-flex items-center gap-2 text-brand-200 hover:text-white transition-colors"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Voltar para início
			</a>
			<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
				Editais e Projetos Culturais
			</h1>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
				Explore projetos aprovados em editais estaduais (SP) e federais
			</p>
		</div>
	</div>
</header>

<main class="min-h-screen bg-gray-50 py-8 lg:py-12">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Filters -->
		<div class="mb-8 rounded-2xl bg-white p-6 shadow-sm">
			<!-- Program tabs -->
			<div class="mb-6">
				<h2 class="mb-3 text-sm font-medium text-gray-700">Programa</h2>
				<div class="flex flex-wrap gap-2">
					{#each data.programs as program}
						<button
							onclick={() => handleProgramChange(program.id)}
							class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {data.program ===
							program.id
								? 'bg-brand-600 text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							disabled={isLoading}
						>
							{program.label}
							<span class="ml-1 text-xs opacity-75">({program.description})</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Search -->
			<form onsubmit={handleSearch} class="flex gap-3">
				<div class="relative flex-1">
					<svg
						class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						bind:value={searchInput}
						placeholder="Buscar por nome do projeto, proponente ou palavra-chave..."
						class="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
						disabled={isLoading}
					/>
				</div>
				<button
					type="submit"
					class="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
					disabled={isLoading}
				>
					{#if isLoading}
						<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{:else}
						Buscar
					{/if}
				</button>
			</form>
		</div>

		<!-- Data source indicator -->
		<div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
			<span class="inline-flex items-center gap-1">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Fonte:
				{#if data.source === 'salic'}
					<a href="https://salic.cultura.gov.br" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">
						SALIC - Ministério da Cultura
					</a>
				{:else}
					<a href="https://fomentocultsp.sp.gov.br" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">
						FomentoCultSP - Secretaria de Cultura SP
					</a>
				{/if}
			</span>
		</div>

		<!-- Results count -->
		<div class="mb-6 flex items-center justify-between">
			<p class="text-sm text-gray-600">
				{#if data.total > 0}
					Mostrando <strong>{(data.page - 1) * data.perPage + 1}</strong> a
					<strong>{Math.min(data.page * data.perPage, data.total)}</strong>
					de <strong>{data.total.toLocaleString('pt-BR')}</strong> projetos
				{:else}
					Nenhum projeto encontrado
				{/if}
			</p>
			{#if data.search}
				<button
					onclick={() => {
						searchInput = ''
						handleSearch(new Event('submit'))
					}}
					class="text-sm text-brand-600 hover:text-brand-700"
				>
					Limpar busca
				</button>
			{/if}
		</div>

		<!-- Projects grid -->
		{#if data.projects.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.projects as project}
					<article
						class="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<!-- Header with status -->
						<div class="border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white p-4">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<h3
										class="truncate text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors"
										title={project.name}
									>
										{project.name}
									</h3>
									<p class="text-sm text-gray-500">
										{#if project.source === 'salic'}
											PRONAC {project.number}
										{:else}
											#{project.number}
										{/if}
									</p>
								</div>
								<span
									class="shrink-0 rounded-full px-3 py-1 text-xs font-medium {getStatusColor(project.status)}"
									title={project.status}
								>
									{truncateStatus(project.status)}
								</span>
							</div>
						</div>

						<!-- Content -->
						<div class="p-4">
							<!-- Proponent -->
							<div class="mb-4">
								<p class="text-sm font-medium text-gray-900">{project.proponentName}</p>
								<p class="text-sm text-gray-500">
									{project.proponentCity}, {project.state}
									{#if project.personType}
										&bull; {getPersonTypeLabel(project.personType)}
									{/if}
								</p>
							</div>

							<!-- Stats grid -->
							<div class="mb-4 grid grid-cols-2 gap-3">
								<div class="rounded-lg bg-gray-50 p-3">
									<p class="text-xs text-gray-500">Valor do Projeto</p>
									<p class="text-sm font-semibold text-gray-900">
										{formatCurrency(project.projectValue)}
									</p>
								</div>
								<div class="rounded-lg bg-gray-50 p-3">
									<p class="text-xs text-gray-500">Ano</p>
									<p class="text-sm font-semibold text-gray-900">{project.year}</p>
								</div>
							</div>

							<!-- Categories -->
							{#if project.categories?.length > 0}
								<div class="mb-4">
									<div class="flex flex-wrap gap-1">
										{#each project.categories.slice(0, 2) as category}
											<span
												class="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700"
												title={category}
											>
												{category.length > 25 ? category.slice(0, 25) + '...' : category}
											</span>
										{/each}
										{#if project.categories.length > 2}
											<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
												+{project.categories.length - 2}
											</span>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Footer with date/link -->
							<div class="border-t border-gray-100 pt-3 text-xs text-gray-500">
								<div class="flex items-center justify-between">
									{#if project.submittedDate}
										<span>Enviado: {formatDate(project.submittedDate)}</span>
									{:else}
										<span>{project.program}</span>
									{/if}
									{#if project.externalUrl}
										<a
											href={project.externalUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700"
										>
											Ver no SALIC
											<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</a>
									{/if}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.totalPages > 1}
				<nav class="mt-8 flex items-center justify-center gap-1" aria-label="Paginação">
					<button
						onclick={() => handlePageChange(data.page - 1)}
						disabled={data.page <= 1 || isLoading}
						class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Página anterior"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					{#each getPageNumbers(data.page, data.totalPages) as pageNum}
						{#if pageNum === 'ellipsis'}
							<span class="px-2 text-gray-400">...</span>
						{:else}
							<button
								onclick={() => handlePageChange(pageNum)}
								disabled={isLoading}
								class="min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors {data.page ===
								pageNum
									? 'bg-brand-600 text-white'
									: 'text-gray-700 hover:bg-gray-100'}"
								aria-current={data.page === pageNum ? 'page' : undefined}
							>
								{pageNum}
							</button>
						{/if}
					{/each}

					<button
						onclick={() => handlePageChange(data.page + 1)}
						disabled={data.page >= data.totalPages || isLoading}
						class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Próxima página"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</nav>
			{/if}
		{:else}
			<!-- Empty state -->
			<div class="rounded-2xl bg-white py-16 text-center shadow-sm">
				<svg
					class="mx-auto h-16 w-16 text-gray-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
				<p class="mt-2 text-gray-500">
					{#if data.search}
						Tente buscar com outras palavras-chave
					{:else}
						Não há projetos disponíveis para este programa no momento
					{/if}
				</p>
			</div>
		{/if}

		<!-- CTA -->
		<div class="mt-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center shadow-lg lg:p-12">
			<h2 class="text-2xl font-bold text-white lg:text-3xl">Quer ter seu projeto aprovado?</h2>
			<p class="mx-auto mt-4 max-w-2xl text-brand-100">
				Nossa consultoria especializada ajuda você a preparar e submeter projetos culturais com
				maior chance de aprovação.
			</p>
			<a
				href="/register"
				class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-lg font-semibold text-brand-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-brand-50 hover:shadow-xl"
			>
				Avaliar meu projeto
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</main>

<Footer />
