CREATE TABLE users
(
    id bigserial PRIMARY KEY,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    is_active boolean NOT NULL DEFAULT FALSE
);