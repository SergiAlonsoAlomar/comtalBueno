CREATE DATABASE IF NOT EXISTS comtal;

USE comtal;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password CHAR(64),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birth_date DATE,
    public_account BOOLEAN
);

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username),
    message TEXT,
    post_datetime DATETIME
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username),
    comment_text TEXT,
    comment_datetime DATETIME
);

CREATE TABLE comment_likes (
    like_comment_id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username),
    like_datetime DATETIME
);

CREATE TABLE post_likes (
    like_post_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username),
    like_datetime DATETIME
);

CREATE TABLE friendships (
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    requesting_user VARCHAR(50),
    FOREIGN KEY (requesting_user) REFERENCES users(username),
    receiving_user VARCHAR(50),
    FOREIGN KEY (receiving_user) REFERENCES users(username),
    friendship_status ENUM('pending', 'accepted', 'rejected')
);