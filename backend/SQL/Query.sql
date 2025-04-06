-- Active: 1740883715704@@127.0.0.1@3306@daystar_daycare
use daystar_daycare;

-- adding a constraint on the email

ALTER TABLE baby_sitters MODIFY COLUMN age INT NULL;

ALTER TABLE baby_sitters ADD CONSTRAINT chk_email CHECK( email LIKE '%@%');

ALTER TABLE baby_sitters DROP CONSTRAINT chk_email;

ALTER TABLE baby_sitters ADD CONSTRAINT chk_age CHECK(age>=21 AND age<=35);

--ALTER TABLE baby_sitters DROP CONSTRAINT chk_age;

ALTER TABLE managers ADD CONSTRAINT chk1_email CHECK( email LIKE '%@%');

ALTER TABLE managers ADD CONSTRAINT chk1_age CHECK(age>=18 AND age<=35);

--ALTER TABLE managers DROP CONSTRAINT chk1_age;

ALTER TABLE baby_sitters ADD CONSTRAINT chk_phone CHECK(phone LIKE '07%' AND LENGTH(phone) = 10);

ALTER TABLE baby_sitters DROP CONSTRAINT chk_phone;

ALTER TABLE managers ADD CONSTRAINT chk1_phone CHECK(phone LIKE '07%' AND LENGTH(phone) = 10);

ALTER TABLE baby_sitters ADD CONSTRAINT chk_gender CHECK (gender = 'Male' OR gender = 'Female');

ALTER TABLE managers ADD CONSTRAINT chk1_gender CHECK (gender = 'Male' OR gender = 'Female');

ALTER TABLE child ADD CONSTRAINT chk_duration CHECK (Duration_of_stay = 'Full-day' OR Duration_of_stay = 'Half-day');

ALTER TABLE child ADD CONSTRAINT chk_age2 CHECK (age>=1 AND age<=10);

ALTER TABLE child ADD CONSTRAINT chk_gender2 CHECK (gender = 'Male' OR gender = 'Female');

ALTER TABLE child DROP CONSTRAINT chk_parent_guardian_phone;
ALTER TABLE child ADD CONSTRAINT chk_parent_guardian_phone 
    CHECK ((parent_guardian_phone LIKE '07%' AND LENGTH(parent_guardian_phone) = 10) OR parent_guardian_phone IS NULL OR parent_guardian_phone = '');

ALTER TABLE child DROP CONSTRAINT chk_parent_guardian_email;
ALTER TABLE child ADD CONSTRAINT chk_parent_guardian_email 
    CHECK (parent_guardian_email LIKE '%@%' OR parent_guardian_email IS NULL OR parent_guardian_email = '');


----
ALTER TABLE child MODIFY COLUMN age INT NULL;

ALTER TABLE child MODIFY COLUMN Duration_of_stay VARCHAR(255) NULL;

ALTER TABLE child MODIFY COLUMN gender VARCHAR(255) NULL;



