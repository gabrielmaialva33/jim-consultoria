import { createClient } from '$lib/supabase/client';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
	depends('supabase:auth');

	const supabase = createClient();

	return {
		...data,
		supabase
	};
};
