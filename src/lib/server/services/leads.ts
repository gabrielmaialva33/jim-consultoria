import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, LeadInsert } from '$lib/supabase/types';

export class LeadsService {
	constructor(private supabase: SupabaseClient<Database>) {}

	async createLead(data: LeadInsert) {
		const { error } = await this.supabase.from('leads').insert(data);
		if (error) throw error;
	}

	async getRecentLeads(limit = 10) {
		const { data, error } = await this.supabase
			.from('leads')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) throw error;
		return data;
	}

	async getStats() {
		const { count, error } = await this.supabase
			.from('leads')
			.select('*', { count: 'exact', head: true });

		if (error) throw error;
		return count;
	}
}
