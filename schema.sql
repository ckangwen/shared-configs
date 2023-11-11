DROP TABLE IF EXISTS Configurations;

CREATE TABLE Configurations (
	config_id INT PRIMARY KEY,
	config_name VARCHAR(255) NOT NULL,
	config_value TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);

INSERT INTO
	Configurations (config_id, config_name, config_value)
VALUES
	(1, 'default_config', 'default_value');
