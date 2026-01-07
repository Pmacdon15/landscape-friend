-- Active: 1759545766576@@ep-gentle-cloud-ad2wbsx6-pooler.c-2.us-east-1.aws.neon.tech@5432@neondb
-- DROP TABLE IF EXISTS stripe_api_keys CASCADE;

-- DROP TABLE IF EXISTS yards_marked_cut CASCADE;

-- DROP TABLE IF EXISTS yards_marked_clear CASCADE;

-- DROP TABLE IF EXISTS cutting_schedule CASCADE;

-- DROP TABLE IF EXISTS charges CASCADE;

-- DROP TABLE IF EXISTS payments CASCADE;

-- DROP TABLE IF EXISTS accounts CASCADE;

-- DROP TABLE IF EXISTS clients CASCADE;

-- DROP TABLE IF EXISTS client_addresses CASCADE;

-- DROP TABLE IF EXISTS organizations CASCADE;

-- DROP TABLE IF EXISTS users CASCADE;

-- DROP TABLE IF EXISTS images CASCADE;

-- DROP TABLE IF EXISTS assignments CASCADE;

-- DROP TABLE IF EXISTS images_serviced CASCADE;



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
    phone_number VARCHAR(50),
    email_address VARCHAR(75),
    organization_id VARCHAR(253) NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE,    
    -- address VARCHAR(200) NOT NULL,   
    stripe_customer_id VARCHAR(255) NULL
    
);

CREATE TABLE client_addresses (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    address VARCHAR(200) NOT NULL,
    FOREIGN KEY (client_id)
        REFERENCES clients (id)
        ON DELETE CASCADE
);
-- SELECT * FROM clients WHERE full_name = 'Erick Booberson MacDonald';
CREATE TABLE stripe_api_keys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(253) NOT NULL,
    organization_id VARCHAR(253) UNIQUE NOT NULL,
    webhook_secret VARCHAR(253) NULL,
    webhook_id VARCHAR(253) NULL,
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

CREATE TABLE charges (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(255) NOT NULL UNIQUE,
    client_id INT NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    organization_id VARCHAR(253) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE
);

CREATE TABLE cutting_schedule (
    id SERIAL PRIMARY KEY,
    cutting_week INT NULL,
    cutting_day VARCHAR(10) NULL,
    client_id INT NOT NULL,
    organization_id VARCHAR(100) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    UNIQUE (client_id, cutting_week, organization_id)
);

CREATE TABLE yards_marked_cut (
    id SERIAL PRIMARY KEY,
    cutting_date DATE NOT NULL,
    client_id INT NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    UNIQUE (client_id, cutting_date)
);

