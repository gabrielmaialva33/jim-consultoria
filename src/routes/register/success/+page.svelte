<script lang="ts">
import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Cadastro Realizado | JIM Consultoria</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
  <div class="max-w-md w-full text-center">
    <!-- Success Icon -->
    <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
      <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- Title -->
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
      Cadastro realizado com sucesso!
    </h1>

    <!-- Message -->
    <p class="text-gray-600 mb-8">
      Obrigado pelo seu interesse! Nossa equipe analisara seu perfil e entrara em contato
      <strong class="text-brand-600">muito em breve</strong> para discutir as melhores oportunidades de editais culturais para voce.
    </p>

    <!-- What happens next -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left mb-8">
      <h2 class="font-semibold text-gray-900 mb-4">O que acontece agora?</h2>
      <ul class="space-y-3">
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
          <span class="text-sm text-gray-600">Vamos analisar seu perfil e identificar os editais mais adequados</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
          <span class="text-sm text-gray-600">Um consultor especializado entrara em contato por e-mail ou telefone</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
          <span class="text-sm text-gray-600">Apresentaremos um diagnostico completo com suas chances de aprovacao</span>
        </li>
      </ul>
    </div>

    <!-- CTA -->
    <a
      href="/"
      class="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
    >
      Voltar para o inicio
    </a>

    <!-- Contact info -->
    <p class="mt-6 text-sm text-gray-500">
      Duvidas? Entre em contato: <a href="mailto:contato@jimconsultoria.com.br" class="text-brand-600 hover:underline">contato@jimconsultoria.com.br</a>
    </p>
  </div>
</div>
