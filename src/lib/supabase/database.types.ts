export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '14.1';
	};
	public: {
		Tables: {
			activities: {
				Row: {
					activity_type: Database['public']['Enums']['activity_type'];
					content: string | null;
					created_at: string;
					created_by: string | null;
					id: string;
					lead_id: string;
					metadata: Json | null;
				};
				Insert: {
					activity_type: Database['public']['Enums']['activity_type'];
					content?: string | null;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					lead_id: string;
					metadata?: Json | null;
				};
				Update: {
					activity_type?: Database['public']['Enums']['activity_type'];
					content?: string | null;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					lead_id?: string;
					metadata?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: 'activities_lead_id_fkey';
						columns: ['lead_id'];
						isOneToOne: false;
						referencedRelation: 'leads';
						referencedColumns: ['id'];
					}
				];
			};
			grants: {
				Row: {
					agency: string;
					closes_at: string | null;
					created_at: string;
					grant_type: Database['public']['Enums']['grant_type'];
					id: string;
					is_active: boolean;
					max_per_project: number | null;
					name: string;
					official_url: string | null;
					opens_at: string | null;
					required_documents: string[] | null;
					requirements: Json | null;
					total_budget: number | null;
					updated_at: string;
				};
				Insert: {
					agency: string;
					closes_at?: string | null;
					created_at?: string;
					grant_type: Database['public']['Enums']['grant_type'];
					id?: string;
					is_active?: boolean;
					max_per_project?: number | null;
					name: string;
					official_url?: string | null;
					opens_at?: string | null;
					required_documents?: string[] | null;
					requirements?: Json | null;
					total_budget?: number | null;
					updated_at?: string;
				};
				Update: {
					agency?: string;
					closes_at?: string | null;
					created_at?: string;
					grant_type?: Database['public']['Enums']['grant_type'];
					id?: string;
					is_active?: boolean;
					max_per_project?: number | null;
					name?: string;
					official_url?: string | null;
					opens_at?: string | null;
					required_documents?: string[] | null;
					requirements?: Json | null;
					total_budget?: number | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			leads: {
				Row: {
					assigned_to: string | null;
					city: string | null;
					company_age: Database['public']['Enums']['company_age'] | null;
					created_at: string;
					cultural_areas: Database['public']['Enums']['cultural_area'][] | null;
					document_analysis: Json | null;
					document_content: string | null;
					document_metadata: Json | null;
					eligibility_score: number | null;
					eligible_grants: string[] | null;
					email: string;
					estimated_budget: number | null;
					id: string;
					interested_grants: string[] | null;
					name: string;
					notes: string | null;
					organization_type: Database['public']['Enums']['organization_type'];
					phone: string | null;
					project_description: string | null;
					source: string | null;
					state_code: string | null;
					status: Database['public']['Enums']['lead_status'];
					tax_id: string | null;
					updated_at: string;
				};
				Insert: {
					assigned_to?: string | null;
					city?: string | null;
					company_age?: Database['public']['Enums']['company_age'] | null;
					created_at?: string;
					cultural_areas?: Database['public']['Enums']['cultural_area'][] | null;
					document_analysis?: Json | null;
					document_content?: string | null;
					document_metadata?: Json | null;
					eligibility_score?: number | null;
					eligible_grants?: string[] | null;
					email: string;
					estimated_budget?: number | null;
					id?: string;
					interested_grants?: string[] | null;
					name: string;
					notes?: string | null;
					organization_type: Database['public']['Enums']['organization_type'];
					phone?: string | null;
					project_description?: string | null;
					source?: string | null;
					state_code?: string | null;
					status?: Database['public']['Enums']['lead_status'];
					tax_id?: string | null;
					updated_at?: string;
				};
				Update: {
					assigned_to?: string | null;
					city?: string | null;
					company_age?: Database['public']['Enums']['company_age'] | null;
					created_at?: string;
					cultural_areas?: Database['public']['Enums']['cultural_area'][] | null;
					document_analysis?: Json | null;
					document_content?: string | null;
					document_metadata?: Json | null;
					eligibility_score?: number | null;
					eligible_grants?: string[] | null;
					email?: string;
					estimated_budget?: number | null;
					id?: string;
					interested_grants?: string[] | null;
					name?: string;
					notes?: string | null;
					organization_type?: Database['public']['Enums']['organization_type'];
					phone?: string | null;
					project_description?: string | null;
					source?: string | null;
					state_code?: string | null;
					status?: Database['public']['Enums']['lead_status'];
					tax_id?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			tasks: {
				Row: {
					assigned_to: string | null;
					completed_at: string | null;
					created_at: string;
					description: string | null;
					due_date: string | null;
					grant_id: string | null;
					id: string;
					lead_id: string;
					priority: Database['public']['Enums']['task_priority'];
					status: Database['public']['Enums']['task_status'];
					title: string;
					updated_at: string;
				};
				Insert: {
					assigned_to?: string | null;
					completed_at?: string | null;
					created_at?: string;
					description?: string | null;
					due_date?: string | null;
					grant_id?: string | null;
					id?: string;
					lead_id: string;
					priority?: Database['public']['Enums']['task_priority'];
					status?: Database['public']['Enums']['task_status'];
					title: string;
					updated_at?: string;
				};
				Update: {
					assigned_to?: string | null;
					completed_at?: string | null;
					created_at?: string;
					description?: string | null;
					due_date?: string | null;
					grant_id?: string | null;
					id?: string;
					lead_id?: string;
					priority?: Database['public']['Enums']['task_priority'];
					status?: Database['public']['Enums']['task_status'];
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'tasks_grant_id_fkey';
						columns: ['grant_id'];
						isOneToOne: false;
						referencedRelation: 'grants';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'tasks_lead_id_fkey';
						columns: ['lead_id'];
						isOneToOne: false;
						referencedRelation: 'leads';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			activity_type:
				| 'NOTE'
				| 'EMAIL'
				| 'CALL'
				| 'MEETING'
				| 'STATUS_CHANGE'
				| 'TASK_CREATED'
				| 'DOCUMENT_UPLOADED';
			company_age: 'LESS_THAN_6M' | '6M_TO_1Y' | '1Y_TO_2Y' | 'MORE_THAN_2Y';
			cultural_area:
				| 'MUSIC'
				| 'THEATER'
				| 'DANCE'
				| 'VISUAL_ARTS'
				| 'CINEMA'
				| 'LITERATURE'
				| 'CIRCUS'
				| 'HERITAGE'
				| 'OTHER';
			grant_type: 'TAX_INCENTIVE' | 'DIRECT_FUNDING' | 'SPONSORSHIP';
			lead_status: 'NEW' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
			organization_type: 'INDIVIDUAL' | 'MEI' | 'ME' | 'EPP' | 'NGO' | 'COOPERATIVE' | 'FOUNDATION';
			task_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
			task_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			activity_type: [
				'NOTE',
				'EMAIL',
				'CALL',
				'MEETING',
				'STATUS_CHANGE',
				'TASK_CREATED',
				'DOCUMENT_UPLOADED'
			],
			company_age: ['LESS_THAN_6M', '6M_TO_1Y', '1Y_TO_2Y', 'MORE_THAN_2Y'],
			cultural_area: [
				'MUSIC',
				'THEATER',
				'DANCE',
				'VISUAL_ARTS',
				'CINEMA',
				'LITERATURE',
				'CIRCUS',
				'HERITAGE',
				'OTHER'
			],
			grant_type: ['TAX_INCENTIVE', 'DIRECT_FUNDING', 'SPONSORSHIP'],
			lead_status: ['NEW', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'],
			organization_type: ['INDIVIDUAL', 'MEI', 'ME', 'EPP', 'NGO', 'COOPERATIVE', 'FOUNDATION'],
			task_priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
			task_status: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
		}
	}
} as const;
