import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Guard: Ensure user is authenticated
	if (!locals.user) {
		redirect(303, '/auth/login');
	}

	return {
		user: locals.user,
		session: locals.session
	};
};
