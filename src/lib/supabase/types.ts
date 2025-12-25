export type OrganizationType =
	| 'INDIVIDUAL'
	| 'MEI'
	| 'ME'
	| 'EPP'
	| 'NGO'
	| 'COOPERATIVE'
	| 'FOUNDATION';

export type CompanyAge = 'LESS_THAN_6M' | '6M_TO_1Y' | '1Y_TO_2Y' | 'MORE_THAN_2Y';

export type LeadStatus = 'NEW' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export type CulturalArea =
	| 'MUSIC'
	| 'THEATER'
	| 'DANCE'
	| 'VISUAL_ARTS'
	| 'CINEMA'
	| 'LITERATURE'
	| 'CIRCUS'
	| 'HERITAGE'
	| 'OTHER';

export type GrantType = 'TAX_INCENTIVE' | 'DIRECT_FUNDING' | 'SPONSORSHIP';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ActivityType =
	| 'NOTE'
	| 'EMAIL'
	| 'CALL'
	| 'MEETING'
	| 'STATUS_CHANGE'
	| 'TASK_CREATED'
	| 'DOCUMENT_UPLOADED';

export interface Lead {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	email: string;
	phone: string | null;
	organization_type: OrganizationType;
	company_age: CompanyAge | null;
	tax_id: string | null;
	state_code: string;
	city: string | null;
	cultural_areas: CulturalArea[];
	project_description: string | null;
	estimated_budget: number | null;
	status: LeadStatus;
	interested_grants: string[];
	eligible_grants: string[];
	eligibility_score: number;
	assigned_to: string | null;
	notes: string | null;
	source: string | null;
}

export interface Grant {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	agency: string;
	grant_type: GrantType;
	opens_at: string | null;
	closes_at: string | null;
	total_budget: number | null;
	max_per_project: number | null;
	requirements: Record<string, unknown>;
	required_documents: string[];
	official_url: string | null;
	is_active: boolean;
}

export interface Task {
	id: string;
	created_at: string;
	updated_at: string;
	lead_id: string;
	grant_id: string | null;
	title: string;
	description: string | null;
	due_date: string | null;
	status: TaskStatus;
	priority: TaskPriority;
	assigned_to: string | null;
	completed_at: string | null;
}

export interface Activity {
	id: string;
	created_at: string;
	lead_id: string;
	activity_type: ActivityType;
	content: string | null;
	metadata: Record<string, unknown>;
	created_by: string | null;
}

export interface Database {
	public: {
		Tables: {
			leads: {
				Row: Lead;
				Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>;
			};
			grants: {
				Row: Grant;
				Insert: Omit<Grant, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<Grant, 'id' | 'created_at' | 'updated_at'>>;
			};
			tasks: {
				Row: Task;
				Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;
			};
			activities: {
				Row: Activity;
				Insert: Omit<Activity, 'id' | 'created_at'>;
				Update: Partial<Omit<Activity, 'id' | 'created_at'>>;
			};
		};
		Enums: {
			organization_type: OrganizationType;
			company_age: CompanyAge;
			lead_status: LeadStatus;
			cultural_area: CulturalArea;
			grant_type: GrantType;
			task_status: TaskStatus;
			task_priority: TaskPriority;
			activity_type: ActivityType;
		};
	};
}
