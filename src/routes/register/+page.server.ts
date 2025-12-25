import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { leadFormSchema } from '$lib/schemas/lead';
import { calculateEligibility, getEligibleGrantNames, getOverallScore } from '$lib/scoring';
import { parseAndAnalyzeDocument } from '$lib/server/services/document-parser';
import type { Grant, Json, Lead } from '$lib/supabase/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(leadFormSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Get form data (multipart for file upload support)
		const formData = await request.formData();
		const form = await superValidate(formData, zod4(leadFormSchema));

		console.log('Form data received:', form.data);
		console.log('Form valid:', form.valid);
		console.log('Form errors:', form.errors);

		if (!form.valid) {
			console.log('Form validation failed');
			return fail(400, { form });
		}

		// Fetch active grants for eligibility calculation
		const { data: grants } = await locals.supabase.from('grants').select('*').eq('is_active', true);

		// Calculate eligibility score
		const eligibilityResults = calculateEligibility(
			form.data as Partial<Lead>,
			(grants ?? []) as Grant[]
		);
		const eligibilityScore = getOverallScore(eligibilityResults);
		const eligibleGrants = getEligibleGrantNames(eligibilityResults);

		// Handle document upload if present
		let documentContent: string | null = null;
		let documentMetadata: Json | null = null;
		let documentAnalysis: Json | null = null;

		const projectDocument = formData.get('project_document');
		if (projectDocument && projectDocument instanceof File && projectDocument.size > 0) {
			try {
				const result = await parseAndAnalyzeDocument(projectDocument);

				if (result.parsed.success) {
					documentContent = result.parsed.content;
					documentMetadata = (result.parsed.metadata as Json) || null;
					documentAnalysis = (result.analysis as unknown as Json) || null;

					// Use analyzed summary as project description if not provided
					if (!form.data.project_description && result.analysis?.summary) {
						form.data.project_description = result.analysis.summary;
					}
				} else {
					console.error('Document parsing failed:', result.parsed.error);
					// Continue without document - don't fail the submission
				}
			} catch (error) {
				console.error('Error processing document:', error);
				// Continue without document - don't fail the submission
			}
		}

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
			eligible_grants: eligibleGrants,
			document_content: documentContent,
			document_metadata: documentMetadata,
			document_analysis: documentAnalysis
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

		// Redirect to success page
		throw redirect(303, '/register/success');
	}
};
