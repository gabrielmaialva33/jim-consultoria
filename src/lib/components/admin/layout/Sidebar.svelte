<script lang="ts">
import { page } from '$app/stores';

interface MenuItem {
	href: string;
	label: string;
	icon: string;
}

const menuItems: MenuItem[] = [
	{ href: '/admin', label: 'Dashboard', icon: 'dashboard' },
	{ href: '/admin/leads', label: 'Leads', icon: 'users' },
	{ href: '/admin/pipeline', label: 'Pipeline', icon: 'kanban' },
	{ href: '/admin/grants', label: 'Editais', icon: 'document' }
];

function isActive(href: string, currentPath: string): boolean {
	if (href === '/admin') {
		return currentPath === '/admin';
	}
	return currentPath.startsWith(href);
}
</script>

<aside class="sidebar">
	<!-- Logo -->
	<div class="sidebar-logo">
		<a href="/admin" class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
				<span class="text-lg font-bold text-white">J</span>
			</div>
			<span class="text-lg font-semibold text-white">JIM Consultoria</span>
		</a>
	</div>

	<!-- Navigation -->
	<nav class="sidebar-nav">
		<div class="space-y-1">
			{#each menuItems as item}
				<a
					href={item.href}
					class="sidebar-item"
					class:active={isActive(item.href, $page.url.pathname)}
				>
					<span class="sidebar-item-icon">
						{#if item.icon === 'dashboard'}
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
							</svg>
						{:else if item.icon === 'users'}
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
							</svg>
						{:else if item.icon === 'kanban'}
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
							</svg>
						{:else if item.icon === 'document'}
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							</svg>
						{/if}
					</span>
					<span>{item.label}</span>
				</a>
			{/each}
		</div>

		<!-- Footer section -->
		<div class="sidebar-section mt-auto pt-4 border-t border-sidebar-border">
			<a href="/" target="_blank" class="sidebar-item">
				<span class="sidebar-item-icon">
					<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
					</svg>
				</span>
				<span>Ver Site</span>
			</a>
		</div>
	</nav>
</aside>
