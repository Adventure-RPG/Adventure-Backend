CREATE TABLE points
(
    id bigserial PRIMARY KEY,
    name character varying(50) NOT NULL,
    geo geometry NOT NULL UNIQUE
);