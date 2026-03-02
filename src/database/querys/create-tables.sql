CREATE TABLE IF NOT EXISTS users(
    id                      varchar(80) UNIQUE,
    complete_name           varchar(2000),
    nickname                varchar(80),
    password                varchar(160)
);

