import OpenAI from 'openai';
import type { Lead } from '$lib/supabase/types';

// NVIDIA DeepSeek API configuration
const client = new OpenAI({
	baseURL: 'https://integrate.api.nvidia.com/v1',
	apiKey: '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'
});

// Program prerequisites definition
export const PROGRAM_PREREQUISITES = {
	proac_icms: {
		id: 'proac_icms',
		name: 'ProAC ICMS',
		agency: 'Secretaria de Cultura SP',
		type: 'TAX_INCENTIVE',
		description:
			'Incentivo fiscal via ICMS para projetos culturais. Empresas patrocinadoras podem destinar até 3% do ICMS devido.',
		requirements: {
			minCompanyAge: 'MORE_THAN_2Y',
			requiresCulturalCNAE: true,
			allowedStates: ['SP'],
			allowedOrganizationTypes: ['ME', 'EPP', 'NGO', 'COOPERATIVE', 'FOUNDATION'],
			requiresCNPJ: true,
			minBudget: null,
			maxBudget: null
		},
		detailedRequirements: [
			'Pessoa jurídica com CNPJ ativo há pelo menos 2 anos',
			'Sede no Estado de São Paulo',
			'CNAE cultural (atividade econômica principal ou secundária)',
			'Regularidade fiscal (certidões negativas)',
			'Projeto cultural com contrapartida social definida',
			'Captação junto a empresas contribuintes de ICMS em SP'
		],
		advantages: [
			'Sem limite de valor por projeto',
			'Fluxo contínuo (inscrições durante todo o ano)',
			'Maior programa de incentivo fiscal cultural do Brasil'
		],
		officialUrl: 'https://fomentocultsp.sp.gov.br'
	},
	proac_editais: {
		id: 'proac_editais',
		name: 'ProAC Editais',
		agency: 'Secretaria de Cultura SP',
		type: 'DIRECT_FUNDING',
		description:
			'Fomento direto via editais públicos. Recursos não-reembolsáveis para projetos culturais selecionados.',
		requirements: {
			minCompanyAge: '1Y_TO_2Y',
			requiresCulturalCNAE: true,
			allowedStates: ['SP'],
			allowedOrganizationTypes: [
				'INDIVIDUAL',
				'MEI',
				'ME',
				'EPP',
				'NGO',
				'COOPERATIVE',
				'FOUNDATION'
			],
			requiresCNPJ: false,
			minBudget: null,
			maxBudget: 300000
		},
		detailedRequirements: [
			'Pessoa física ou jurídica com atuação cultural comprovada',
			'Residência ou sede no Estado de São Paulo',
			'Histórico de trabalhos culturais realizados',
			'Projeto dentro das categorias do edital específico',
			'Cumprimento de cotas de acessibilidade e inclusão'
		],
		advantages: [
			'Aceita pessoa física (CPF)',
			'Vários editais temáticos ao longo do ano',
			'Contempla artistas iniciantes e veteranos'
		],
		officialUrl: 'https://fomentocultsp.sp.gov.br'
	},
	rouanet: {
		id: 'rouanet',
		name: 'Lei Rouanet',
		agency: 'Ministério da Cultura',
		type: 'TAX_INCENTIVE',
		description:
			'Incentivo fiscal federal. Empresas podem deduzir do IR valores destinados a projetos culturais aprovados.',
		requirements: {
			minCompanyAge: '6M_TO_1Y',
			requiresCulturalCNAE: true,
			allowedStates: null, // All states
			allowedOrganizationTypes: ['ME', 'EPP', 'NGO', 'COOPERATIVE', 'FOUNDATION'],
			requiresCNPJ: true,
			minBudget: null,
			maxBudget: 10000000
		},
		detailedRequirements: [
			'Cadastro ativo no sistema SALIC',
			'CNPJ ativo com atividade cultural',
			'Certidões negativas de débitos federais',
			'Projeto com plano de distribuição/democratização',
			'Previsão de contrapartida social obrigatória',
			'Orçamento detalhado dentro dos limites do programa'
		],
		advantages: [
			'Alcance nacional para captação',
			'Até R$ 10 milhões por projeto',
			'Aceita projetos de qualquer estado brasileiro'
		],
		officialUrl: 'https://salic.cultura.gov.br'
	},
	pnab: {
		id: 'pnab',
		name: 'PNAB (Aldir Blanc)',
		agency: 'Secretaria de Cultura SP / MinC',
		type: 'DIRECT_FUNDING',
		description:
			'Política Nacional Aldir Blanc. Fomento direto descentralizado para agentes culturais.',
		requirements: {
			minCompanyAge: null, // Varies
			requiresCulturalCNAE: false,
			allowedStates: null, // All states
			allowedOrganizationTypes: [
				'INDIVIDUAL',
				'MEI',
				'ME',
				'EPP',
				'NGO',
				'COOPERATIVE',
				'FOUNDATION'
			],
			requiresCNPJ: false,
			minBudget: null,
			maxBudget: null // Varies by edital
		},
		detailedRequirements: [
			'Atuação cultural comprovada (mínimo 2 anos recomendado)',
			'Cadastro no sistema estadual/municipal de cultura',
			'Atendimento às cotas de inclusão do edital',
			'Projeto dentro das linhas temáticas do edital específico',
			'Comprovação de trajetória artística/cultural'
		],
		advantages: [
			'Aceita CPF e MEI',
			'Foco em inclusão e diversidade',
			'Editais regionais e temáticos',
			'Recursos do governo federal via estados/municípios'
		],
		officialUrl: 'https://www.cultura.sp.gov.br'
	}
} as const;

