<script lang="ts">
import Footer from '$lib/components/landing/Footer.svelte';
</script>

<svelte:head>
	<title>Contato | JIM Consultoria</title>
	<meta name="description" content="Entre em contato com a JIM Consultoria para tirar dúvidas sobre editais culturais." />
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
		<h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Entre em Contato</h1>
		<p class="mt-4 text-lg text-gray-600">
			Estamos prontos para ajudar você a viabilizar seu projeto cultural.
		</p>

		<div class="mt-10 grid gap-8 lg:grid-cols-2">
			<!-- Contact Info -->
			<div class="space-y-6">
				<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100">
							<svg class="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">E-mail</h3>
							<a href="mailto:jimconsultoria@mahina.cloud" class="text-brand-600 hover:text-brand-700">
								jimconsultoria@mahina.cloud
							</a>
						</div>
					</div>
				</div>

				<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
							<svg class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
								<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">WhatsApp</h3>
							<a href="https://wa.me/5515988051147" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-700">
								(15) 98805-1147
							</a>
						</div>
					</div>
				</div>

				<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
							<svg class="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">LinkedIn</h3>
							<a href="https://linkedin.com/company/jimconsultoriacb" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700">
								@jimconsultoriacb
							</a>
						</div>
					</div>
				</div>

				<div class="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
							<svg class="h-6 w-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">Instagram</h3>
							<a href="https://instagram.com/jimconsultoriacb" target="_blank" rel="noopener noreferrer" class="text-pink-600 hover:text-pink-700">
								@jimconsultoriacb
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- CTA -->
			<div class="lg:pl-8">
				<div class="rounded-xl bg-brand-600 p-6 sm:p-8 text-white">
					<h2 class="text-xl font-semibold">Diagnóstico Gratuito</h2>
					<p class="mt-3 text-brand-100">
						Não sabe por onde começar? Faça nosso diagnóstico gratuito e descubra quais editais
						são ideais para o seu projeto cultural.
					</p>
					<a
						href="/register"
						class="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
					>
						Começar agora
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
						</svg>
					</a>
				</div>

				<div class="mt-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
					<h3 class="font-semibold text-gray-900">Horário de Atendimento</h3>
					<div class="mt-4 space-y-2 text-sm text-gray-600">
						<div class="flex justify-between">
							<span>Segunda a Sexta</span>
							<span class="font-medium text-gray-900">9h às 18h</span>
						</div>
						<div class="flex justify-between">
							<span>Sábado</span>
							<span class="font-medium text-gray-900">9h às 13h</span>
						</div>
						<div class="flex justify-between">
							<span>Domingo</span>
							<span class="text-gray-500">Fechado</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>
