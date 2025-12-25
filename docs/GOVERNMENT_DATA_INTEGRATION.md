# Government Cultural Grants Data Integration Plan

## Overview

This document outlines the available Brazilian government APIs and data sources for cultural grants, and the integration strategy for JIM Consultoria.

---

## 1. FomentoCultSP API (SP State) ✅ INTEGRATED

**Status:** Already integrated in `/grants` page

**Base URL:** `https://fomentocultsp.sp.gov.br/api`

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/publicConsultation` | GET | List approved projects |
| `/noticeCategories/{id}` | GET | Get notice categories |

### Query Parameters for `/publicConsultation`

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (1-based) |
| `regsPerPage` | number | Results per page |
| `noticeProgram` | string | Filter by program |
| `search` | string | Search term |

### Available Programs

- `Proac ICMS` - Tax incentive program
- `Proac Editais` - Direct funding via public calls
- `PNAB` - Política Nacional Aldir Blanc

### Response Structure

```typescript
interface FomentoApiResponse {
  STATUS: string;
  MESSAGE: string;
  DATA: {
    list: FomentoProject[];
    count: number;
  };
}

interface FomentoProject {
  submission: {
    _id: string;
    name: string;
    number: string;
    categories: string[];
    submittedDate: string;
    expectedStart: string;
    expectedEnd: string;
  };
  notice: {
    _id: string;
    title: string;
    number: string;
    program: string;
    year: number;
    moduleName?: string;
  };
  proponentName: string;
  proponentCity: string;
  projectValue: number;
  personType: string;
  projectLocations?: Array<{
    city: string;
    venue?: string;
    address?: string;
  }>;
}
```

---

## 2. SALIC API - Lei Rouanet (Federal) 🔄 TO INTEGRATE

**Status:** Discovered, ready to integrate

**Base URL:** `https://api.salic.cultura.gov.br`

**Documentation:** `https://api.salic.cultura.gov.br/docs`

**Authentication:** None required (public API)

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/projetos` | GET | List cultural projects |
| `/api/v1/projetos/{PRONAC}` | GET | Get project by PRONAC number |
| `/api/v1/projetos/areas` | GET | List project areas (8 categories) |
| `/api/v1/projetos/segmentos` | GET | List segments (detailed categories) |
| `/api/v1/proponentes` | GET | List proposers |
| `/api/v1/proponentes/{id}` | GET | Get proposer details |
| `/api/v1/incentivadores` | GET | List sponsors |
| `/api/v1/incentivadores/{id}/doacoes` | GET | List sponsor donations |
| `/api/v1/propostas` | GET | List proposals |
| `/api/v1/fornecedores` | GET | List suppliers |

### Query Parameters for `/api/v1/projetos`

| Parameter | Type | Description |
|-----------|------|-------------|
| `PRONAC` | string | Project number |
| `proponente` | string | Proposer name |
| `nome` | string | Project name |
| `area` | string | Cultural area (1-9) |
| `segmento` | string | Segment code |
| `UF` | string | State (e.g., "SP") |
| `ano_projeto` | number | Project year |
| `data_inicio` | date | Start date |
| `data_termino` | date | End date |
| `sort` | string | Sort field |
| `limit` | number | Results per page (1-100) |
| `offset` | number | Pagination offset |
| `format` | string | Response format (json, xml, csv) |

### Response Formats

- `application/hal+json` (default)
- `application/xml`
- `text/csv`

### Cultural Areas

| Code | Name |
|------|------|
| 1 | Artes Cênicas |
| 2 | Audiovisual |
| 3 | Música |
| 4 | Artes Visuais |
| 5 | Patrimônio Cultural |
| 6 | Humanidades |
| 7 | Artes Integradas |
| 9 | Museus e Memória |

### Project Response Structure

```typescript
interface SalicProject {
  PRONAC: string;
  nome: string;
  cgccpf: string;
  situacao: string;
  segmento: string;
  UF: string;
  municipio: string;
  proponente: string;
  valor_solicitado: number;
  valor_aprovado: number;
  data_inicio: string;
  data_termino: string;
  objetivos: string;
  acessibilidade: string;
  etapa: string;
  ficha_tecnica: string;
  local_realizacao: Array<{
    ibge: string;
    municipio: string;
    uf: string;
  }>;
}
```

---

## 3. Portal de Dados da Cultura (dados.cultura.gov.br)

**Status:** Discovered, CKAN-based portal with static datasets

**Base URL:** `https://dados.cultura.gov.br`

**API Type:** CKAN 2.4 API

### Available Datasets

