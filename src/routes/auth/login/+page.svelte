<script lang="ts">
import { enhance } from '$app/forms';
import type { ActionData } from './$types';

const { form }: { form: ActionData } = $props();

let loading = $state(false);
</script>

<svelte:head>
  <title>Login | JIM Consultoria</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h1 class="text-center text-3xl font-bold text-gray-900">JIM Consultoria</h1>
    <h2 class="mt-2 text-center text-lg text-gray-600">Acesso Administrativo</h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="card">
      <form
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
        class="space-y-6"
      >
        {#if form?.error}
          <div class="rounded-lg bg-red-50 p-4 text-red-800">
            <p class="text-sm">{form.error}</p>
          </div>
        {/if}

        <div>
          <label for="email" class="label">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            class="input"
            placeholder="admin@exemplo.com"
            value={form?.email ?? ''}
          />
        </div>

        <div>
          <label for="password" class="label">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            class="input"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="btn btn-primary w-full rounded-lg py-3 text-base disabled:opacity-50"
        >
          {#if loading}
            Entrando...
          {:else}
            Entrar
          {/if}
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="/" class="text-sm text-brand-600 hover:text-brand-700">
          &larr; Voltar ao site
        </a>
      </div>
    </div>
  </div>
</div>
