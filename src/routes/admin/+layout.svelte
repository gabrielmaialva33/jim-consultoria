<script lang="ts">
import type { Snippet } from 'svelte';
import { browser } from '$app/environment';
import Header from '$lib/components/admin/layout/Header.svelte';
import Sidebar from '$lib/components/admin/layout/Sidebar.svelte';
import type { LayoutData } from './$types';

const { data, children }: { data: LayoutData; children: Snippet } = $props();

let menuOpen = $state(false);

function toggleMenu() {
	menuOpen = !menuOpen;
}

function closeMenu() {
	menuOpen = false;
}

// Prevent body scroll when mobile menu is open
$effect(() => {
	if (browser) {
		if (menuOpen) {
			document.body.classList.add('mobile-menu-open');
		} else {
			document.body.classList.remove('mobile-menu-open');
		}
	}
});
</script>

<div class="min-h-screen bg-background">
	<!-- Desktop Sidebar -->
	<div class="hidden lg:block">
		<Sidebar />
	</div>

	<!-- Mobile Sidebar -->
	<div
		class="fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out lg:hidden {menuOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<Sidebar onNavigate={closeMenu} />
	</div>

	<!-- Mobile overlay -->
	{#if menuOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300"
			onclick={closeMenu}
			aria-label="Close menu"
		></button>
	{/if}

	<!-- Main content area -->
	<div class="lg:pl-[260px]">
		<!-- Header -->
		<Header user={data.session?.user} onMenuToggle={toggleMenu} />

		<!-- Page content -->
		<main class="p-4 lg:p-6">
			{@render children()}
		</main>
	</div>
</div>
