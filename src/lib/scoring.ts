/**
 * Eligibility Scoring System
 * Calculates how eligible a lead is for specific grants
 */

import type { Grant, Lead } from './supabase/types';

export interface EligibilityResult {
	grantId: string;
	grantName: string;
	score: number; // 0-100
	eligible: boolean;
	reasons: string[];
	requirements: { met: string[]; notMet: string[] };
}

export interface ScoringCriteria {
	minCompanyAge?: 'LESS_THAN_6M' | '6M_TO_1Y' | '1Y_TO_2Y' | 'MORE_THAN_2Y';
	requiresCulturalCnae?: boolean;
	requiresSalic?: boolean;
	state?: string;
	variesBySpecificEdital?: boolean;
}

const companyAgeOrder = ['LESS_THAN_6M', '6M_TO_1Y', '1Y_TO_2Y', 'MORE_THAN_2Y'];

function meetsCompanyAgeRequirement(
	leadAge: string | null | undefined,
	requiredAge: string
): boolean {
	if (!leadAge) return false;
	const leadIndex = companyAgeOrder.indexOf(leadAge);
	const requiredIndex = companyAgeOrder.indexOf(requiredAge);
	return leadIndex >= requiredIndex;
}

export function calculateEligibility(lead: Partial<Lead>, grants: Grant[]): EligibilityResult[] {
	const results: EligibilityResult[] = [];

	for (const grant of grants) {
		const requirements = grant.requirements as ScoringCriteria | null;
		let score = 0;
		const reasons: string[] = [];
		const met: string[] = [];
		const notMet: string[] = [];

		// Base score for expressing interest
		if (lead.interested_grants?.includes(grant.name.toLowerCase().replace(/\s+/g, '_'))) {
			score += 20;
			reasons.push('Lead expressou interesse neste edital');
		}

		// Check company age requirement
		if (requirements?.minCompanyAge) {
			if (meetsCompanyAgeRequirement(lead.company_age, requirements.minCompanyAge)) {
				score += 25;
				met.push(`Tempo de CNPJ atende ao mínimo (${requirements.minCompanyAge})`);
			} else {
				notMet.push(`Tempo de CNPJ insuficiente (requer ${requirements.minCompanyAge})`);
			}
		} else {
			score += 10; // No requirement = partial points
		}

		// Check state requirement
		if (requirements?.state) {
			if (lead.state_code === requirements.state) {
				score += 25;
				met.push(`Localização em ${requirements.state}`);
			} else {
				notMet.push(`Requer localização em ${requirements.state}`);
			}
		} else {
			score += 15; // National grants get more points
			met.push('Edital nacional (sem restrição de estado)');
		}

		// Check organization type
		if (lead.organization_type) {
			const isPJ = lead.organization_type !== 'INDIVIDUAL';

			// Most grants require PJ for larger amounts
			if (isPJ) {
				score += 15;
				met.push('Pessoa Jurídica (elegível para maiores valores)');
			} else {
				score += 5;
				met.push('Pessoa Física (valores limitados)');
			}
		}

		// Cultural areas match
		if (lead.cultural_areas && lead.cultural_areas.length > 0) {
			score += 15;
			met.push(`Áreas culturais definidas: ${lead.cultural_areas.length}`);
		} else {
			notMet.push('Nenhuma área cultural especificada');
		}

		// Special cases
		if (requirements?.requiresCulturalCnae) {
			// Can't verify CNAE without additional data
			reasons.push('Requer CNAE cultural (verificar manualmente)');
		}

		if (requirements?.requiresSalic) {
			reasons.push('Requer cadastro no SALIC');
		}

		if (requirements?.variesBySpecificEdital) {
			score = Math.min(score, 70); // Cap score for variable requirements
			reasons.push('Requisitos variam por edital específico');
		}

		// Normalize score
		score = Math.min(100, Math.max(0, score));

		results.push({
			grantId: grant.id,
			grantName: grant.name,
			score,
			eligible: score >= 50 && notMet.length === 0,
			reasons,
			requirements: { met, notMet }
		});
	}

	// Sort by score descending
	return results.sort((a, b) => b.score - a.score);
}

export function getOverallScore(eligibilityResults: EligibilityResult[]): number {
	if (eligibilityResults.length === 0) return 0;

	// Weight towards eligible grants
	const eligibleGrants = eligibilityResults.filter((r) => r.eligible);

	if (eligibleGrants.length === 0) {
		// If no eligible, return average of all scores
		return Math.round(
			eligibilityResults.reduce((sum, r) => sum + r.score, 0) / eligibilityResults.length
		);
	}

	// Return average of eligible grant scores
	return Math.round(eligibleGrants.reduce((sum, r) => sum + r.score, 0) / eligibleGrants.length);
}

export function getEligibleGrantNames(eligibilityResults: EligibilityResult[]): string[] {
	return eligibilityResults.filter((r) => r.eligible).map((r) => r.grantName);
}
