DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(75) UNIQUE NOT NULL,
    email_address VARCHAR(75) UNIQUE NOT NULL,
    organization_id VARCHAR(75) NOT NULL,
    maintenance_week INT,
    client_address VARCHAR(200) NOT NULL
);

INSERT INTO clients (id, full_name, email_address, organization_id, maintenance_week, client_address)
VALUES 
    (1, 'Emily Chen', 'emily.chen@example.com', 'user_3048zVOYOR3UmKgx7ieXF9j8xmT', 1, '1455 Market St, San Francisco, CA 94103'),
    (2, 'Ethan Patel', 'ethan.patel@example.com', 'user_3048zVOYOR3UmKgx7ieXF9j8xmT', 2, '350 5th Ave, New York, NY 10118'),
    (3, 'Lily Tran', 'lily.tran@example.com', 'user_3048zVOYOR3UmKgx7ieXF9j8xmT', 3, '123 Main St, Austin, TX 78701'),
    (4, 'Noah Lee', 'noah.lee@example.com', 'user_3048zVOYOR3UmKgx7ieXF9j8xmT', 4, '100 University Ave, Toronto, ON M5J 2H6'),
    (5, 'Ava Kim', 'ava.kim@example.com', 'user_3048zVOYOR3UmKgx7ieXF9j8xmT', 1, '520 King St W, Toronto, ON M5V 1K4');