#### 3.1 PNAB - Política Nacional Aldir Blanc

**Dataset URL:** `/dataset/implementacao-e-execucao-da-politica-nacional-aldir-blanc-de-fomento-a-cultura-pnab`

| Resource | Format | Description |
|----------|--------|-------------|
| Adesão à PNAB | XLSX | List of entities that joined the policy |
| PAAR - Ciclo 1 | XLSX | Action plans filled by federated entities |
| PAR - Ciclo 2 | ZIP | Cycle 2 action plans (multiple files) |
| Execução Financeira | XLSX | Financial execution data |
| Extratos Bancários | XLSX | Bank statement information |

**Note:** These are static files updated monthly, not a real-time API.

#### 3.2 Lei Paulo Gustavo (LPG)

**Dataset URL:** `/dataset/implementacao-e-execucao-da-lei-paulo-gustavo-lpg`

| Resource | Format | Description |
|----------|--------|-------------|
| Implementation data | CSV | Emergency actions for cultural sector |

#### 3.3 Pontos de Cultura - Rede Cultura Viva

**Dataset URL:** `/dataset/pontos-de-cultura`

| Resource | Format | Description |
|----------|--------|-------------|
| Cultura Viva network | JSON, CSV | Cultural organizations and initiatives |

### CKAN API Usage

```bash
# List all datasets
GET /api/3/action/package_list

# Get dataset details
GET /api/3/action/package_show?id={dataset_name}

# Search datasets
GET /api/3/action/package_search?q={query}

# Get resource URL
GET /api/3/action/resource_show?id={resource_id}
```

---

## 4. cultura.sp.gov.br (SP Portal)

**Status:** SSR website, no public API

**URL:** `https://cultura.sp.gov.br`

**Notes:**
- Server-side rendered content
- Would require web scraping for data extraction
- Contains information about open calls and programs
- Not recommended for real-time integration

---

## Integration Strategy

### Phase 1: Current State ✅
- FomentoCultSP API integrated in `/grants` page
- Displays ProAC ICMS, ProAC Editais, and PNAB approved projects from SP

### Phase 2: Add Lei Rouanet Federal Data 🎯
1. Create service for SALIC API integration
2. Add "Lei Rouanet" tab/filter to `/grants` page
3. Filter by UF="SP" for São Paulo focus
4. Display federal projects alongside state projects

### Phase 3: Enrich with Additional Data
1. Cross-reference proposers between state and federal
2. Add Pontos de Cultura data for cultural organizations
3. Consider PNAB static data for compliance tracking

### Phase 4: Future Considerations
- Monitor for new API releases
- Consider scraping cultura.sp.gov.br for open calls
- Build notification system for new funding opportunities

---

## Implementation Notes

### Unified Data Model

```typescript
interface UnifiedProject {
  id: string;
  source: 'fomento_sp' | 'salic_federal' | 'cultura_viva';
  program: string;
  name: string;
  proponent: string;
  city: string;
  state: string;
  value: number;
  year: number;
  status: string;
  startDate?: string;
  endDate?: string;
  categories: string[];
  externalUrl?: string;
}
```

### Error Handling

- Implement graceful fallbacks when APIs are unavailable
- Cache responses to reduce API load
- Show partial data when one source fails

### Rate Limiting

- SALIC API: No documented limits, but use reasonable delays
- FomentoCultSP: No documented limits
- CKAN: Standard rate limits apply

---

## API Testing Commands

```bash
# FomentoCultSP - List ProAC ICMS projects
curl "https://fomentocultsp.sp.gov.br/api/publicConsultation?page=1&regsPerPage=10&noticeProgram=Proac%20ICMS"

# SALIC - List SP projects from 2024
curl "https://api.salic.cultura.gov.br/api/v1/projetos?UF=SP&limit=10"

# SALIC - Get project areas
curl "https://api.salic.cultura.gov.br/api/v1/projetos/areas"

# CKAN - List PNAB dataset
curl "https://dados.cultura.gov.br/api/3/action/package_show?id=implementacao-e-execucao-da-politica-nacional-aldir-blanc-de-fomento-a-cultura-pnab"
```

---

## References

- [SALIC API Documentation](https://api.salic.cultura.gov.br/docs)
- [SALIC OpenAPI Spec](https://api.salic.cultura.gov.br/docs.openapi)
- [Portal de Dados da Cultura](https://dados.cultura.gov.br)
- [FomentoCultSP Portal](https://fomentocultsp.sp.gov.br)
- [CKAN API Documentation](http://docs.ckan.org/en/ckan-2.4.0/api/)
