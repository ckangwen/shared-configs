import { getConfig, setConfig, deleteConfig } from './db';

export interface Env {
	DB: D1Database;
	API_TOKEN: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const authorization = request.headers.get('authorization');
		if (authorization !== env.API_TOKEN) {
			return new Response('Please set the correct API token', { status: 401 });
		}

		const method = request.method.toUpperCase();
		const query = new URL(request.url).searchParams;
		const name = query.get('name');
		switch (method) {
			case 'GET': {
				const result = await getConfig(env.DB, name);
				return new Response(JSON.stringify(result), { status: 200 });
			}
			case 'POST': {
				const result = await setConfig(env.DB, name, query.get('value'));
				return new Response(JSON.stringify(result), { status: 200 });
			}
			case 'DELETE': {
				const result = await deleteConfig(env.DB, name);
				return new Response(JSON.stringify(result), { status: 200 });
			}
		}

		return new Response('Not Found', { status: 404 });
	},
};
