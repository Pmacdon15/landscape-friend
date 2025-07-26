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
    FOREIGN KEY (client_id) REFERENCES clients (id)
)

SELECT *
FROM clients;
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
        'Emily Chen',
        'emily.chen@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '1455 Market St, San Francisco, CA 94103',
        '+1-415-555-0101',
        1.00
    ),
    (
        'Ethan Patel',
        'ethan.patel@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '350 5th Ave, New York, NY 10118',
        '+1-212-555-0102',
        1.00
    ),
    (
        'Lily Tran',
        'lily.tran@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '123 Main St, Austin, TX 78701',
        '+1-512-555-0103',
        1.00
    ),
    (
        'Noah Lee',
        'noah.lee@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '100 University Ave, Toronto, ON M5J 2H6',
        '+1-416-555-0104',
        1.00
    ),
    (
        'Ava Kim',
        'ava.kim@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '520 King St W, Toronto, ON M5V 1K4',
        '+1-647-555-0105',
        1.00
    ),
    (
        'Oliver Garcia',
        'oliver.garcia@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '200 S Wacker Dr, Chicago, IL 60606',
        '+1-312-555-0106',
        1.00
    ),
    (
        'Sophia Rodriguez',
        'sophia.rodriguez@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '777 S Figueroa St, Los Angeles, CA 90017',
        '+1-213-555-0107',
        1.00
    ),
    (
        'William Martinez',
        'william.martinez@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '1000 Main St, Houston, TX 77002',
        '+1-713-555-0108',
        1.00
    ),
    (
        'Isabella Hernandez',
        'isabella.hernandez@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
        '+1-650-555-0109',
        1.00
    ),
    (
        'James Wilson',
        'james.wilson@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '1 Liberty Pl, Philadelphia, PA 19103',
        '+1-215-555-0110',
        1.00
    ),
    (
        'Charlotte Taylor',
        'charlotte.taylor@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '100 Queen St W, Toronto, ON M5H 2N2',
        '+1-416-555-0111',
        1.00
    ),
    (
        'Benjamin Thomas',
        'benjamin.thomas@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '200 King St W, Toronto, ON M5H 3T4',
        '+1-647-555-0112',
        1.00
    ),
    (
        'Mia White',
        'mia.white@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '500 Boylston St, Boston, MA 02116',
        '+1-617-555-0113',
        1.00
    ),
    (
        'Lucas Harris',
        'lucas.harris@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '10 Downing St, London, SW1A 2AA, UK',
        '+44-20-7946-0114',
        1.00
    ),
    (
        'Amelia Clark',
        'amelia.clark@example.com',
        'user_30G0wquvxAjdXFitpjBDklG0qzF',
        '1 Infinite Loop, Cupertino, CA 95014',
        '+1-408-555-0115',
        1.00
    );

INSERT INTO
    accounts (client_id, current_balance)
SELECT id, 1.0
FROM clients;