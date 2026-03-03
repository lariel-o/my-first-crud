CREATE TABLE IF NOT EXISTS users(
    id                      varchar(40) UNIQUE,
    complete_name           varchar(2000),
    nickname                varchar(80) UNIQUE,
    password                varchar(160)
);

