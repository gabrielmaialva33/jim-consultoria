// Re-export the auto-generated Database type
export type { Database, Json } from './database.types';

import type { Database } from './database.types';

// Convenience type aliases for enums
export type OrganizationType = Database['public']['Enums']['organization_type'];
export type CompanyAge = Database['public']['Enums']['company_age'];
export type LeadStatus = Database['public']['Enums']['lead_status'];
export type CulturalArea = Database['public']['Enums']['cultural_area'];
export type GrantType = Database['public']['Enums']['grant_type'];
export type TaskStatus = Database['public']['Enums']['task_status'];
export type TaskPriority = Database['public']['Enums']['task_priority'];
export type ActivityType = Database['public']['Enums']['activity_type'];

// Convenience type aliases for table rows
export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export type Grant = Database['public']['Tables']['grants']['Row'];
export type GrantInsert = Database['public']['Tables']['grants']['Insert'];
export type GrantUpdate = Database['public']['Tables']['grants']['Update'];

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type Activity = Database['public']['Tables']['activities']['Row'];
export type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
export type ActivityUpdate = Database['public']['Tables']['activities']['Update'];
