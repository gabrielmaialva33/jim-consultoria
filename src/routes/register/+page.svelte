<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod4Client } from 'sveltekit-superforms/adapters';
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
	validators: zod4Client(leadFormSchema),
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

// IBGE API for states and cities
interface State {
	id: number;
	sigla: string;
	nome: string;
}

interface City {
	id: number;
	nome: string;
}

let states = $state<State[]>([]);
let cities = $state<City[]>([]);
let loadingStates = $state(true);
let loadingCities = $state(false);

// Fetch states on mount
$effect(() => {
	fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
		.then((res) => res.json())
		.then((data: State[]) => {
			states = data;
			loadingStates = false;
		})
		.catch(() => {
			loadingStates = false;
		});
});

// Fetch cities when state changes
let previousState = '';
$effect(() => {
	const stateCode = $form.state_code;
	if (stateCode && stateCode.length === 2) {
		// Only reset city if state actually changed
		if (previousState && previousState !== stateCode) {
			$form.city = '';
		}
		previousState = stateCode;

		loadingCities = true;
		fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`)
			.then((res) => res.json())
			.then((data: City[]) => {
				cities = data;
				loadingCities = false;
			})
			.catch(() => {
				loadingCities = false;
			});
	} else {
		cities = [];
	}
});

// Phone mask function
function maskPhone(event: Event) {
	const input = event.target as HTMLInputElement;
	let value = input.value.replace(/\D/g, ''); // Remove non-digits

	if (value.length > 11) {
		value = value.slice(0, 11);
	}

	if (value.length > 0) {
		// Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
		if (value.length <= 2) {
			value = `(${value}`;
		} else if (value.length <= 7) {
			value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
		} else {
			value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
		}
	}

	$form.phone = value;
}
</script>

<svelte:head>
  <title>Cadastro | JIM Consultoria</title>
  <meta name="description" content="Faça seu diagnóstico gratuito e descubra os melhores editais culturais para você." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-6 sm:py-12">
  <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center">
      <a href="/" class="text-brand-600 hover:text-brand-700 font-medium text-sm sm:text-base">&larr; Voltar</a>
      <h1 class="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-gray-900">Diagnóstico Gratuito</h1>
      <p class="mt-2 text-sm sm:text-base text-gray-600">Preencha o formulário e descubra os melhores editais para você</p>
    </div>

    <!-- Progress bar -->
    <div class="mt-6 sm:mt-8">
      <div class="flex items-center justify-between text-xs sm:text-sm text-gray-600">
        <span>Passo {currentStep} de {totalSteps}</span>
        <span class="font-medium">{stepTitles[currentStep - 1]}</span>
      </div>
      <div class="mt-2 h-1.5 sm:h-2 rounded-full bg-gray-200">
        <div
          class="h-1.5 sm:h-2 rounded-full bg-brand-600 transition-all duration-300"
          style="width: {(currentStep / totalSteps) * 100}%"
        ></div>
      </div>
    </div>

    <!-- Form -->
    <form method="POST" use:enhance class="mt-6 sm:mt-8">
      <div class="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
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
              <label for="name" class="label text-sm sm:text-base">Nome completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                bind:value={$form.name}
                class="input text-sm sm:text-base"
                placeholder="Seu nome"
              />
              {#if $errors.name}
                <p class="mt-1 text-xs sm:text-sm text-red-600">{$errors.name}</p>
              {/if}
            </div>

            <div>
              <label for="email" class="label text-sm sm:text-base">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                bind:value={$form.email}
                class="input text-sm sm:text-base"
                placeholder="seu@email.com"
              />
              {#if $errors.email}
                <p class="mt-1 text-xs sm:text-sm text-red-600">{$errors.email}</p>
              {/if}
            </div>

            <div>
              <label for="phone" class="label text-sm sm:text-base">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={$form.phone}
                oninput={maskPhone}
                class="input text-sm sm:text-base"
                placeholder="(11) 99999-9999"
              />
              {#if $errors.phone}
                <p class="mt-1 text-xs sm:text-sm text-red-600">{$errors.phone}</p>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Step 2: Organization -->
        {#if currentStep === 2}
          <div class="space-y-4">
            <div>
              <label class="label text-sm sm:text-base">Tipo de organização *</label>
              <div class="mt-2 grid gap-2 sm:gap-3 sm:grid-cols-2">
                {#each Object.entries(organizationTypeLabels) as [value, label]}
                  <label
                    class="flex cursor-pointer items-center rounded-lg border p-3 sm:p-4 transition-colors {$form.organization_type === value ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'}"
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
                <label for="tax_id" class="label text-sm sm:text-base">CNPJ</label>
                <input
                  type="text"
                  id="tax_id"
                  name="tax_id"
                  bind:value={$form.tax_id}
                  class="input text-sm sm:text-base"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label class="label text-sm sm:text-base">Tempo de CNPJ</label>
                <div class="mt-2 grid gap-2 sm:gap-3 sm:grid-cols-2">
                  {#each Object.entries(companyAgeLabels) as [value, label]}
                    <label
                      class="flex cursor-pointer items-center rounded-lg border p-3 sm:p-4 transition-colors {$form.company_age === value ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'}"
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

            <div class="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div>
                <label for="state_code" class="label text-sm sm:text-base">Estado</label>
                <select
                  id="state_code"
                  name="state_code"
                  bind:value={$form.state_code}
                  class="input select text-sm sm:text-base"
                  disabled={loadingStates}
                >
                  <option value="">{loadingStates ? 'Carregando...' : 'Selecione o estado'}</option>
                  {#each states as state}
                    <option value={state.sigla}>{state.nome}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="city" class="label text-sm sm:text-base">Cidade</label>
                <select
                  id="city"
                  name="city"
                  bind:value={$form.city}
                  class="input select text-sm sm:text-base"
                  disabled={!$form.state_code || loadingCities}
                >
                  <option value="">
                    {#if !$form.state_code}
                      Selecione o estado primeiro
                    {:else if loadingCities}
                      Carregando cidades...
                    {:else}
                      Selecione a cidade
                    {/if}
                  </option>
                  {#each cities as city}
                    <option value={city.nome}>{city.nome}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        {/if}

        <!-- Step 3: Cultural Areas -->
        {#if currentStep === 3}
          <div>
            <label class="label text-sm sm:text-base">Áreas culturais de atuação *</label>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Selecione todas que se aplicam</p>
            <div class="mt-3 sm:mt-4 grid gap-2 sm:gap-3 sm:grid-cols-2">
              {#each Object.entries(culturalAreaLabels) as [value, label]}
                <label
                  class="flex cursor-pointer items-center rounded-lg border p-3 sm:p-4 transition-colors {$form.cultural_areas?.includes(value as never) ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'}"
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
            <label class="label text-sm sm:text-base">Editais de interesse *</label>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Selecione todos que deseja</p>
            <div class="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {#each Object.entries(grantInterestLabels) as [value, label]}
                <label
                  class="flex cursor-pointer items-start rounded-lg border p-3 sm:p-4 transition-colors {$form.interested_grants?.includes(value as never) ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'}"
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
                      <p class="mt-0.5 sm:mt-1 text-xs text-gray-500">Incentivo fiscal via ICMS para projetos em São Paulo</p>
                    {:else if value === 'rouanet'}
                      <p class="mt-0.5 sm:mt-1 text-xs text-gray-500">Incentivo fiscal federal para captação de patrocínio</p>
                    {:else if value === 'pnab'}
                      <p class="mt-0.5 sm:mt-1 text-xs text-gray-500">Fomento direto - Política Nacional Aldir Blanc</p>
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
              <label for="project_description" class="label text-sm sm:text-base">Descreva seu projeto (opcional)</label>
              <textarea
                id="project_description"
                name="project_description"
                bind:value={$form.project_description}
                rows="4"
                class="input text-sm sm:text-base"
                placeholder="Conte um pouco sobre seu projeto cultural..."
              ></textarea>
              {#if $errors.project_description}
                <p class="mt-1 text-sm text-red-600">{$errors.project_description}</p>
              {/if}
            </div>

            <div>
              <label for="estimated_budget" class="label text-sm sm:text-base">Orçamento estimado do projeto (opcional)</label>
              <div class="flex items-center border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <span class="pl-3 sm:pl-4 pr-2 text-gray-500 select-none text-sm sm:text-base">R$</span>
                <input
                  type="text"
                  inputmode="numeric"
                  id="estimated_budget"
                  name="estimated_budget"
                  bind:value={$form.estimated_budget}
                  class="flex-1 py-2.5 sm:py-3 pr-3 sm:pr-4 bg-transparent border-none outline-none focus:ring-0 text-sm sm:text-base"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
        {/if}

        <!-- Navigation -->
        <div class="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {#if currentStep > 1}
            <button
              type="button"
              onclick={prevStep}
              class="btn btn-outline rounded-lg w-full sm:w-auto px-6 py-3 sm:py-2.5"
            >
              Voltar
            </button>
          {:else}
            <div class="hidden sm:block"></div>
          {/if}

          {#if currentStep < totalSteps}
            <button
              type="button"
              onclick={nextStep}
              disabled={!canProceed()}
              class="btn btn-primary rounded-lg w-full sm:w-auto px-6 py-3 sm:py-2.5"
            >
              Próximo
            </button>
          {:else}
            <button
              type="submit"
              disabled={$submitting || !canProceed()}
              class="btn btn-primary rounded-lg w-full sm:w-auto px-8 py-3 sm:py-2.5"
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
    <div class="mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
      <div class="flex items-center gap-1.5 sm:gap-2">
        <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
        <span>Dados protegidos</span>
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2">
        <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>Sem compromisso</span>
      </div>
    </div>
  </div>
</div>
