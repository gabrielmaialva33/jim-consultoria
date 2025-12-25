import { fail } from '@sveltejs/kit';
import type { LeadStatus } from '$lib/supabase/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const status = url.searchParams.get('status') || '';
	const search = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = 10;

	// In a real generic service, we might pass filters as an object
	// For now, let's keep the query logic here or move extended logic to service.
	// Demonstrating Service usage for a simple fetch:

	// Refactoring to use the service would require the service to handle complex filtering.
	// For this step, I will stick to the existing query builder to avoid breaking complex filters
	// unless I update the service to handle them.
	// However, I CAN use the service for the 'updateStatus' action if I add it.

	// Let's keep the read logic here for flexibility but use the service pattern for write operations
	// or specific business logic.

	// ... Actually, let's just clean up the query construction to be more readable
	// and ensure strict typing.

	let query = locals.supabase
		.from('leads')
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range((page - 1) * perPage, page * perPage - 1);

	if (status) {
		query = query.eq('status', status as LeadStatus);
	}

	if (search) {
		query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
	}

	const { data: leads, count, error } = await query;

	if (error) {
		console.error('Error fetching leads:', error);
	}

	return {
		leads: leads ?? [],
		total: count ?? 0,
		page,
		perPage,
		filters: {
			status,
			search
		}
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		const formData = await request.formData();
		const leadId = formData.get('leadId') as string;
		const status = formData.get('status') as string;

		if (!leadId || !status) {
			return fail(400, { error: 'Lead ID e status são obrigatórios.' });
		}

		// Use Service pattern if complex validation was needed.
		// For direct DB updates, direct call is fine but we must ensure RLS.
		const { error } = await locals.supabase
			.from('leads')
			.update({ status: status as LeadStatus })
			.eq('id', leadId);

		if (error) {
			console.error('Error updating lead status:', error);
			return fail(500, { error: 'Erro ao atualizar status.' });
		}

		return { success: true };
	}
};
