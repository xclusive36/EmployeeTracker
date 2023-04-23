DROP DATABASE IF EXISTS tracker;
CREATE Database tracker;

USE tracker;

CREATE TABLE `department` ( -- Table for departments
    `id` INT PRIMARY KEY AUTO_INCREMENT, -- Primary key
    `name` VARCHAR(30) -- Name of department
);

INSERT INTO `department` VALUES (1,'Sales'),(2,'Engineering'),(3,'Finance'),(4,'Legal');

CREATE TABLE `role` ( -- Table for roles
  `id` int NOT NULL AUTO_INCREMENT, -- Primary key
  `title` varchar(30) DEFAULT NULL, -- Title of role
  `salary` decimal(10,0) DEFAULT NULL, -- Salary of role
  `department_id` int DEFAULT NULL, -- Foreign key to department table to hold reference to department role belongs to
  PRIMARY KEY (`id`), -- Primary key
  FOREIGN KEY (`department_id`) REFERENCES department(`id`) -- Foreign key to department table to hold reference to department role belongs to
);

INSERT INTO `role` VALUES (1,'Sales Lead',100000,1),(2,'Salesperson',80000,1),(3,'Lead Engineer',150000,2),(4,'Software Engineer',120000,2),(5,'Account Manager',160000,3),(6,'Accountant',125000,3),(7,'Legal Team Lead',250000,4),(8,'Lawyer',190000,4);

CREATE TABLE `employee` ( -- Table for employees
  `id` int NOT NULL AUTO_INCREMENT, -- Primary key
  `first_name` varchar(30) DEFAULT NULL, -- First name of employee
  `last_name` varchar(30) DEFAULT NULL, -- Last name of employee
  `role_id` int DEFAULT NULL, -- Foreign key to role table to hold reference to employee role
  `manager_id` int DEFAULT NULL, -- Foreign key to employee table to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
  PRIMARY KEY (`id`) -- Primary key
);

INSERT INTO `employee` VALUES (1,'John','Doe',1,0),(2,'Mike','Chan',2,1),(3,'Ashley','Rodriguez',3,0),(4,'Kevin','Tupik',4,3),(5,'Kunal','Singh',5,0),(6,'Malia','Brown',6,5),(7,'Sarah','Lourd',7,0),(8,'Tom','Allen',8,7);