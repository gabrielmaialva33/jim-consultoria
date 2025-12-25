import { error, fail } from '@sveltejs/kit';
import { calculateEligibility, getEligibleGrantNames, getOverallScore } from '$lib/scoring';
import {
	type AIEligibilityAnalysis,
	calculateAIEligibility,
	getAllProgramPrerequisites
} from '$lib/server/services/ai-eligibility';
import type { Grant, Json, TaskPriority, TaskStatus } from '$lib/supabase/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	// Fetch lead
	const { data: lead, error: leadError } = await locals.supabase
		.from('leads')
		.select('*')
		.eq('id', id)
		.single();

	if (leadError || !lead) {
		throw error(404, 'Lead não encontrado');
	}

	// Fetch activities
	const { data: activities } = await locals.supabase
		.from('activities')
		.select('*')
		.eq('lead_id', id)
		.order('created_at', { ascending: false })
		.limit(20);

	// Fetch tasks
	const { data: tasks } = await locals.supabase
		.from('tasks')
		.select('*')
		.eq('lead_id', id)
		.order('due_date', { ascending: true });

	// Fetch active grants for eligibility calculation
	const { data: grants } = await locals.supabase.from('grants').select('*').eq('is_active', true);

	// Calculate detailed eligibility (basic scoring)
	const eligibilityResults = calculateEligibility(lead, (grants ?? []) as Grant[]);

	// Get program prerequisites for display
	const programPrerequisites = getAllProgramPrerequisites();

	return {
		lead,
		activities: activities ?? [],
		tasks: tasks ?? [],
		eligibility: eligibilityResults,
		programPrerequisites
	};
};

export const actions: Actions = {
	addNote: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content) {
			return fail(400, { error: 'Conteúdo é obrigatório.' });
		}

		const { error: insertError } = await locals.supabase.from('activities').insert({
			lead_id: params.id,
			activity_type: 'NOTE',
			content
		});

		if (insertError) {
			return fail(500, { error: 'Erro ao adicionar nota.' });
		}

		return { success: true };
	},

	addTask: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const dueDate = formData.get('due_date') as string;
		const priority = (formData.get('priority') as string) || 'MEDIUM';

		if (!title) {
			return fail(400, { error: 'Título é obrigatório.' });
		}

		const { error: insertError } = await locals.supabase.from('tasks').insert({
			lead_id: params.id,
			title,
			due_date: dueDate || null,
			priority: priority as TaskPriority
		});

		if (insertError) {
			return fail(500, { error: 'Erro ao criar tarefa.' });
		}

		return { success: true };
	},

	toggleTask: async ({ request, locals }) => {
		const formData = await request.formData();
		const taskId = formData.get('taskId') as string;
		const currentStatus = formData.get('currentStatus') as string;

		const newStatus: TaskStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
		const completedAt = newStatus === 'COMPLETED' ? new Date().toISOString() : null;

		const { error: updateError } = await locals.supabase
			.from('tasks')
			.update({ status: newStatus, completed_at: completedAt })
			.eq('id', taskId);

		if (updateError) {
			return fail(500, { error: 'Erro ao atualizar tarefa.' });
		}

		return { success: true };
	},

	updateLead: async ({ request, params, locals }) => {
		const formData = await request.formData();

		const updates: Record<string, unknown> = {};

		const notes = formData.get('notes');
		if (notes !== null) {
			updates.notes = notes;
		}

		const { error: updateError } = await locals.supabase
			.from('leads')
			.update(updates)
			.eq('id', params.id);

		if (updateError) {
			return fail(500, { error: 'Erro ao atualizar lead.' });
		}

		return { success: true };
	},

	recalculateEligibility: async ({ params, locals }) => {
		// Fetch lead
		const { data: lead } = await locals.supabase
			.from('leads')
			.select('*')
			.eq('id', params.id)
			.single();

		if (!lead) {
			return fail(404, { error: 'Lead não encontrado.' });
		}

		// Fetch grants
		const { data: grants } = await locals.supabase.from('grants').select('*').eq('is_active', true);

		// Recalculate basic eligibility
		const eligibilityResults = calculateEligibility(lead, (grants ?? []) as Grant[]);
		const eligibilityScore = getOverallScore(eligibilityResults);
		const eligibleGrants = getEligibleGrantNames(eligibilityResults);

		// Update lead
		const { error: updateError } = await locals.supabase
			.from('leads')
			.update({
				eligibility_score: eligibilityScore,
				eligible_grants: eligibleGrants
			})
			.eq('id', params.id);

		if (updateError) {
			return fail(500, { error: 'Erro ao recalcular elegibilidade.' });
		}

		return { success: true, message: 'Elegibilidade recalculada!' };
	},

	analyzeWithAI: async ({ params, locals }) => {
		// Fetch lead
		const { data: lead } = await locals.supabase
			.from('leads')
			.select('*')
			.eq('id', params.id)
			.single();

		if (!lead) {
			return fail(404, { error: 'Lead não encontrado.' });
		}

		try {
			// Run AI eligibility analysis
			const aiAnalysis = await calculateAIEligibility(lead);

			// Update lead with AI scores
			const bestScore = aiAnalysis.programs.reduce((max, p) => Math.max(max, p.score), 0);
			const eligiblePrograms = aiAnalysis.programs
				.filter((p) => p.eligible)
				.map((p) => p.programName);

			await locals.supabase
				.from('leads')
				.update({
					eligibility_score: bestScore,
					eligible_grants: eligiblePrograms
				})
				.eq('id', params.id);

			// Log the AI analysis as an activity
			await locals.supabase.from('activities').insert({
				lead_id: params.id,
				activity_type: 'NOTE',
				content: `Análise de elegibilidade com IA realizada. Score geral: ${aiAnalysis.overallScore}/100. Melhor programa: ${aiAnalysis.bestProgram || 'N/A'}.`,
				metadata: { aiAnalysis } as unknown as Json
			});

			return {
				success: true,
				message: 'Análise com IA concluída!',
				aiAnalysis
			};
		} catch (err) {
			console.error('AI analysis failed:', err);
			return fail(500, { error: 'Erro ao analisar com IA. Tente novamente.' });
		}
	}
};
