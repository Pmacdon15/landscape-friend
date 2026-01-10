BEGIN;

-------------------------------------------------------
-- 1. BACKUP ALL TABLES
-------------------------------------------------------

CREATE TABLE IF NOT EXISTS users_backup AS TABLE users;
CREATE TABLE IF NOT EXISTS organizations_backup AS TABLE organizations;
CREATE TABLE IF NOT EXISTS clients_backup AS TABLE clients;
CREATE TABLE IF NOT EXISTS stripe_api_keys_backup AS TABLE stripe_api_keys;
CREATE TABLE IF NOT EXISTS accounts_backup AS TABLE accounts;
CREATE TABLE IF NOT EXISTS payments_backup AS TABLE payments;
CREATE TABLE IF NOT EXISTS charges_backup AS TABLE charges;
CREATE TABLE IF NOT EXISTS cutting_schedule_backup AS TABLE cutting_schedule;
CREATE TABLE IF NOT EXISTS yards_marked_cut_backup AS TABLE yards_marked_cut;
CREATE TABLE IF NOT EXISTS yards_marked_clear_backup AS TABLE yards_marked_clear;
CREATE TABLE IF NOT EXISTS assignments_backup AS TABLE assignments;
CREATE TABLE IF NOT EXISTS images_backup AS TABLE images;
CREATE TABLE IF NOT EXISTS images_serviced_backup AS TABLE images_serviced;

-------------------------------------------------------
-- 2. CREATE client_addresses TABLE
-------------------------------------------------------

CREATE TABLE IF NOT EXISTS client_addresses (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    address VARCHAR(200) NOT NULL,
    FOREIGN KEY (client_id)
        REFERENCES clients (id)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- 3. POPULATE client_addresses
-------------------------------------------------------

INSERT INTO client_addresses (client_id, address)
SELECT id, address
FROM clients
WHERE address IS NOT NULL;

-------------------------------------------------------
-- 4. CUTTING SCHEDULE
-------------------------------------------------------

ALTER TABLE cutting_schedule
ADD COLUMN IF NOT EXISTS address_id INT;

-- Delete orphan rows
DELETE FROM cutting_schedule cs
WHERE NOT EXISTS (
    SELECT 1 FROM client_addresses ca WHERE ca.client_id = cs.client_id
);

-- Map address_id
UPDATE cutting_schedule cs
SET address_id = ca.id
FROM client_addresses ca
WHERE cs.client_id = ca.client_id;

-- Drop old foreign key
ALTER TABLE cutting_schedule
DROP CONSTRAINT IF EXISTS cutting_schedule_client_id_fkey;

-- Drop old columns
ALTER TABLE cutting_schedule
DROP COLUMN IF EXISTS client_id,
DROP COLUMN IF EXISTS organization_id;

-- Set NOT NULL safely
ALTER TABLE cutting_schedule
ALTER COLUMN address_id SET NOT NULL;

-- Add foreign key safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'cutting_schedule_address_fkey'
    ) THEN
        ALTER TABLE cutting_schedule
        ADD CONSTRAINT cutting_schedule_address_fkey
        FOREIGN KEY (address_id)
        REFERENCES client_addresses (id)
        ON DELETE CASCADE;
    END IF;
END
$$;

-- Add unique constraint safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'cutting_schedule_unique'
    ) THEN
        ALTER TABLE cutting_schedule
        ADD CONSTRAINT cutting_schedule_unique
        UNIQUE (address_id, cutting_week);
    END IF;
END
$$;

-------------------------------------------------------
-- 5. YARDS MARKED CUT
-------------------------------------------------------

ALTER TABLE yards_marked_cut
ADD COLUMN IF NOT EXISTS address_id INT;

DELETE FROM yards_marked_cut y
WHERE NOT EXISTS (
    SELECT 1 FROM client_addresses ca WHERE ca.client_id = y.client_id
);

UPDATE yards_marked_cut y
SET address_id = ca.id
FROM client_addresses ca
WHERE y.client_id = ca.client_id;

ALTER TABLE yards_marked_cut
DROP CONSTRAINT IF EXISTS yards_marked_cut_client_id_fkey;
ALTER TABLE yards_marked_cut
DROP COLUMN IF EXISTS client_id;

