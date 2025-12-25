<script lang="ts">
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<svelte:head>
	<title>Sobre Nós | JIM Consultoria</title>
	<meta name="description" content="Conheça a JIM Consultoria - especialistas em editais culturais para transformar seu projeto em realidade." />
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
		<h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Sobre a JIM Consultoria</h1>

		<div class="mt-8 space-y-6 text-gray-600 leading-relaxed">
			<p class="text-lg">
				A <strong class="text-gray-900">JIM Consultoria</strong> nasceu da paixão pela cultura brasileira
				e da vontade de democratizar o acesso aos recursos públicos de incentivo.
			</p>

			<section class="mt-10">
				<h2 class="text-2xl font-semibold text-gray-900">Nossa Missão</h2>
				<p class="mt-4">
					Ajudar artistas, produtores culturais e organizações a transformarem seus projetos em
					realidade através do acesso estratégico aos principais editais e leis de incentivo do Brasil.
				</p>
			</section>

			<section class="mt-10">
				<h2 class="text-2xl font-semibold text-gray-900">O Que Fazemos</h2>
				<ul class="mt-4 space-y-3">
					<li class="flex items-start gap-3">
						<span class="text-brand-600 mt-1">✓</span>
						<span>Diagnóstico gratuito de elegibilidade para editais</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-brand-600 mt-1">✓</span>
						<span>Elaboração e revisão de projetos culturais</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-brand-600 mt-1">✓</span>
						<span>Captação de recursos via Lei Rouanet e ProAC ICMS</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-brand-600 mt-1">✓</span>
						<span>Acompanhamento de editais PNAB e fomentos diretos</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-brand-600 mt-1">✓</span>
						<span>Prestação de contas e relatórios de execução</span>
					</li>
				</ul>
			</section>

			<section class="mt-10">
				<h2 class="text-2xl font-semibold text-gray-900">Nossos Diferenciais</h2>
				<div class="mt-6 grid gap-6 sm:grid-cols-2">
					<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
						<h3 class="font-semibold text-gray-900">Experiência Comprovada</h3>
						<p class="mt-2 text-sm">
							Anos de atuação com os principais programas de incentivo cultural do país.
						</p>
					</div>
					<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
						<h3 class="font-semibold text-gray-900">Atendimento Personalizado</h3>
						<p class="mt-2 text-sm">
							Cada projeto é único e merece uma estratégia sob medida.
						</p>
					</div>
					<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
						<h3 class="font-semibold text-gray-900">Transparência Total</h3>
						<p class="mt-2 text-sm">
							Você acompanha cada etapa do processo, sem surpresas.
						</p>
					</div>
					<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
						<h3 class="font-semibold text-gray-900">Taxa de Aprovação</h3>
						<p class="mt-2 text-sm">
							Alto índice de aprovação nos principais editais e leis de incentivo.
						</p>
					</div>
				</div>
			</section>

			<section class="mt-12 rounded-xl bg-brand-50 p-6 sm:p-8 border border-brand-100">
				<h2 class="text-xl font-semibold text-brand-900">Pronto para começar?</h2>
				<p class="mt-2 text-brand-700">
					Faça nosso diagnóstico gratuito e descubra quais editais são ideais para o seu projeto.
				</p>
				<a
					href="/register"
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 transition-colors"
				>
					Fazer diagnóstico gratuito
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
					</svg>
				</a>
			</section>
		</div>
	</main>

	<Footer />
</div>