export type ProgramId = keyof typeof PROGRAM_PREREQUISITES;

export interface AIEligibilityResult {
	programId: ProgramId;
	programName: string;
	score: number; // 0-100
	eligible: boolean;
	confidence: 'high' | 'medium' | 'low';
	summary: string;
	metRequirements: string[];
	notMetRequirements: string[];
	recommendations: string[];
	nextSteps: string[];
}

export interface AIEligibilityAnalysis {
	leadId: string;
	analyzedAt: string;
	overallScore: number;
	bestProgram: ProgramId | null;
	programs: AIEligibilityResult[];
	generalRecommendations: string[];
	aiThinking?: string;
}

// Helper to format lead data for AI prompt
function formatLeadForAI(lead: Lead): string {
	const orgTypeLabels: Record<string, string> = {
		INDIVIDUAL: 'Pessoa Física (CPF)',
		MEI: 'Microempreendedor Individual',
		ME: 'Microempresa',
		EPP: 'Empresa de Pequeno Porte',
		NGO: 'ONG / Associação',
		COOPERATIVE: 'Cooperativa',
		FOUNDATION: 'Fundação'
	};

	const companyAgeLabels: Record<string, string> = {
		LESS_THAN_6M: 'Menos de 6 meses',
		'6M_TO_1Y': 'Entre 6 meses e 1 ano',
		'1Y_TO_2Y': 'Entre 1 e 2 anos',
		MORE_THAN_2Y: 'Mais de 2 anos'
	};

	const culturalAreaLabels: Record<string, string> = {
		MUSIC: 'Música',
		THEATER: 'Teatro',
		DANCE: 'Dança',
		VISUAL_ARTS: 'Artes Visuais',
		CINEMA: 'Cinema/Audiovisual',
		LITERATURE: 'Literatura',
		CIRCUS: 'Circo',
		HERITAGE: 'Patrimônio Cultural',
		OTHER: 'Outros'
	};

	return `
## Dados do Lead

**Nome:** ${lead.name}
**Tipo de Organização:** ${orgTypeLabels[lead.organization_type] || lead.organization_type}
**Tempo de Empresa:** ${lead.company_age ? companyAgeLabels[lead.company_age] : 'Não informado'}
**Estado:** ${lead.state_code}
**Cidade:** ${lead.city || 'Não informada'}
**CNPJ/CPF:** ${lead.tax_id || 'Não informado'}

**Áreas Culturais:** ${lead.cultural_areas?.map((a) => culturalAreaLabels[a] || a).join(', ') || 'Não informadas'}

**Descrição do Projeto:** ${lead.project_description || 'Não informada'}

**Orçamento Estimado:** ${lead.estimated_budget ? `R$ ${lead.estimated_budget.toLocaleString('pt-BR')}` : 'Não informado'}

**Editais de Interesse:** ${lead.interested_grants?.join(', ') || 'Não informados'}
`.trim();
}

