import OpenAI from 'openai';

// NVIDIA API configuration for document parsing
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = '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';

// Supported file types
const SUPPORTED_MIME_TYPES = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
	'image/jpeg',
	'image/png',
	'image/webp'
];

export interface ParsedDocument {
	success: boolean;
	content: string;
	error?: string;
	metadata?: {
		fileName: string;
		fileType: string;
		fileSize: number;
		parsedAt: string;
	};
}

export interface ProjectAnalysis {
	title?: string;
	summary: string;
	objectives?: string[];
	targetAudience?: string;
	culturalAreas?: string[];
	estimatedBudget?: number;
	timeline?: string;
	team?: string[];
	accessibility?: string;
	rawContent: string;
}

// Convert file to base64
async function fileToBase64(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();
	const bytes = new Uint8Array(arrayBuffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

// Parse document using NVIDIA Nemotron Parse
export async function parseDocument(file: File): Promise<ParsedDocument> {
	// Validate file type
	if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
		return {
			success: false,
			content: '',
			error: `Tipo de arquivo não suportado: ${file.type}. Use PDF, DOCX, ou imagens (JPG, PNG, WebP).`
		};
	}

	// Validate file size (max 10MB)
	const maxSize = 10 * 1024 * 1024;
	if (file.size > maxSize) {
		return {
			success: false,
			content: '',
			error: 'Arquivo muito grande. O tamanho máximo é 10MB.'
		};
	}

	try {
		const base64Content = await fileToBase64(file);
		const mimeType = file.type;

		// Build the content with the file as an image/document
		const mediaTag = `<img src="data:${mimeType};base64,${base64Content}" />`;

		const response = await fetch(NVIDIA_API_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${NVIDIA_API_KEY}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'nvidia/nemotron-parse',
				messages: [
					{
						role: 'user',
						content: mediaTag
					}
				],
				tools: [
					{
						type: 'function',
						function: {
							name: 'markdown_no_bbox'
						}
					}
				],
				tool_choice: {
					type: 'function',
					function: {
						name: 'markdown_no_bbox'
					}
				},
				max_tokens: 8192
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('NVIDIA API error:', response.status, errorText);
			return {
				success: false,
				content: '',
				error: `Erro ao processar documento: ${response.status}`
			};
		}

		const data = await response.json();

		// Extract the parsed content from the tool call response
		let parsedContent = '';

		if (data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
			const args = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
			parsedContent = args.markdown || args.text || args.content || '';
		} else if (data.choices?.[0]?.message?.content) {
			parsedContent = data.choices[0].message.content;
		}

		return {
			success: true,
			content: parsedContent,
			metadata: {
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
				parsedAt: new Date().toISOString()
			}
		};
	} catch (error) {
		console.error('Document parsing failed:', error);
		return {
			success: false,
			content: '',
			error: 'Erro ao processar documento. Tente novamente.'
		};
	}
}

// Analyze parsed document content to extract project information
export async function analyzeProjectDocument(content: string): Promise<ProjectAnalysis> {
	const client = new OpenAI({
		baseURL: 'https://integrate.api.nvidia.com/v1',
		apiKey: NVIDIA_API_KEY
	});

	const systemPrompt = `Você é um especialista em projetos culturais brasileiros. Analise o conteúdo do documento fornecido e extraia informações relevantes sobre o projeto cultural.

Responda SEMPRE em formato JSON válido com a seguinte estrutura:
{
  "title": "Título do projeto (se identificado)",
  "summary": "Resumo do projeto em 2-3 frases",
  "objectives": ["Objetivo 1", "Objetivo 2"],
  "targetAudience": "Público-alvo do projeto",
  "culturalAreas": ["MUSIC", "THEATER", etc - use os códigos em inglês],
  "estimatedBudget": 50000 (número, se mencionado),
  "timeline": "Cronograma resumido",
  "team": ["Nome ou função de integrantes"],
  "accessibility": "Medidas de acessibilidade previstas"
}

Códigos de áreas culturais válidos: MUSIC, THEATER, DANCE, VISUAL_ARTS, CINEMA, LITERATURE, CIRCUS, HERITAGE, OTHER

Se alguma informação não estiver disponível, omita o campo ou use null.`;

	try {
		const completion = await client.chat.completions.create({
			model: 'deepseek-ai/deepseek-r1',
			messages: [
				{ role: 'system', content: systemPrompt },
				{
					role: 'user',
					content: `Analise o seguinte conteúdo de documento de projeto cultural:\n\n${content.slice(0, 8000)}`
				}
			],
			temperature: 0.3,
			max_tokens: 2048
		});

		const responseContent = completion.choices[0]?.message?.content || '';

		// Remove thinking tags if present
		const jsonContent = responseContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

		// Extract JSON from response
		const jsonMatch =
			jsonContent.match(/```json\s*([\s\S]*?)\s*```/) || jsonContent.match(/\{[\s\S]*\}/);
		const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : jsonContent;

		const parsed = JSON.parse(jsonStr);

		return {
			title: parsed.title || undefined,
			summary:
				parsed.summary || 'Documento analisado, mas não foi possível extrair um resumo claro.',
			objectives: parsed.objectives || undefined,
			targetAudience: parsed.targetAudience || undefined,
			culturalAreas: parsed.culturalAreas || undefined,
			estimatedBudget: parsed.estimatedBudget || undefined,
			timeline: parsed.timeline || undefined,
			team: parsed.team || undefined,
			accessibility: parsed.accessibility || undefined,
			rawContent: content
		};
	} catch (error) {
		console.error('Project analysis failed:', error);
		return {
			summary: 'Documento recebido. Análise detalhada será feita manualmente.',
			rawContent: content
		};
	}
}

// Combined function: parse and analyze document
export async function parseAndAnalyzeDocument(
	file: File
): Promise<{ parsed: ParsedDocument; analysis?: ProjectAnalysis }> {
	const parsed = await parseDocument(file);

	if (!parsed.success || !parsed.content) {
		return { parsed };
	}

	const analysis = await analyzeProjectDocument(parsed.content);

	return { parsed, analysis };
}
