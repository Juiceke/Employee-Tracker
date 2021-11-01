DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Employee;

CREATE TABLE Department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);

CREATE TABLE Employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

