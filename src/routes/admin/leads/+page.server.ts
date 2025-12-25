import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const status = url.searchParams.get('status') || '';
	const search = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = 10;

	let query = locals.supabase
		.from('leads')
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range((page - 1) * perPage, page * perPage - 1);

	if (status) {
		query = query.eq('status', status);
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

		const { error } = await locals.supabase.from('leads').update({ status }).eq('id', leadId);

		if (error) {
			console.error('Error updating lead status:', error);
			return fail(500, { error: 'Erro ao atualizar status.' });
		}

		return { success: true };
	}
};
