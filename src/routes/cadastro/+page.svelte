<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import {
	companyAgeLabels,
	culturalAreaLabels,
	grantInterestLabels,
	leadFormSchema,
	organizationTypeLabels
} from '$lib/schemas/lead';
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();

// Current step (1-5)
let currentStep = $state(1);
const totalSteps = 5;

const { form, errors, enhance, submitting, message } = superForm(data.form, {
	validators: zodClient(leadFormSchema),
	dataType: 'json'
});

// Step navigation
function nextStep() {
	if (currentStep < totalSteps) {
		currentStep++;
	}
}

function prevStep() {
	if (currentStep > 1) {
		currentStep--;
	}
}

// Check if current step is valid
function canProceed(): boolean {
	switch (currentStep) {
		case 1:
			return !!$form.name && !!$form.email;
		case 2:
			return !!$form.organization_type;
		case 3:
			return ($form.cultural_areas?.length ?? 0) > 0;
		case 4:
			return ($form.interested_grants?.length ?? 0) > 0;
		case 5:
			return true;
		default:
			return false;
	}
}

// Toggle array value
function toggleArrayValue(field: 'cultural_areas' | 'interested_grants', value: string) {
	const current = $form[field] ?? [];
	if (current.includes(value as never)) {
		$form[field] = current.filter((v: string) => v !== value) as never;
	} else {
		$form[field] = [...current, value] as never;
	}
}

// Step titles
const stepTitles = [
	'Dados Básicos',
	'Organização',
	'Área Cultural',
	'Editais de Interesse',
	'Seu Projeto'
];

// Show CNPJ field
const showCnpj = $derived($form.organization_type && $form.organization_type !== 'INDIVIDUAL');
</script>

