-- ============================================
-- SEED DATA (Initial Grants)
-- ============================================

INSERT INTO grants (name, agency, grant_type, opens_at, closes_at, total_budget, max_per_project, requirements, official_url, is_active)
VALUES
  (
    'ProAC ICMS 2026',
    'Secretaria de Cultura e Economia Criativa SP',
    'TAX_INCENTIVE',
    '2026-02-09',
    NULL,
    100000000,
    NULL,
    '{"min_company_age": "MORE_THAN_2Y", "requires_cultural_cnae": true, "state": "SP"}',
    'https://fomentocultsp.sp.gov.br',
    true
  ),
  (
    'Lei Rouanet 2026',
    'Ministério da Cultura',
    'TAX_INCENTIVE',
    '2026-02-01',
    '2026-10-31',
    NULL,
    10000000,
    '{"requires_cultural_cnae": true, "requires_salic": true}',
    'https://salic.cultura.gov.br',
    true
  ),
  (
    'PNAB SP 2026',
    'Secretaria de Cultura e Economia Criativa SP',
    'DIRECT_FUNDING',
    NULL,
    '2027-01-12',
    NULL,
    NULL,
    '{"varies_by_specific_edital": true}',
    'https://www.cultura.sp.gov.br/sec_cultura/Fomento/Fomento_CultSP_Editais_e_PNAB',
    true
  );