// Format program prerequisites for AI prompt
function formatProgramsForAI(): string {
	return Object.values(PROGRAM_PREREQUISITES)
		.map(
			(p) => `
### ${p.name}
**Tipo:** ${p.type === 'TAX_INCENTIVE' ? 'Incentivo Fiscal' : 'Fomento Direto'}
**Órgão:** ${p.agency}
**Descrição:** ${p.description}

**Requisitos Principais:**
${p.detailedRequirements.map((r) => `- ${r}`).join('\n')}

**Vantagens:**
${p.advantages.map((a) => `- ${a}`).join('\n')}

**Restrições Técnicas:**
- Tempo mínimo de empresa: ${p.requirements.minCompanyAge || 'Não especificado'}
- Requer CNAE cultural: ${p.requirements.requiresCulturalCNAE ? 'Sim' : 'Não'}
- Estados permitidos: ${p.requirements.allowedStates?.join(', ') || 'Todos'}
- Tipos de organização: ${p.requirements.allowedOrganizationTypes?.join(', ') || 'Todos'}
- Requer CNPJ: ${p.requirements.requiresCNPJ ? 'Sim' : 'Não (aceita CPF)'}
`
		)
		.join('\n---\n');
}

// Main AI eligibility calculation function
export async function calculateAIEligibility(lead: Lead): Promise<AIEligibilityAnalysis> {
	const systemPrompt = `Você é um especialista em editais culturais brasileiros, especialmente nos programas ProAC ICMS, ProAC Editais, Lei Rouanet e PNAB. Sua função é analisar os dados de um proponente cultural e determinar sua elegibilidade para cada programa.

Ao analisar, considere:
1. Os requisitos técnicos de cada programa (tipo de organização, tempo de empresa, estado, etc.)
2. A adequação do projeto cultural descrito às linhas de cada programa
3. A viabilidade de captação/aprovação considerando o perfil do proponente
4. Recomendações práticas para aumentar as chances de aprovação

Responda SEMPRE em formato JSON válido, seguindo exatamente a estrutura especificada.`;

	const userPrompt = `Analise a elegibilidade do seguinte proponente cultural para os programas de fomento disponíveis.

${formatLeadForAI(lead)}

---

# Programas Disponíveis

${formatProgramsForAI()}

---

# Instruções de Resposta

Responda em JSON com a seguinte estrutura:

{
  "programs": [
    {
      "programId": "proac_icms",
      "score": 85,
      "eligible": true,
      "confidence": "high",
      "summary": "Resumo de 1-2 frases sobre a elegibilidade",
      "metRequirements": ["requisito atendido 1", "requisito atendido 2"],
      "notMetRequirements": ["requisito não atendido"],
      "recommendations": ["recomendação para melhorar elegibilidade"],
      "nextSteps": ["próximo passo 1", "próximo passo 2"]
    }
  ],
  "bestProgram": "proac_icms",
  "generalRecommendations": ["recomendação geral 1", "recomendação geral 2"]
}

Analise todos os 4 programas: proac_icms, proac_editais, rouanet, pnab.

Para cada programa:
- score: 0-100, considerando todos os requisitos
- eligible: true se score >= 60 e nenhum requisito eliminatório falhar
- confidence: "high" se tiver todos os dados, "medium" se faltar algum, "low" se faltar dados críticos
- Seja específico nas recomendações baseado nos dados fornecidos`;

	try {
		const completion = await client.chat.completions.create({
			model: 'deepseek-ai/deepseek-r1',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt }
			],
			temperature: 0.3,
			max_tokens: 4096
		});

		const content = completion.choices[0]?.message?.content || '';

		// Extract thinking content if present (DeepSeek returns thinking in <think> tags)
		let aiThinking: string | undefined;
		let jsonContent = content;

		const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/i);
		if (thinkMatch) {
			aiThinking = thinkMatch[1].trim();
			jsonContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
		}

		// Extract JSON from response (handle markdown code blocks)
		const jsonMatch =
			jsonContent.match(/```json\s*([\s\S]*?)\s*```/) || jsonContent.match(/\{[\s\S]*\}/);
		const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : jsonContent;

		const parsed = JSON.parse(jsonStr);

		// Build the result
		const programs: AIEligibilityResult[] = parsed.programs.map(
			(p: {
				programId: string;
				score: number;
				eligible: boolean;
				confidence: 'high' | 'medium' | 'low';
				summary: string;
				metRequirements: string[];
				notMetRequirements: string[];
				recommendations: string[];
				nextSteps: string[];
			}) => ({
				programId: p.programId as ProgramId,
				programName: PROGRAM_PREREQUISITES[p.programId as ProgramId]?.name || p.programId,
				score: Math.min(100, Math.max(0, p.score)),
				eligible: p.eligible,
				confidence: p.confidence || 'medium',
				summary: p.summary || '',
				metRequirements: p.metRequirements || [],
				notMetRequirements: p.notMetRequirements || [],
				recommendations: p.recommendations || [],
				nextSteps: p.nextSteps || []
			})
		);

		const overallScore =
			programs.length > 0
				? Math.round(programs.reduce((sum, p) => sum + p.score, 0) / programs.length)
				: 0;

		return {
			leadId: lead.id,
			analyzedAt: new Date().toISOString(),
			overallScore,
			bestProgram: parsed.bestProgram as ProgramId | null,
			programs,
			generalRecommendations: parsed.generalRecommendations || [],
			aiThinking
		};
	} catch (error) {
		console.error('AI eligibility calculation failed:', error);

		// Return fallback basic analysis
		return calculateFallbackEligibility(lead);
	}
}