ALTER TABLE yards_marked_cut
ALTER COLUMN address_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'yards_marked_cut_address_fkey'
    ) THEN
        ALTER TABLE yards_marked_cut
        ADD CONSTRAINT yards_marked_cut_address_fkey
        FOREIGN KEY (address_id)
        REFERENCES client_addresses (id)
        ON DELETE CASCADE;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'yards_marked_cut_unique'
    ) THEN
        ALTER TABLE yards_marked_cut
        ADD CONSTRAINT yards_marked_cut_unique
        UNIQUE (address_id, cutting_date);
    END IF;
END
$$;

-------------------------------------------------------
-- 6. YARDS MARKED CLEAR
-------------------------------------------------------

ALTER TABLE yards_marked_clear
ADD COLUMN IF NOT EXISTS address_id INT;

DELETE FROM yards_marked_clear y
WHERE NOT EXISTS (
    SELECT 1 FROM client_addresses ca WHERE ca.client_id = y.client_id
);

UPDATE yards_marked_clear y
SET address_id = ca.id
FROM client_addresses ca
WHERE y.client_id = ca.client_id;

ALTER TABLE yards_marked_clear
DROP CONSTRAINT IF EXISTS yards_marked_clear_client_id_fkey;
ALTER TABLE yards_marked_clear
DROP COLUMN IF EXISTS client_id;

ALTER TABLE yards_marked_clear
ALTER COLUMN address_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'yards_marked_clear_address_fkey'
    ) THEN
        ALTER TABLE yards_marked_clear
        ADD CONSTRAINT yards_marked_clear_address_fkey
        FOREIGN KEY (address_id)
        REFERENCES client_addresses (id)
        ON DELETE CASCADE;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'yards_marked_clear_unique'
    ) THEN
        ALTER TABLE yards_marked_clear
        ADD CONSTRAINT yards_marked_clear_unique
        UNIQUE (address_id, clearing_date);
    END IF;
END
$$;

-------------------------------------------------------
-- 7. ASSIGNMENTS
-------------------------------------------------------

ALTER TABLE assignments
ADD COLUMN IF NOT EXISTS address_id INT;

DELETE FROM assignments a
WHERE NOT EXISTS (
    SELECT 1 FROM client_addresses ca WHERE ca.client_id = a.client_id
);

UPDATE assignments a
SET address_id = ca.id
FROM client_addresses ca
WHERE a.client_id = ca.client_id;

ALTER TABLE assignments
DROP CONSTRAINT IF EXISTS assignments_client_id_fkey;
ALTER TABLE assignments
DROP CONSTRAINT IF EXISTS assignments_org_id_fkey;

ALTER TABLE assignments
DROP COLUMN IF EXISTS client_id,
DROP COLUMN IF EXISTS org_id;

ALTER TABLE assignments
ALTER COLUMN address_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'assignments_address_fkey'
    ) THEN
        ALTER TABLE assignments
        ADD CONSTRAINT assignments_address_fkey
        FOREIGN KEY (address_id)
        REFERENCES client_addresses (id)
        ON DELETE CASCADE;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'assignments_unique'
    ) THEN
        ALTER TABLE assignments
        ADD CONSTRAINT assignments_unique
        UNIQUE (service_type, priority, address_id, user_id);
    END IF;
END
$$;

-------------------------------------------------------
-- 8. IMAGES
-------------------------------------------------------

ALTER TABLE images
ADD COLUMN IF NOT EXISTS address_id INT;

DELETE FROM images i
WHERE NOT EXISTS (
    SELECT 1 FROM client_addresses ca WHERE ca.client_id = i.customerID
);

UPDATE images i
SET address_id = ca.id
FROM client_addresses ca
WHERE i.customerID = ca.client_id;

ALTER TABLE images
DROP CONSTRAINT IF EXISTS images_customerID_fkey;
ALTER TABLE images
DROP COLUMN IF EXISTS customerID;

ALTER TABLE images
ALTER COLUMN address_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'images_address_fkey'
    ) THEN
        ALTER TABLE images
        ADD CONSTRAINT images_address_fkey
        FOREIGN KEY (address_id)
        REFERENCES client_addresses (id)
        ON DELETE CASCADE;
    END IF;
END
$$;

-------------------------------------------------------
-- 9. CLIENTS TABLE CLEANUP
-------------------------------------------------------

ALTER TABLE clients
DROP COLUMN IF EXISTS address;

-------------------------------------------------------
-- 10. COMMIT TRANSACTION
-------------------------------------------------------

COMMIT;

-- ROLLBACK;