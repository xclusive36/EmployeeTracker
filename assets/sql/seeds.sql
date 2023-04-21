DROP DATABASE IF EXISTS tracker;
CREATE Database tracker;

USE tracker;

CREATE TABLE department ( -- Table for departments
    id INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    name VARCHAR(30) -- Name of department
);

INSERT INTO `department` VALUES (1,'Sales'),(2,'Engineering'),(3,'Finance'),(4,'Legal');

CREATE TABLE role ( -- Table for roles
    id INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    title VARCHAR(30), -- Title of role
    department_id INT, -- Foreign key to department table to hold reference to department role belongs to
    salary DECIMAL -- Salary of role
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

INSERT INTO `role` VALUES (1,'Sales Lead',100000,1),(2,'Salesperson',80000,1),(3,'Lead Engineer',150000,2),(4,'Software Engineer',120000,2),(5,'Account Manager',160000,3),(6,'Accountant',125000,3),(7,'Legal Team Lead',250000,4),(8,'Lawyer',190000,4);

CREATE TABLE employee ( -- Table for employees
    id INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    first_name VARCHAR(30), -- First name of employee
    last_name VARCHAR(30), -- Last name of employee
    role_id INT, -- Foreign key to role table to hold reference to employee role
    manager_id INT DEFAULT NULL -- Foreign key to employee table to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
    FOREIGN KEY (role_id) REFERENCES role(id)
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    ON DELETE SET NULL
);

INSERT INTO `employee` VALUES (1,'John','Doe',1,0),(2,'Mike','Chan',2,1),(3,'Ashley','Rodriguez',3,0),(4,'Kevin','Tupik',4,3),(5,'Kunal','Singh',5,0),(6,'Malia','Brown',6,5),(7,'Sarah','Lourd',7,0),(8,'Tom','Allen',8,7);