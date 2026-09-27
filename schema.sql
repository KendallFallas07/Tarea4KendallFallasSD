CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY,
    author VARCHAR NOT NULL,
    nationality VARCHAR,
    birth_year INTEGER,
    fields VARCHAR
);

CREATE TABLE IF NOT EXISTS publishers (
    id INTEGER PRIMARY KEY,
    publisher VARCHAR NOT NULL,
    country VARCHAR,
    founded INTEGER,
    genre VARCHAR
);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    edition VARCHAR,
    copyright INTEGER,
    language VARCHAR,
    pages INTEGER,
    author_id INTEGER,
    publisher_id INTEGER,
    CONSTRAINT fk_author
        FOREIGN KEY (author_id)
        REFERENCES authors(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_publisher
        FOREIGN KEY (publisher_id)
        REFERENCES publishers(id)
        ON DELETE SET NULL
);
