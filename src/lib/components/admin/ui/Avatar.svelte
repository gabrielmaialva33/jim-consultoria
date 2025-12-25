<script lang="ts">
interface Props {
	name?: string;
	src?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	class?: string;
}

let { name = '', src, size = 'md', class: className = '' }: Props = $props();

const sizeClasses = {
	sm: 'avatar-sm',
	md: 'avatar-md',
	lg: 'avatar-lg',
	xl: 'avatar-xl'
};

const colors = [
	'bg-primary',
	'bg-success',
	'bg-warning',
	'bg-info',
	'bg-destructive',
	'bg-brand-500',
	'bg-brand-600',
	'bg-brand-700'
];

function getInitials(name: string): string {
	if (!name) return '?';
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) {
		return parts[0].charAt(0).toUpperCase();
	}
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
	if (!name) return colors[0];
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
}

const initials = getInitials(name);
const bgColor = getColorFromName(name);
</script>

{#if src}
	<img
		{src}
		alt={name}
		class="avatar {sizeClasses[size]} object-cover {className}"
	/>
{:else}
	<div class="avatar {sizeClasses[size]} {bgColor} {className}">
		<span>{initials}</span>
	</div>
{/if}
