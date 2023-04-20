const Database = require("./assets/js/database"); // import the database class
const cTable = require("console.table"); // import console.table
const inquirer = require("inquirer"); // import inquirer

const db = new Database(); // create a new instance of the database class

const getTableFromDB = async (table) => {
  // Function to get a table from the database
  return await db
    .connectToDatabase() // connect to the database
    .then(async () => {
      // if connection is successful, then

      const [rows, fields] = await db.queryDatabase(table); // query the table
      // if query is successful, then
      // console.log(rows);
      if (table === "department") {
        departments = rows;
      } else if (table === "role") {
        roles = rows;
      } else if (table === "employee") {
        employees = rows;
      }
      return rows; // return the rows
    }) // connect to the database
    // .then(() => db.closeConnection()) // close the connection
    .catch((err) => console.error(err)); // if connection is unsuccessful, then log the error
};

const outputTable = async (table) => {
  // Function to output a table to the console
  // console.log(departments);
  let departments = await getTableFromDB("department"); // get the table from the database
  let roles = await getTableFromDB("role"); // get the table from the database

  roles.forEach((row, index) => {
    // reordering the keys
    roles[index] = {
      id: row.id,
      title: row.title,
      department: departments[row["department_id"] - 1]["name"],
      salary: row.salary,
    };
  });

  let employees = await getTableFromDB("employee"); // get the table from the database

  employees.forEach((row, index) => {
    if (row.manager_id === 0) {
      // if the manager_id is 0, then
      row.manager_id = "null"; // set the manager_id to null
    } else {
      // if the manager_id is not 0, then
      row.manager_id = `${employees[row["manager_id"] - 1]["first_name"]} ${
        employees[row["manager_id"] - 1]["last_name"]
      }`; // set the manager to the manager's name
    }

    // add the role information to the employee
    row.title = roles[row.role_id - 1].title; // create a new key of title from the role table
    row.department = roles[row.role_id - 1].department; // create a new key of department from the role table
    row.salary = roles[row.role_id - 1].salary; // create a new key of salary from the role table

    // reordering the keys
    employees[index] = {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      title: row.title,
      department: row.department,
      salary: row.salary,
      manager: row.manager_id,
    };
  });

  if (table === "department") {
    return (output = cTable.getTable(departments)); // create a table from the rows to create a structured console.log
  } else if (table === "role") {
    return (output = cTable.getTable(roles)); // create a table from the rows to create a structured console.log
  } else if (table === "employee") {
    return (output = cTable.getTable(employees)); // create a table from the rows to create a structured console.log
    // console.log(output); // log the rows
  }
};

// outputTable("department"); // output the department table
// console.log(outputTable("department"));
// outputTable("role"); // output the role table
// console.log(outputTable("role"));
// outputTable("employee"); // output the employee table
// console.log(outputTable("employee"));

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department

// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
