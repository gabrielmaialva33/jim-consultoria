import type { Grant, Lead } from '$lib/supabase/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Fetch dashboard stats
	const [leadsResult, grantsResult] = await Promise.all([
		locals.supabase.from('leads').select('id, status, created_at'),
		locals.supabase.from('grants').select('id, name, closes_at, is_active').eq('is_active', true)
	]);

	const leads = (leadsResult.data ?? []) as Pick<Lead, 'id' | 'status' | 'created_at'>[];
	const grants = (grantsResult.data ?? []) as Pick<
		Grant,
		'id' | 'name' | 'closes_at' | 'is_active'
	>[];

	// Calculate stats
	const totalLeads = leads.length;
	const newLeads = leads.filter((l) => l.status === 'NEW').length;
	const inProgress = leads.filter((l) =>
		['QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)
	).length;
	const won = leads.filter((l) => l.status === 'WON').length;

	// Get recent leads (last 7 days)
	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);
	const recentLeads = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;

	// Upcoming deadlines (next 30 days)
	const now = new Date();
	const thirtyDays = new Date();
	thirtyDays.setDate(thirtyDays.getDate() + 30);

	const upcomingDeadlines = grants
		.filter(
			(g) => g.closes_at && new Date(g.closes_at) >= now && new Date(g.closes_at) <= thirtyDays
		)
		.sort(
			(a, b) =>
				new Date(a.closes_at as string).getTime() - new Date(b.closes_at as string).getTime()
		);

	return {
		stats: {
			totalLeads,
			newLeads,
			inProgress,
			won,
			recentLeads,
			activeGrants: grants.length
		},
		upcomingDeadlines
	};
};
