import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, depends }) => {
	depends('supabase:auth');

	return {
		session: locals.session,
		cookies: cookies.getAll()
	};
};
