<script lang="ts">
import { goto } from '$app/navigation';
import type { LayoutData } from './$types';

const { data, children }: { data: LayoutData; children: any } = $props();

let menuOpen = $state(false);

async function logout() {
	await fetch('/auth/logout', { method: 'POST' });
	goto('/auth/login');
}

const navItems = [
	{
		href: '/admin',
		label: 'Dashboard',
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
	},
	{
		href: '/admin/leads',
		label: 'Leads',
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
	},
	{
		href: '/admin/pipeline',
		label: 'Pipeline',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
	},
	{
		href: '/admin/grants',
		label: 'Editais',
		icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
	}
];
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Sidebar -->
  <div class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out {menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0">
    <div class="flex h-16 items-center justify-between px-4">
      <a href="/admin" class="text-xl font-bold text-white">JIM Admin</a>
      <button
        type="button"
        class="lg:hidden text-gray-400 hover:text-white"
        onclick={() => menuOpen = false}
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="mt-8 px-4">
      <ul class="space-y-2">
        {#each navItems as item}
          <li>
            <a
              href={item.href}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
              </svg>
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4">
      <div class="border-t border-gray-800 pt-4">
        <div class="flex items-center gap-3 px-3 py-2 text-sm text-gray-400">
          <div class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
            {data.session?.user.email?.charAt(0).toUpperCase()}
          </div>
          <div class="flex-1 truncate">
            {data.session?.user.email}
          </div>
        </div>
        <button
          type="button"
          onclick={logout}
          class="mt-2 w-full flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="lg:pl-64">
    <!-- Top bar -->
    <header class="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <button
        type="button"
        class="lg:hidden -m-2.5 p-2.5 text-gray-700"
        onclick={() => menuOpen = true}
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex-1"></div>

      <a href="/" target="_blank" class="text-sm text-gray-500 hover:text-gray-700">
        Ver site &rarr;
      </a>
    </header>

    <!-- Page content -->
    <main class="p-4 lg:p-6">
      {@render children()}
    </main>
  </div>
</div>

<!-- Mobile overlay -->
{#if menuOpen}
  <div
    class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    onclick={() => menuOpen = false}
  ></div>
{/if}