CREATE TABLE yards_marked_clear (
    id SERIAL PRIMARY KEY,
    clearing_date DATE NOT NULL,
    client_id INT NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (client_id, clearing_date)
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    org_id VARCHAR(150) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    priority INT NOT NULL,
    service_type VARCHAR(10) NOT NULL CHECK (service_type IN ('grass', 'snow')),
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES  organizations (organization_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (client_id, service_type, priority, org_id)
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    customerID INT NOT NULL,
    imageURL TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN,
    Foreign Key (customerID) REFERENCES clients (id) ON DELETE CASCADE
);

CREATE TABLE images_serviced (
    id SERIAL PRIMARY KEY,
    imageURL TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fk_cut_id INT,
    fk_clear_id INT,
    CONSTRAINT fk_cut FOREIGN KEY (fk_cut_id) REFERENCES yards_marked_cut (id) ON DELETE CASCADE,
    CONSTRAINT fk_clear FOREIGN KEY (fk_clear_id) REFERENCES yards_marked_clear (id) ON DELETE CASCADE,
    CONSTRAINT at_least_one_fk CHECK (
        fk_cut_id IS NOT NULL OR fk_clear_id IS NOT NULL
    )
);

-- CREATE TABLE images_serviced (
--     id SERIAL PRIMARY KEY,
--     imageURL TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     fk_cut_id INT,
--     fk_clear_id INT,
--     CONSTRAINT fk_cut FOREIGN KEY (fk_cut_id) REFERENCES yards_marked_cut (id) ON DELETE CASCADE,
--     CONSTRAINT fk_clear FOREIGN KEY (fk_clear_id) REFERENCES yards_marked_clear (id) ON DELETE CASCADE,
--     CONSTRAINT at_least_one_fk CHECK (
--         fk_cut_id IS NOT NULL OR fk_clear_id IS NOT NULL
--     )
-- );
-- SELECT * FROM users;
-- SELECT * FROM organizations;
-- SELECT * FROM clients where organization_id ='org_35ugSke0IBs1XDGa7YI6boXVqsG' ORDER BY id ASC;
-- SELECT * FROM  yards_marked_clear WHERE clearing_date = '2025-12-13' and client_id = 25;
-- SELECT * FROM  assignments Where  org_id ='org_35ugSke0IBs1XDGa7YI6boXVqsG' AND user_id = 'user_3675TIQwdEYVqVmUbcuGqDy72rA' ORDER BY priority                                                                                                            ;
--         ymc.cutting_date AS date,
--         img.imageurl
--         FROM yards_marked_cut ymc
--         JOIN images_serviced img ON img.fk_cut_id = ymc.id
--         WHERE ymc.client_id = 110
--       UNION
--       SELECT 
--       ymc.clearing_date AS date,
--       img.imageurl
--         FROM yards_marked_clear ymc
--         JOIN images_serviced img ON img.fk_clear_id = ymc.id
--         WHERE ymc.client_id = 110;
-- SELECT * FROM images_serviced;
-- SELECT * FROM images;
-- SELECT * FROM yards_marked_cut;
-- SELECT * FROM yards_um that might not work masybe marked_clear;
-- SELECT * FROM cutting_schedule;
-- SELECT * FROM clients;

-- SELECT 
--   c.full_name, 
--   c.address, 
--   a.priority, 
--   a.user_id AS assigned_to
-- FROM 
--   clients c
-- JOIN 
--   assignments a ON c.id = a.client_id
-- WHERE 
--   a.org_id = 'org_35ugSke0IBs1XDGa7YI6boXVqsG';
-- SELECT * FROM assignments;
-- SELECT * FROM clients;
-- SELECT * FROM users;
-- SELECT * FROM organizations;
-- UPDATE organizations
-- SET max_allowed_clients = 150
-- WHERE organization_id = 'org_35ugSke0IBs1XDGa7YI6boXVqsG';
-- SELECT id, novu_subscriber_id
--             FROM users
--             WHERE id IN ('user_31kuxkI2CwFoInhMSg0HDZ4niYz');
-- INSERT INTO organizations (organization_id, organization_name)
-- VALUES ('user_35j5KGqeQ3VvGgZNifj5k54uYOc', 'Your Organization Name');
-- -- SELECT * from price_per_cut ;
-- SELECT * FROM stripe_api_keys;
-- SELECT * FROM snow_clearing_assignments;
-- SELECT * FROM payments ;
-- SELECT * FROM accounts;

-- SELECT novu_subscriber_id FROM users where id = 'user_31aEmuYV7QaHGA5g3eweBq5bZSr' ;
-- SELECT * FROM charges;

-- UPDATE organizations
-- SET max_allowed_clients = 200
-- WHERE organization_id = 'org_35lkfCNDV6WjfG9iEKaXZRGnf4A';

-- UPDATE assignments 
-- SET priority = subquery.new_priority
-- FROM (
--     SELECT id, ROW_NUMBER() OVER (ORDER BY id) as new_priority
--     FROM assignments 
--     WHERE user_id = 'user_3675TIQwdEYVqVmUbcuGqDy72rA'
-- ) subquery
-- WHERE assignments.id = subquery.id;


INSERT INTO organizations (organization_id, organization_name, max_allowed_clients)
VALUES ('user_35uYpItCYEItSG6WmiTExQEmT1U', 'Pat', 100);

-- INSERT INTO users (id, name, email)
-- VALUES ('user_368RTyyYd3bUdazs9qaAqGI5D9S', 'New User', 'pmacdonald15@proton.me');

-- ALTER TABLE organizations
-- ALTER COLUMN max_allowed_clients
-- SET DEFAULT 25;