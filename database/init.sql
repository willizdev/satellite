create database satellite;

\c satellite

CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY,
    hash TEXT NOT NULL,
    token TEXT NOT NULL,
    name VARCHAR(32) NOT NULL
);
