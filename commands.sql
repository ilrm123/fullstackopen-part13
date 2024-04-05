CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) values ('Writer person', 'bestblog.com', 'asd');
INSERT INTO blogs (url, title) values ('noauthor.com', 'nothing');
