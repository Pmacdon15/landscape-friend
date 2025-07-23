DROP TABLE IF EXISTS price_per_cut CASCADE;

DROP TABLE IF EXISTS payments CASCADE;

DROP TABLE IF EXISTS accounts CASCADE;

DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(75) NOT NULL,
    phone_number BIGINT NOT NULL,
    email_address VARCHAR(75) UNIQUE NOT NULL,
    organization_id VARCHAR(75) NOT NULL,
    maintenance_week INT,
    address VARCHAR(200) NOT NULL
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    current_balance FLOAT NOT NULL DEFAULT 0.0,
    FOREIGN KEY (client_id) REFERENCES clients (id)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    amount FLOAT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
);

CREATE TABLE price_per_cut (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 51.50,
    organization_id VARCHAR(75) NOT NULL UNIQUE
);


SELECT * from price_per_cut ;
-- INSERT INTO
--     clients (
--         full_name,
--         email_address,
--         organization_id,
--         maintenance_week,
--         address
--     )
-- VALUES (
--         'Emily Chen',
--         'emily.chen@example.com',
--         'user_3048zVOYOR3UmKgx7ieXF9j8xmT',
--         1,
--         '1455 Market St, San Francisco, CA 94103'
--     ),
--     (
--         'Ethan Patel',
--         'ethan.patel@example.com',
--         'user_3048zVOYOR3UmKgx7ieXF9j8xmT',
--         2,
--         '350 5th Ave, New York, NY 10118'
--     ),
--     (
--         'Lily Tran',
--         'lily.tran@example.com',
--         'user_3048zVOYOR3UmKgx7ieXF9j8xmT',
--         3,
--         '123 Main St, Austin, TX 78701'
--     ),
--     (
--         'Noah Lee',
--         'noah.lee@example.com',
--         'user_3048zVOYOR3UmKgx7ieXF9j8xmT',
--         4,
--         '100 University Ave, Toronto, ON M5J 2H6'
--     ),
--     (
--         'Ava Kim',
--         'ava.kim@example.com',
--         'user_3048zVOYOR3UmKgx7ieXF9j8xmT',
--         1,
--         '520 King St W, Toronto, ON M5V 1K4'
--     );

-- select * FROM clients;

-- SELECT email_address
-- FROM clients
-- WHERE
--     organization_id = 'org_304Zg6ArtcRA3gtiqISN35la8ut';