<svelte:head>
  <title>Cadastro | JIM Consultoria</title>
  <meta name="description" content="Faça seu diagnóstico gratuito e descubra os melhores editais culturais para você." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center">
      <a href="/" class="text-brand-600 hover:text-brand-700 font-medium">&larr; Voltar</a>
      <h1 class="mt-4 text-3xl font-bold text-gray-900">Diagnóstico Gratuito</h1>
      <p class="mt-2 text-gray-600">Preencha o formulário e descubra os melhores editais para você</p>
    </div>

    <!-- Progress bar -->
    <div class="mt-8">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Passo {currentStep} de {totalSteps}</span>
        <span>{stepTitles[currentStep - 1]}</span>
      </div>
      <div class="mt-2 h-2 rounded-full bg-gray-200">
        <div
          class="h-2 rounded-full bg-brand-600 transition-all duration-300"
          style="width: {(currentStep / totalSteps) * 100}%"
        ></div>
      </div>
    </div>

    <!-- Form -->
    <form method="POST" use:enhance class="mt-8">
      <div class="card">
        <!-- Success message -->
        {#if $message}
          <div class="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
            <p class="font-medium">Cadastro realizado com sucesso!</p>
            <p class="mt-1 text-sm">Entraremos em contato em breve.</p>
          </div>
        {/if}

        <!-- Step 1: Basic Info -->
        {#if currentStep === 1}
          <div class="space-y-4">
            <div>
              <label for="name" class="label">Nome completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                bind:value={$form.name}
                class="input"
                placeholder="Seu nome"
              />
              {#if $errors.name}
                <p class="mt-1 text-sm text-red-600">{$errors.name}</p>
              {/if}
            </div>

            <div>
              <label for="email" class="label">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                bind:value={$form.email}
                class="input"
                placeholder="seu@email.com"
              />
              {#if $errors.email}
                <p class="mt-1 text-sm text-red-600">{$errors.email}</p>
              {/if}
            </div>

            <div>
              <label for="phone" class="label">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                bind:value={$form.phone}
                class="input"
                placeholder="(11) 99999-9999"
              />
              {#if $errors.phone}
                <p class="mt-1 text-sm text-red-600">{$errors.phone}</p>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Step 2: Organization -->
        {#if currentStep === 2}
          <div class="space-y-4">
            <div>
              <label class="label">Tipo de organização *</label>
              <div class="mt-2 grid gap-3 sm:grid-cols-2">
                {#each Object.entries(organizationTypeLabels) as [value, label]}
                  <label
                    class="flex cursor-pointer items-center rounded-lg border p-4 transition-colors {$form.organization_type === value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}"
                  >
                    <input
                      type="radio"
                      name="organization_type"
                      {value}
                      bind:group={$form.organization_type}
                      class="sr-only"
                    />
                    <span class="text-sm font-medium text-gray-900">{label}</span>
                  </label>
                {/each}
              </div>
              {#if $errors.organization_type}
                <p class="mt-1 text-sm text-red-600">{$errors.organization_type}</p>
              {/if}
            </div>

            {#if showCnpj}
              <div>
                <label for="tax_id" class="label">CNPJ</label>
                <input
                  type="text"
                  id="tax_id"
                  name="tax_id"
                  bind:value={$form.tax_id}
                  class="input"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label class="label">Tempo de CNPJ</label>
                <div class="mt-2 grid gap-3 sm:grid-cols-2">
                  {#each Object.entries(companyAgeLabels) as [value, label]}
                    <label
                      class="flex cursor-pointer items-center rounded-lg border p-4 transition-colors {$form.company_age === value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}"
                    >
                      <input
                        type="radio"
                        name="company_age"
                        {value}
                        bind:group={$form.company_age}
                        class="sr-only"
                      />
                      <span class="text-sm font-medium text-gray-900">{label}</span>
                    </label>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="state_code" class="label">Estado</label>
                <select
                  id="state_code"
                  name="state_code"
                  bind:value={$form.state_code}
                  class="input"
                >
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="BA">Bahia</option>
                  <option value="PR">Paraná</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="PE">Pernambuco</option>
                  <option value="CE">Ceará</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="GO">Goiás</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="">Outro</option>
                </select>
              </div>
              <div>
                <label for="city" class="label">Cidade</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  bind:value={$form.city}
                  class="input"
                  placeholder="Sua cidade"
                />
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 3: Cultural Areas -->
        {#if currentStep === 3}
          <div>
            <label class="label">Áreas culturais de atuação * (selecione todas que se aplicam)</label>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              {#each Object.entries(culturalAreaLabels) as [value, label]}
                <label
                  class="flex cursor-pointer items-center rounded-lg border p-4 transition-colors {$form.cultural_areas?.includes(value as never) ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <input
                    type="checkbox"
                    checked={$form.cultural_areas?.includes(value as never)}
                    onchange={() => toggleArrayValue('cultural_areas', value)}
                    class="sr-only"
                  />
                  <span class="text-sm font-medium text-gray-900">{label}</span>
                </label>
              {/each}
            </div>
            {#if $errors.cultural_areas}
              <p class="mt-2 text-sm text-red-600">{$errors.cultural_areas}</p>
            {/if}
          </div>
        {/if}

        <!-- Step 4: Grant Interest -->
        {#if currentStep === 4}
          <div>
            <label class="label">Editais de interesse * (selecione todos que deseja)</label>
            <div class="mt-4 space-y-3">
              {#each Object.entries(grantInterestLabels) as [value, label]}
                <label
                  class="flex cursor-pointer items-start rounded-lg border p-4 transition-colors {$form.interested_grants?.includes(value as never) ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <input
                    type="checkbox"
                    checked={$form.interested_grants?.includes(value as never)}
                    onchange={() => toggleArrayValue('interested_grants', value)}
                    class="sr-only"
                  />
                  <div>
                    <span class="text-sm font-medium text-gray-900">{label}</span>
                    {#if value === 'proac_icms'}
                      <p class="mt-1 text-xs text-gray-500">Incentivo fiscal via ICMS para projetos em São Paulo</p>
                    {:else if value === 'rouanet'}
                      <p class="mt-1 text-xs text-gray-500">Incentivo fiscal federal para captação de patrocínio</p>
                    {:else if value === 'pnab'}
                      <p class="mt-1 text-xs text-gray-500">Fomento direto - Política Nacional Aldir Blanc</p>
                    {/if}
                  </div>
                </label>
              {/each}
            </div>
            {#if $errors.interested_grants}
              <p class="mt-2 text-sm text-red-600">{$errors.interested_grants}</p>
            {/if}
          </div>
        {/if}

        <!-- Step 5: Project -->
        {#if currentStep === 5}
          <div class="space-y-4">
            <div>
              <label for="project_description" class="label">Descreva seu projeto (opcional)</label>
              <textarea
                id="project_description"
                name="project_description"
                bind:value={$form.project_description}
                rows="4"
                class="input"
                placeholder="Conte um pouco sobre seu projeto cultural..."
              ></textarea>
              {#if $errors.project_description}
                <p class="mt-1 text-sm text-red-600">{$errors.project_description}</p>
              {/if}
            </div>

            <div>
              <label for="estimated_budget" class="label">Orçamento estimado do projeto (opcional)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                <input
                  type="number"
                  id="estimated_budget"
                  name="estimated_budget"
                  bind:value={$form.estimated_budget}
                  class="input pl-12"
                  placeholder="0,00"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>
        {/if}

        <!-- Navigation -->
        <div class="mt-8 flex items-center justify-between">
          {#if currentStep > 1}
            <button
              type="button"
              onclick={prevStep}
              class="btn-outline px-6 py-2"
            >
              Voltar
            </button>
          {:else}
            <div></div>
          {/if}

          {#if currentStep < totalSteps}
            <button
              type="button"
              onclick={nextStep}
              disabled={!canProceed()}
              class="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          {:else}
            <button
              type="submit"
              disabled={$submitting || !canProceed()}
              class="btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if $submitting}
                Enviando...
              {:else}
                Enviar diagnóstico
              {/if}
            </button>
          {/if}
        </div>
      </div>
    </form>

    <!-- Trust indicators -->
    <div class="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
        <span>Dados protegidos</span>
      </div>
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>Sem compromisso</span>
      </div>
    </div>
  </div>
</div>
