import { z } from 'zod/v4';

// Organization type enum
export const organizationTypeSchema = z.enum([
	'INDIVIDUAL',
	'MEI',
	'ME',
	'EPP',
	'NGO',
	'COOPERATIVE',
	'FOUNDATION'
]);

// Company age enum
export const companyAgeSchema = z.enum(['LESS_THAN_6M', '6M_TO_1Y', '1Y_TO_2Y', 'MORE_THAN_2Y']);

// Cultural areas enum
export const culturalAreaSchema = z.enum([
	'MUSIC',
	'THEATER',
	'DANCE',
	'VISUAL_ARTS',
	'CINEMA',
	'LITERATURE',
	'CIRCUS',
	'HERITAGE',
	'OTHER'
]);

// Grant interest enum
export const grantInterestSchema = z.enum(['proac_icms', 'rouanet', 'pnab']);

// Lead capture form schema (multi-step)
export const leadFormSchema = z.object({
	// Step 1: Basic Info
	name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
	email: z.email('E-mail inválido'),
	phone: z
		.string()
		.regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato (11) 99999-9999')
		.optional()
		.or(z.literal('')),

	// Step 2: Organization
	organization_type: organizationTypeSchema,
	company_age: companyAgeSchema.optional(),
	tax_id: z
		.string()
		.regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido. Use o formato 00.000.000/0000-00')
		.optional()
		.or(z.literal('')),
	state_code: z.string().length(2, 'Selecione um estado').optional().or(z.literal('')),
	city: z.string().optional().or(z.literal('')),

	// Step 3: Cultural Profile
	cultural_areas: z.array(culturalAreaSchema).min(1, 'Selecione pelo menos uma área cultural'),

	// Step 4: Grant Interest
	interested_grants: z.array(grantInterestSchema).min(1, 'Selecione pelo menos um edital'),

	// Step 5: Project
	project_description: z
		.string()
		.max(1000, 'Descrição deve ter no máximo 1000 caracteres')
		.optional(),
	estimated_budget: z.coerce.number().min(0, 'Valor deve ser positivo').optional()
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Labels for UI (Portuguese)
export const organizationTypeLabels: Record<string, string> = {
	INDIVIDUAL: 'Pessoa Física (Artista/Produtor)',
	MEI: 'MEI - Microempreendedor Individual',
	ME: 'ME - Microempresa',
	EPP: 'EPP - Empresa de Pequeno Porte',
	NGO: 'ONG / Associação',
	COOPERATIVE: 'Cooperativa',
	FOUNDATION: 'Fundação'
};

export const companyAgeLabels: Record<string, string> = {
	LESS_THAN_6M: 'Menos de 6 meses',
	'6M_TO_1Y': '6 meses a 1 ano',
	'1Y_TO_2Y': '1 a 2 anos',
	MORE_THAN_2Y: 'Mais de 2 anos'
};

export const culturalAreaLabels: Record<string, string> = {
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

export const grantInterestLabels: Record<string, string> = {
	proac_icms: 'ProAC ICMS (SP)',
	rouanet: 'Lei Rouanet (Federal)',
	pnab: 'PNAB - Política Nacional Aldir Blanc'
};

export const leadStatusLabels: Record<string, string> = {
	NEW: 'Novo',
	QUALIFICATION: 'Em Qualificação',
	PROPOSAL: 'Proposta Enviada',
	NEGOTIATION: 'Negociação',
	WON: 'Fechado',
	LOST: 'Perdido'
};
