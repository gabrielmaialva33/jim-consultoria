<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<svelte:head>
	<title>Blog | JIM Consultoria</title>
	<meta name="description" content="Blog da JIM Consultoria - Dicas e novidades sobre editais culturais." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white border-b border-gray-100">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<a href="/" class="text-brand-600 hover:text-brand-700 font-medium text-sm sm:text-base">
				&larr; Voltar ao início
			</a>
		</div>
	</header>

	<!-- Content -->
	<main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
		<div class="text-center py-16 sm:py-24">
			<!-- Icon -->
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
				<svg class="h-10 w-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
				</svg>
			</div>

			<h1 class="mt-6 text-3xl sm:text-4xl font-bold text-gray-900">Blog em Breve!</h1>
			<p class="mt-4 text-lg text-gray-600 max-w-md mx-auto">
				Estamos preparando conteúdos exclusivos sobre editais culturais, dicas de captação
				e novidades do setor.
			</p>

			<!-- Features coming -->
			<div class="mt-10 grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
				<div class="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 mx-auto">
						<svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
						</svg>
					</div>
					<h3 class="mt-3 font-semibold text-gray-900">Guias Práticos</h3>
					<p class="mt-1 text-sm text-gray-600">Passo a passo para editais</p>
				</div>

				<div class="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 mx-auto">
						<svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<h3 class="mt-3 font-semibold text-gray-900">Novidades</h3>
					<p class="mt-1 text-sm text-gray-600">Editais e prazos atualizados</p>
				</div>

				<div class="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 mx-auto">
						<svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
						</svg>
					</div>
					<h3 class="mt-3 font-semibold text-gray-900">Dicas de Sucesso</h3>
					<p class="mt-1 text-sm text-gray-600">Cases e estratégias</p>
				</div>
			</div>

			<!-- CTA -->
			<div class="mt-12 rounded-xl bg-brand-50 p-6 sm:p-8 max-w-xl mx-auto border border-brand-100">
				<h2 class="text-lg font-semibold text-brand-900">Quer ser avisado?</h2>
				<p class="mt-2 text-brand-700">
					Cadastre-se e receba nossos conteúdos em primeira mão.
				</p>
				<a
					href="/register"
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 transition-colors"
				>
					Fazer cadastro
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
					</svg>
				</a>
			</div>
		</div>
	</main>

	<Footer />
</div>
