DROP TABLE IF EXISTS yards_marked_cut CASCADE;

DROP TABLE IF EXISTS cutting_schedule CASCADE;

DROP TABLE IF EXISTS payments CASCADE;

DROP TABLE IF EXISTS accounts CASCADE;

DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(75) NOT NULL,
    phone_number VARCHAR(50) NOT NULL, -- Changed from BIGINT to VARCHAR
    email_address VARCHAR(75) UNIQUE NOT NULL,
    organization_id VARCHAR(75) NOT NULL,
    price_per_cut FLOAT NOT NULL DEFAULT 51.5,
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

CREATE TABLE cutting_schedule (
    id SERIAL PRIMARY KEY,
    cutting_week INT NOT NULL,
    cutting_day VARCHAR(10) NOT NULL,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id),
    UNIQUE (client_id, cutting_week)
);

CREATE TABLE yards_marked_cut (
    id SERIAL PRIMARY KEY,
    cutting_week INT NOT NULL,
    cutting_day VARCHAR(10) NOT NULL,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id),
    UNIQUE (client_id, cutting_week)
);

-- SELECT * FROM cutting_schedule;
-- SELECT * FROM clients;
-- WHERE
--     organization_id = 'user_30G0wquvxAjdXFitpjBDklG0qzF';
-- -- SELECT * from price_per_cut ;
INSERT INTO
    clients (
        full_name,
        email_address,
        organization_id,
        address,
        phone_number,
        price_per_cut
    )
VALUES (
        'Emily Lee',
        'emily.lee@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '1234 26th Ave SW, Calgary, AB T2S 0J5',
        '+1-403-123-4567',
        1.00
    ),
    (
        'Sarah Taylor',
        'sarah.taylor@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '4567 Crowchild Trail NW, Calgary, AB T3B 0T4',
        '+1-403-765-4321',
        1.00
    ),
    (
        'Michael Johnson',
        'michael.johnson@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '7890 Macleod Trail SE, Calgary, AB T2G 0B1',
        '+1-403-901-2345',
        1.00
    ),
    (
        'Jessica Brown',
        'jessica.brown@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '9012 Banff Trail NW, Calgary, AB T3K 0B3',
        '+1-403-111-2222',
        1.00
    ),
    (
        'William Wilson',
        'william.wilson@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '3456 14th St NW, Calgary, AB T2N 1M5',
        '+1-403-333-4444',
        1.00
    );

INSERT INTO
    accounts (client_id, current_balance)
SELECT id, 1.0
FROM clients;