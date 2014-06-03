DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS uploads;

CREATE TABLE filer_uploads(
    id VARCHAR(5) PRIMARY KEY,
    huid VARCHAR(32) NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    finishAt TIMESTAMP NOT NULL
);

CREATE TABLE filer_files(
    id SERIAL PRIMARY KEY,
    uploadId VARCHAR(5) NOT NULL REFERENCES uploads (id) ON UPDATE CASCADE ON DELETE CASCADE,
    path VARCHAR (256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    size INT NOT NULL,
    mime VARCHAR(256) NOT NULL,
    type ENUM('photo', 'image')
);