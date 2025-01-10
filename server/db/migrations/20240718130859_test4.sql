-- +goose Up
SELECT 'up SQL query';
CREATE TABLE test4 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
-- +goose Down
drop table test4

