DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(75) UNIQUE NOT NULL,
    email_address VARCHAR(75) UNIQUE NOT NULL,
    organization_id VARCHAR(75) NOT NULL,
    maintenance_week INT,
    client_address VARCHAR(200) NOT NULL
);