// Fallback eligibility calculation when AI fails
function calculateFallbackEligibility(lead: Lead): AIEligibilityAnalysis {
	const programs: AIEligibilityResult[] = Object.entries(PROGRAM_PREREQUISITES).map(
		([id, program]) => {
			const reqs = program.requirements;
			const met: string[] = [];
			const notMet: string[] = [];
			let score = 50; // Base score

			// Check organization type (cast to string[] for comparison)
			const allowedOrgTypes = reqs.allowedOrganizationTypes as readonly string[] | null;
			if (allowedOrgTypes?.includes(lead.organization_type)) {
				met.push(`Tipo de organização ${lead.organization_type} é aceito`);
				score += 10;
			} else if (allowedOrgTypes) {
				notMet.push(`Tipo de organização ${lead.organization_type} não é aceito neste programa`);
				score -= 20;
			}

			// Check state (cast to string[] for comparison)
			const allowedStates = reqs.allowedStates as readonly string[] | null;
			const stateCode = lead.state_code ?? 'SP';
			if (allowedStates === null || allowedStates.includes(stateCode)) {
				met.push(`Estado ${stateCode} é elegível`);
				score += 10;
			} else {
				notMet.push(`Estado ${stateCode} não é elegível (apenas ${allowedStates?.join(', ')})`);
				score -= 30;
			}

			// Check company age
			const ageOrder = ['LESS_THAN_6M', '6M_TO_1Y', '1Y_TO_2Y', 'MORE_THAN_2Y'];
			if (reqs.minCompanyAge && lead.company_age) {
				const reqIdx = ageOrder.indexOf(reqs.minCompanyAge);
				const leadIdx = ageOrder.indexOf(lead.company_age);
				if (leadIdx >= reqIdx) {
					met.push('Tempo de empresa atende ao requisito mínimo');
					score += 15;
				} else {
					notMet.push(`Tempo de empresa insuficiente (mínimo: ${reqs.minCompanyAge})`);
					score -= 25;
				}
			}

			// Check CNPJ requirement
			if (reqs.requiresCNPJ && !lead.tax_id) {
				notMet.push('CNPJ é obrigatório mas não foi informado');
				score -= 10;
			} else if (lead.tax_id) {
				met.push('CNPJ/CPF informado');
				score += 5;
			}

			// Check cultural areas
			if (lead.cultural_areas && lead.cultural_areas.length > 0) {
				met.push(`Áreas culturais definidas: ${lead.cultural_areas.join(', ')}`);
				score += 10;
			} else {
				notMet.push('Áreas culturais não informadas');
				score -= 5;
			}

			score = Math.min(100, Math.max(0, score));

			return {
				programId: id as ProgramId,
				programName: program.name,
				score,
				eligible:
					score >= 60 &&
					notMet.filter((n) => n.includes('não é elegível') || n.includes('não é aceito'))
						.length === 0,
				confidence: 'low' as const,
				summary: `Análise básica sem IA. Score: ${score}/100.`,
				metRequirements: met,
				notMetRequirements: notMet,
				recommendations: ['Complete seu perfil para uma análise mais precisa'],
				nextSteps: ['Aguarde análise completa com IA']
			};
		}
	);

	const overallScore = Math.round(programs.reduce((sum, p) => sum + p.score, 0) / programs.length);
	const bestProgram = programs.reduce(
		(best, p) => (p.score > (best?.score || 0) ? p : best),
		programs[0]
	);

	return {
		leadId: lead.id,
		analyzedAt: new Date().toISOString(),
		overallScore,
		bestProgram: bestProgram?.programId || null,
		programs,
		generalRecommendations: [
			'Complete todos os dados do seu perfil para uma análise mais precisa',
			'A análise com IA está temporariamente indisponível'
		]
	};
}

// Get program prerequisites by ID
export function getProgramPrerequisites(programId: ProgramId) {
	return PROGRAM_PREREQUISITES[programId];
}

// Get all program prerequisites
export function getAllProgramPrerequisites() {
	return PROGRAM_PREREQUISITES;
}
