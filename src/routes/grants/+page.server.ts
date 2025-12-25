import type { PageServerLoad } from './$types'

const FOMENTO_API_BASE = 'https://fomentocultsp.sp.gov.br/api'
const SALIC_API_BASE = 'https://api.salic.cultura.gov.br/api/v1'

// Available programs - SP state and Federal
const PROGRAMS = [
	{
		id: 'Proac ICMS',
		label: 'ProAC ICMS',
		description: 'Incentivo fiscal SP',
		source: 'fomento'
	},
	{
		id: 'Proac Editais',
		label: 'ProAC Editais',
		description: 'Fomento direto SP',
		source: 'fomento'
	},
	{ id: 'PNAB', label: 'PNAB', description: 'Aldir Blanc SP', source: 'fomento' },
	{
		id: 'Lei Rouanet',
		label: 'Lei Rouanet',
		description: 'Federal',
		source: 'salic'
	}
] as const

type ProgramId = (typeof PROGRAMS)[number]['id']
type ProgramSource = (typeof PROGRAMS)[number]['source']

// Unified project interface for display
interface UnifiedProject {
	id: string
	source: ProgramSource
	name: string
	number: string
	proponentName: string
	proponentCity: string
	state: string
	projectValue: number
	year: number
	status: string
	categories: string[]
	submittedDate?: string
	personType?: string
	program: string
	externalUrl?: string
}

// FomentoCultSP types
interface FomentoProject {
	submission: {
		_id: string
		name: string
		number: string
		categories: string[]
		submittedDate: string
		expectedStart: string
		expectedEnd: string
	}
	notice: {
		_id: string
		title: string
		number: string
		program: string
		year: number
		moduleName?: string
	}
	proponentName: string
	proponentCity: string
	projectValue: number
	personType: string
	projectLocations?: Array<{
		city: string
		venue?: string
		address?: string
	}>
}

interface FomentoApiResponse {
	STATUS: string
	MESSAGE: string
	DATA: {
		list: FomentoProject[]
		count: number
	}
}

// SALIC API types
interface SalicProject {
	PRONAC: string
	nome: string
	cgccpf: string
	situacao: string
	segmento: string
	UF: string
	municipio: string
	proponente: string
	valor_solicitado: number
	valor_aprovado: number
	data_inicio: string
	data_termino: string
	objetivos?: string
	acessibilidade?: string
	_links?: {
		self?: { href: string }
	}
}

interface SalicApiResponse {
	_embedded?: {
		projetos: SalicProject[]
	}
	count: number
	total: number
}

// Normalize FomentoCultSP project to unified format
function normalizeFomentoProject(project: FomentoProject): UnifiedProject {
	return {
		id: project.submission._id,
		source: 'fomento',
		name: project.submission.name,
		number: project.submission.number,
		proponentName: project.proponentName,
		proponentCity: project.proponentCity,
		state: 'SP',
		projectValue: project.projectValue,
		year: project.notice.year,
		status: 'Aprovado',
		categories: project.submission.categories || [],
		submittedDate: project.submission.submittedDate,
		personType: project.personType,
		program: project.notice.program
	}
}

// Normalize SALIC project to unified format
function normalizeSalicProject(project: SalicProject): UnifiedProject {
	// Extract year from PRONAC (format: YYNNNNN or from data_inicio)
	let year = new Date().getFullYear()
	if (project.data_inicio) {
		year = new Date(project.data_inicio).getFullYear()
	} else if (project.PRONAC && project.PRONAC.length >= 2) {
		const yearPrefix = parseInt(project.PRONAC.slice(0, 2), 10)
		year = yearPrefix > 50 ? 1900 + yearPrefix : 2000 + yearPrefix
	}

	return {
		id: project.PRONAC,
		source: 'salic',
		name: project.nome,
		number: project.PRONAC,
		proponentName: project.proponente,
		proponentCity: project.municipio,
		state: project.UF,
		projectValue: project.valor_aprovado || project.valor_solicitado,
		year,
		status: project.situacao,
		categories: project.segmento ? [project.segmento] : [],
		program: 'Lei Rouanet',
		externalUrl: `https://salic.cultura.gov.br/cidadao/consultar?pronac=${project.PRONAC}`
	}
}

async function fetchFomentoProjects(
	program: string,
	page: number,
	perPage: number,
	search?: string
): Promise<{ projects: UnifiedProject[]; total: number }> {
	try {
		const params = new URLSearchParams({
			page: page.toString(),
			regsPerPage: perPage.toString(),
			noticeProgram: program
		})

		if (search) {
			params.append('search', search)
		}

		const response = await fetch(`${FOMENTO_API_BASE}/publicConsultation?${params}`, {
			headers: {
				Accept: 'application/json'
			}
		})

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`)
		}

		const data: FomentoApiResponse = await response.json()

		if (data.STATUS !== 'SUCCESS') {
			throw new Error(data.MESSAGE || 'API request failed')
		}

		// Sort by year descending (most recent first)
		const sortedProjects = (data.DATA.list || []).sort((a, b) => {
			return b.notice.year - a.notice.year
		})

		return {
			projects: sortedProjects.map(normalizeFomentoProject),
			total: data.DATA.count || 0
		}
	} catch (error) {
		console.error('Failed to fetch projects from FomentoCultSP:', error)
		return { projects: [], total: 0 }
	}
}

async function fetchSalicProjects(
	page: number,
	perPage: number,
	search?: string
): Promise<{ projects: UnifiedProject[]; total: number }> {
	try {
		const offset = (page - 1) * perPage
		const params = new URLSearchParams({
			limit: perPage.toString(),
			offset: offset.toString(),
			UF: 'SP' // Focus on São Paulo projects
		})

		if (search) {
			params.append('nome', search)
		}

		const response = await fetch(`${SALIC_API_BASE}/projetos?${params}`, {
			headers: {
				Accept: 'application/hal+json'
			}
		})

		if (!response.ok) {
			throw new Error(`SALIC API error: ${response.status}`)
		}

		const data: SalicApiResponse = await response.json()

		const projects = data._embedded?.projetos || []

		// Sort by year descending (most recent first)
		const sortedProjects = projects
			.map(normalizeSalicProject)
			.sort((a, b) => b.year - a.year)

		return {
			projects: sortedProjects,
			total: data.total || 0
		}
	} catch (error) {
		console.error('Failed to fetch projects from SALIC:', error)
		return { projects: [], total: 0 }
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const programId = (url.searchParams.get('programa') || 'Proac ICMS') as ProgramId
	const page = Math.max(1, parseInt(url.searchParams.get('pagina') || '1', 10))
	const search = url.searchParams.get('busca') || ''
	const perPage = 12

	// Find the selected program
	const selectedProgram = PROGRAMS.find((p) => p.id === programId) || PROGRAMS[0]

	let projects: UnifiedProject[] = []
	let total = 0

	// Fetch from appropriate source based on program
	if (selectedProgram.source === 'salic') {
		const result = await fetchSalicProjects(page, perPage, search)
		projects = result.projects
		total = result.total
	} else {
		const result = await fetchFomentoProjects(programId, page, perPage, search)
		projects = result.projects
		total = result.total
	}

	const totalPages = Math.ceil(total / perPage)

	return {
		projects,
		total,
		page,
		perPage,
		totalPages,
		program: programId,
		search,
		programs: PROGRAMS,
		source: selectedProgram.source
	}
}
