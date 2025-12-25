import { fail } from '@sveltejs/kit';
import type { LeadStatus } from '$lib/supabase/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: leads, error } = await locals.supabase
		.from('leads')
		.select(
			'id, name, email, organization_type, cultural_areas, status, created_at, interested_grants'
		)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching leads for pipeline:', error);
	}

	return {
		leads: leads ?? []
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

		const { error } = await locals.supabase
			.from('leads')
			.update({ status: status as LeadStatus })
			.eq('id', leadId);

		if (error) {
			console.error('Error updating lead status:', error);
			return fail(500, { error: 'Erro ao atualizar status.' });
		}

		// Log activity
		await locals.supabase.from('activities').insert({
			lead_id: leadId,
			activity_type: 'STATUS_CHANGE',
			content: `Status alterado para ${status}`,
			metadata: { new_status: status }
		});

		return { success: true };
	}
};
