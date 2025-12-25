import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { leadFormSchema } from '$lib/schemas/lead';
import { calculateEligibility, getEligibleGrantNames, getOverallScore } from '$lib/scoring';
import type { Grant } from '$lib/supabase/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(leadFormSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(leadFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Fetch active grants for eligibility calculation
		const { data: grants } = await locals.supabase.from('grants').select('*').eq('is_active', true);

		// Calculate eligibility score
		const eligibilityResults = calculateEligibility(form.data as any, (grants ?? []) as Grant[]);
		const eligibilityScore = getOverallScore(eligibilityResults);
		const eligibleGrants = getEligibleGrantNames(eligibilityResults);

		// Prepare data for insertion
		const leadData = {
			name: form.data.name,
			email: form.data.email,
			phone: form.data.phone || null,
			organization_type: form.data.organization_type,
			company_age: form.data.company_age || null,
			tax_id: form.data.tax_id || null,
			state_code: form.data.state_code || 'SP',
			city: form.data.city || null,
			cultural_areas: form.data.cultural_areas,
			interested_grants: form.data.interested_grants,
			project_description: form.data.project_description || null,
			estimated_budget: form.data.estimated_budget || null,
			status: 'NEW' as const,
			source: 'landing',
			eligibility_score: eligibilityScore,
			eligible_grants: eligibleGrants
		};

		const { error } = await locals.supabase.from('leads').insert(leadData);

		if (error) {
			console.error('Error inserting lead:', error);

			// Handle duplicate email
			if (error.code === '23505') {
				return fail(400, {
					form,
					error: 'Este e-mail já está cadastrado. Entre em contato conosco.'
				});
			}

			return fail(500, {
				form,
				error: 'Ocorreu um erro ao enviar. Tente novamente.'
			});
		}

		return message(form, 'success');
	}
};
