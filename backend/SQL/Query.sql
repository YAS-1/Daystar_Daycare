use daystar_daycare;

-- adding a constraint on the email
ALTER TABLE baby_sitters ADD CONSTRAINT chk_email CHECK( email LIKE '%_@__%.__%');

ALTER TABLE baby_sitters ADD CONSTRAINT chk_age CHECK(age>=21 AND age<=35);

--ALTER TABLE baby_sitters DROP CONSTRAINT chk_age;

ALTER TABLE managers ADD CONSTRAINT chk1_email CHECK( email LIKE '%_@__%.__%');

ALTER TABLE managers ADD CONSTRAINT chk1_age CHECK(age>=18 AND age<=35);

--ALTER TABLE managers DROP CONSTRAINT chk1_age;

ALTER TABLE baby_sitters ADD CONSTRAINT chk_phone CHECK(phone LIKE '07%' AND LENGTH(phone) = 10);


ALTER TABLE managers ADD CONSTRAINT chk1_phone CHECK(phone LIKE '07%' AND LENGTH(phone) = 10);

ALTER TABLE baby_sitters ADD CONSTRAINT chk_gender CHECK (gender = 'Male' OR gender = 'Female');

ALTER TABLE managers ADD CONSTRAINT chk1_gender CHECK (gender = 'Male' OR gender = 'Female');