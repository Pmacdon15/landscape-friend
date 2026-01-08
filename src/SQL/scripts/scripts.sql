
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
SELECT * FROM assignments;
SELECT * FROM yards_marked_clear;
SELECT * FROM yards_marked_cut;
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

INSERT INTO users (id, name, email)
VALUES ('user_35uYpItCYEItSG6WmiTExQEmT1U', 'New User', 'pmacdonald15@proton.me');

-- ALTER TABLE organizations
-- ALTER COLUMN max_allowed_clients
-- SET DEFAULT 25;