<script lang="ts">
import { enhance } from '$app/forms';
import { page } from '$app/stores';

interface Props {
	user?: { email: string } | null;
	onMenuToggle?: () => void;
}

let { user = null, onMenuToggle }: Props = $props();
let showUserMenu = $state(false);

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
	const segments = pathname.split('/').filter(Boolean);
	const breadcrumbs: { label: string; href?: string }[] = [{ label: 'Home', href: '/admin' }];

	const labelMap: Record<string, string> = {
		admin: 'Dashboard',
		leads: 'Leads',
		pipeline: 'Pipeline',
		grants: 'Editais'
	};

	let path = '';
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		path += `/${segment}`;

		if (segment === 'admin' && i === 0) continue;

		if (labelMap[segment]) {
			breadcrumbs.push({
				label: labelMap[segment],
				href: i < segments.length - 1 ? path : undefined
			});
		} else if (segment.match(/^[0-9a-f-]+$/i)) {
			breadcrumbs.push({ label: 'Detalhes' });
		}
	}

	return breadcrumbs;
}

function toggleUserMenu() {
	showUserMenu = !showUserMenu;
}

function closeUserMenu() {
	showUserMenu = false;
}
</script>

<header class="admin-header">
	<div class="flex items-center gap-4">
		<!-- Mobile menu button -->
		{#if onMenuToggle}
			<button
				type="button"
				class="lg:hidden -ml-2 p-2 rounded-lg hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				onclick={onMenuToggle}
				aria-label="Abrir menu"
			>
				<svg class="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		{/if}

		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Breadcrumb">
			{#each getBreadcrumbs($page.url.pathname) as crumb, i}
				{#if i > 0}
					<span class="breadcrumb-separator" aria-hidden="true">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</span>
				{/if}
				{#if crumb.href}
					<a href={crumb.href} class="breadcrumb-item hover:text-foreground transition-all duration-200 hover:underline">
						{crumb.label}
					</a>
				{:else}
					<span class="breadcrumb-item">{crumb.label}</span>
				{/if}
			{/each}
		</nav>
	</div>

	<!-- Right side -->
	<div class="flex items-center gap-4">
		<!-- User menu -->
		<div class="relative">
			<button
				type="button"
				class="flex items-center gap-2 rounded-lg p-2 hover:bg-muted transition-all duration-200"
				onclick={toggleUserMenu}
			>
				<div class="avatar avatar-sm bg-primary">
					<span>{user?.email?.charAt(0).toUpperCase() || 'A'}</span>
				</div>
				<span class="hidden sm:block text-sm font-medium text-foreground">
					{user?.email || 'Admin'}
				</span>
				<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if showUserMenu}
				<!-- Backdrop -->
				<button
					type="button"
					class="fixed inset-0 z-40"
					onclick={closeUserMenu}
					aria-label="Close menu"
				></button>

				<!-- Dropdown -->
				<div class="dropdown-menu right-0 top-full mt-1 z-50">
					<div class="px-3 py-2 border-b border-border">
						<p class="text-sm font-medium text-foreground">{user?.email || 'Admin'}</p>
						<p class="text-xs text-muted-foreground">Administrador</p>
					</div>
					<div class="py-1">
						<form action="/auth/logout" method="POST" use:enhance>
							<button type="submit" class="dropdown-item w-full text-left text-destructive">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								<span>Sair</span>
							</button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>
