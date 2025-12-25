import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: grants, error } = await locals.supabase
		.from('grants')
		.select('*')
		.order('closes_at', { ascending: true, nullsFirst: false });

	if (error) {
		console.error('Error fetching grants:', error);
	}

	return {
		grants: grants ?? []
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		const grantData = {
			name: formData.get('name') as string,
			agency: formData.get('agency') as string,
			grant_type: formData.get('grant_type') as string,
			opens_at: (formData.get('opens_at') as string) || null,
			closes_at: (formData.get('closes_at') as string) || null,
			total_budget: formData.get('total_budget')
				? parseFloat(formData.get('total_budget') as string)
				: null,
			max_per_project: formData.get('max_per_project')
				? parseFloat(formData.get('max_per_project') as string)
				: null,
			official_url: (formData.get('official_url') as string) || null,
			is_active: formData.get('is_active') === 'on'
		};

		if (!grantData.name || !grantData.agency || !grantData.grant_type) {
			return fail(400, { error: 'Nome, órgão e tipo são obrigatórios.' });
		}

		const { error } = await locals.supabase.from('grants').insert(grantData);

		if (error) {
			console.error('Error creating grant:', error);
			return fail(500, { error: 'Erro ao criar edital.' });
		}

		return { success: true, message: 'Edital criado com sucesso!' };
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const grantId = formData.get('id') as string;

		const grantData = {
			name: formData.get('name') as string,
			agency: formData.get('agency') as string,
			grant_type: formData.get('grant_type') as string,
			opens_at: (formData.get('opens_at') as string) || null,
			closes_at: (formData.get('closes_at') as string) || null,
			total_budget: formData.get('total_budget')
				? parseFloat(formData.get('total_budget') as string)
				: null,
			max_per_project: formData.get('max_per_project')
				? parseFloat(formData.get('max_per_project') as string)
				: null,
			official_url: (formData.get('official_url') as string) || null,
			is_active: formData.get('is_active') === 'on'
		};

		const { error } = await locals.supabase.from('grants').update(grantData).eq('id', grantId);

		if (error) {
			console.error('Error updating grant:', error);
			return fail(500, { error: 'Erro ao atualizar edital.' });
		}

		return { success: true, message: 'Edital atualizado!' };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const grantId = formData.get('id') as string;

		const { error } = await locals.supabase.from('grants').delete().eq('id', grantId);

		if (error) {
			console.error('Error deleting grant:', error);
			return fail(500, { error: 'Erro ao excluir edital.' });
		}

		return { success: true, message: 'Edital excluído!' };
	},

	toggleActive: async ({ request, locals }) => {
		const formData = await request.formData();
		const grantId = formData.get('id') as string;
		const isActive = formData.get('is_active') === 'true';

		const { error } = await locals.supabase
			.from('grants')
			.update({ is_active: !isActive })
			.eq('id', grantId);

		if (error) {
			console.error('Error toggling grant status:', error);
			return fail(500, { error: 'Erro ao alterar status.' });
		}

		return { success: true };
	}
};
