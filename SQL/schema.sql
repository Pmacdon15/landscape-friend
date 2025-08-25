DROP TABLE IF EXISTS stripe_api_keys CASCADE;

DROP TABLE IF EXISTS yards_marked_cut CASCADE;

DROP TABLE IF EXISTS yards_marked_clear CASCADE;

DROP TABLE IF EXISTS snow_clearing_assignments CASCADE;

DROP TABLE IF EXISTS cutting_schedule CASCADE;

DROP TABLE IF EXISTS payments CASCADE;

DROP TABLE IF EXISTS accounts CASCADE;

DROP TABLE IF EXISTS clients CASCADE;

DROP TABLE IF EXISTS organizations CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE users (
    id VARCHAR(100) UNIQUE PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    novu_subscriber_id VARCHAR(255) UNIQUE NULL
);

CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    organization_id VARCHAR(253) NOT NULL UNIQUE,
    organization_name VARCHAR(253) NOT NULL,
    max_allowed_clients INT NOT NULL DEFAULT 50
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(75) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email_address VARCHAR(75) NOT NULL,
    organization_id VARCHAR(253) NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE,
    price_per_cut FLOAT NOT NULL DEFAULT 51.5,
    address VARCHAR(200) NOT NULL,
    snow_client BOOLEAN NOT NULL DEFAULT false,
    price_per_month_snow FLOAT NOT NULL DEFAULT 100,
    stripe_customer_id VARCHAR(255) NULL
);

CREATE TABLE stripe_api_keys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(253) NOT NULL,
    organization_id VARCHAR(253) NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    current_balance FLOAT NOT NULL DEFAULT 0.0,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    amount FLOAT NOT NULL,
    organization_id VARCHAR(253) NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
);

CREATE TABLE cutting_schedule (
    id SERIAL PRIMARY KEY,
    cutting_week INT NOT NULL,
    cutting_day VARCHAR(10) NOT NULL,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    UNIQUE (client_id, cutting_week)
);

CREATE TABLE yards_marked_cut (
    id SERIAL PRIMARY KEY,
    cutting_date DATE NOT NULL,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    UNIQUE (client_id, cutting_date)
);

CREATE TABLE yards_marked_clear (
    id SERIAL PRIMARY KEY,
    clearing_date DATE NOT NULL,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    UNIQUE (client_id, clearing_date)
);

CREATE TABLE snow_clearing_assignments (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    assigned_to VARCHAR(75) NOT NULL,
    organization_id VARCHAR(253) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE,
    UNIQUE (client_id)
);

CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    customerID VARCHAR(255) NOT NULL,
    imageURL TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN
);
-- SELECT * FROM images;
-- SELECT * FROM yards_marked_cut;
-- SELECT * FROM yards_um that might not work masybe marked_clear;
-- SELECT * FROM cutting_schedule;
-- SELECT * FROM clients;
-- SELECT * FROM users;

-- SELECT id, novu_subscriber_id 
--             FROM users 
--             WHERE id IN ('user_31kuxkI2CwFoInhMSg0HDZ4niYz');
-- WHERE
--     organization_id = 'user_30G0wquvxAjdXFitpjBDklG0qzF';
-- -- SELECT * from price_per_cut ;
-- SELECT * FROM stripe_api_keys;
-- SELECT * FROM snow_clearing_assignments;
-- SELECT * FROM payments ;
-- SELECT * FROM accounts;

-- SELECT novu_subscriber_id FROM users where id = 'user_31aEmuYV7QaHGA5g3eweBq5bZSr' ;