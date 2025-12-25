import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});

	/**
	 * Unlike `getSession`, which uses the session from the cookie (insecure for authorization),
	 * `getUser` validates the user against the database.
	 */
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	event.locals.user = user;
	event.locals.session = null; // Session is derived from user + cookie if needed, but for guards, user is key.

	if (user) {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		event.locals.session = session;
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
