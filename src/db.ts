function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
	return obj.hasOwnProperty(prop);
}

function success(res: D1Result) {
	return res.results;
}

export async function getConfig<S extends string | null>(db: D1Database, name?: S) {
	if (!name) {
		const stmt = db.prepare(
			'SELECT config_id as id, config_name as name, config_value as value, created_at, updated_at FROM Configurations'
		);
		return success(await stmt.all());
	}

	const stmt = db.prepare(
		'SELECT config_id as id, config_name as name, config_value as value, created_at, updated_at FROM Configurations WHERE config_name = ?'
	);
	return stmt.bind(name).first();
}

export async function setConfig(db: D1Database, name: string | null, value: string | null) {
	if (!name || !value) {
		return null;
	}

	const nameConfig = await getConfig(db, name);
	const nameExist = nameConfig && hasOwnProperty(nameConfig, 'name');

	if (nameExist) {
		const stmt = db.prepare('UPDATE Configurations SET config_value = ?, updated_at = ? WHERE config_name = ?');
		return success(await stmt.bind(value, Date.now(), name).run());
	} else {
		const now = Date.now();
		const stmt = db.prepare('INSERT INTO Configurations (config_id, config_name, config_value, created_at) VALUES (?, ?, ?, ?)');
		return success(await stmt.bind(now, name, value, now).run());
	}
}

export async function deleteConfig(db: D1Database, name: string | null) {
	if (!name) {
		return null;
	}
	const stmt = db.prepare('DELETE FROM Configurations WHERE config_name = ?');

	return success(await stmt.bind(name).run());
}
