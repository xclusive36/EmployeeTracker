CREATE TABLE department ( -- Table for departments
    id INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    name VARCHAR(30) -- Name of department
);

CREATE TABLE role ( -- Table for roles
    id INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    title VARCHAR(30), -- Title of role
    department_id INT, -- Foreign key to department table to hold reference to department role belongs to
    salary DECIMAL -- Salary of role
);

CREATE TABLE employee ( -- Table for employees
    id INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    first_name VARCHAR(30), -- First name of employee
    last_name VARCHAR(30), -- Last name of employee
    role_id INT, -- Foreign key to role table to hold reference to employee role
    manager_id INT DEFAULT NULL -- Foreign key to employee table to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
);