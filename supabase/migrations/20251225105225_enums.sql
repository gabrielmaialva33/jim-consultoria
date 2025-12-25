-- ============================================
-- ENUMS (Type Safety)
-- ============================================

CREATE TYPE organization_type AS ENUM (
  'INDIVIDUAL',
  'MEI',
  'ME',
  'EPP',
  'NGO',
  'COOPERATIVE',
  'FOUNDATION'
);

CREATE TYPE company_age AS ENUM (
  'LESS_THAN_6M',
  '6M_TO_1Y',
  '1Y_TO_2Y',
  'MORE_THAN_2Y'
);

CREATE TYPE lead_status AS ENUM (
  'NEW',
  'QUALIFICATION',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST'
);

CREATE TYPE cultural_area AS ENUM (
  'MUSIC',
  'THEATER',
  'DANCE',
  'VISUAL_ARTS',
  'CINEMA',
  'LITERATURE',
  'CIRCUS',
  'HERITAGE',
  'OTHER'
);

CREATE TYPE grant_type AS ENUM (
  'TAX_INCENTIVE',
  'DIRECT_FUNDING',
  'SPONSORSHIP'
);

CREATE TYPE task_status AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE task_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

CREATE TYPE activity_type AS ENUM (
  'NOTE',
  'EMAIL',
  'CALL',
  'MEETING',
  'STATUS_CHANGE',
  'TASK_CREATED',
  'DOCUMENT_UPLOADED'
);
