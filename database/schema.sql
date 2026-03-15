CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(255),
  role VARCHAR(20)
);

CREATE TABLE marks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  roll_no VARCHAR(20),
  subject VARCHAR(50),
  marks JSON
);
