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

console.clear();
const init = async (message = "What would you like to do?", output = "") => {
  const questions = [
    {
      type: "list",
      name: "menu",
      message: message,
      choices: [
        "View All Departments",
        "Add Department",
        // "Delete Department",
        "View All Roles",
        "Add Role",
        // "Delete Role",
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        // "Delete Employee",
        "Quit",
      ],
      default: "view all departments",
    },
  ];
  inquirer.prompt(questions).then(async (answers) => {
    if (answers.menu === "View All Departments") {
      console.clear();
      outputTable("department").then((result) => {
        init(
          `What would you like to do? ${answers.menu}\n\n\n${result}\n? What would you like to do?`,
          result
        );
      });
    } else if (answers.menu === "Add Department") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "add_department",
            message: "What is the name of the department?",
          },
        ])
        .then(async (answers) => {
          const newDepartmentName = answers.add_department;
          db.insertIntoDepartment(newDepartmentName);
          init(
            `Added ${newDepartmentName} to the database\nWhat would you like to do?`
          );
        });
    } else if (answers.menu === "Delete Department") {
      getTableFromDB("department").then((result) => {
        let departmentNames = [];
        result.map((row) => departmentNames.push(row.name));
        inquirer
          .prompt([
            {
              type: "list",
              name: "delete_department",
              message: "Which department to delete?",
              choices: departmentNames,
            },
          ])
          .then(async (answers) => {
            const deleteDepartmentName = answers.delete_department;
            inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "confirm_delete_department",
                  message: `Are you sure you want to delete ${deleteDepartmentName}?`,
                },
              ])
              .then(async (answers) => {
                if (answers.confirm_delete_department) {
                  db.deleteFromDepartment(deleteDepartmentName);
                  init(
                    `Deleted ${deleteDepartmentName} from the database\nWhat would you like to do?`
                  );
                } else {
                  init(
                    `Did not delete ${deleteDepartmentName} from the database\nWhat would you like to do?`
                  );
                }
              });
          });
      });
    } else if (answers.menu === "View All Roles") {
      console.clear();
      outputTable("role").then((result) => {
        init(
          `What would you like to do? ${answers.menu}\n\n\n${result}\n? What would you like to do?`,
          result
        );
      });
    } else if (answers.menu === "Add Role") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "add_role_name",
            message: "What is the name of the role?",
          },
        ])
        .then(async (answers) => {
          const newRoleName = answers.add_role_name;

          inquirer
            .prompt([
              {
                type: "number",
                name: "add_role_salary",
                message: "What is the salary of the role?",
              },
            ])
            .then(async (answers) => {
              const newRoleSalary = answers.add_role_salary;

              getTableFromDB("department").then((result) => {
                let departmentNames = [];
                result.map((row) => departmentNames.push(row.name));
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "add_role_department",
                      message: "Which department does the role belong to?",
                      choices: departmentNames,
                    },
                  ])
                  .then(async (answers) => {
                    const role_id = result.find(
                      (row) => row.name === answers.add_role_department
                    ).id;
                    db.insertIntoRole(newRoleName, newRoleSalary, role_id);
                    init(
                      `Added ${newRoleName} to the database\nWhat would you like to do?`
                    );
                  });
              });
            });
        });
    } else if (answers.menu === "Delete Role") {
      getTableFromDB("role").then((result) => {
        let roleNames = [];
        result.map((row) => roleNames.push(row.title));
        inquirer
          .prompt([
            {
              type: "list",
              name: "delete_role",
              message: "Which role to delete?",
              choices: roleNames,
            },
          ])
          .then(async (answers) => {
            const deleteRoleName = answers.delete_role;
            inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "confirm_delete_role",
                  message: `Are you sure you want to delete ${deleteRoleName}?`,
                },
              ])
              .then(async (answers) => {
                if (answers.confirm_delete_role) {
                  db.deleteFromRole(deleteRoleName);
                  init(
                    `Deleted ${deleteRoleName} from the database\nWhat would you like to do?`
                  );
                } else {
                  init(
                    `Did not delete ${deleteRoleName} from the database\nWhat would you like to do?`
                  );
                }
              });
          });
      });
    } else if (answers.menu === "View All Employees") {
      console.clear();
      outputTable("employee").then((result) => {
        init(
          `What would you like to do? ${answers.menu}\n\n\n${result}\n? What would you like to do?`,
          result
        );
      });
    } else if (answers.menu === "Add Employee") {
      inquirer // get the first name of the employee
        .prompt([
          {
            type: "input",
            name: "add_first_name",
            message: "What is the employee's first name?",
          },
        ])
        .then(async (first_answers) => {
          // get the answer from the first name question
          const newFirstName = first_answers.add_first_name; // set variable to the answer

          inquirer // get the last name of the employee
            .prompt([
              {
                type: "input",
                name: "add_last_name",
                message: "What is the employee's last name?",
              },
            ])
            .then(async (last_answers) => {
              // get the answer from the last name question
              const newLastName = last_answers.add_last_name; // set variable to the answer

              getTableFromDB("role").then((result) => {
                let roleNames = [];
                result.map((row) => roleNames.push(row.title));
                inquirer // get the role of the employee
                  .prompt([
                    {
                      type: "list",
                      name: "add_role",
                      message: "What is the employee's role?",
                      choices: roleNames,
                    },
                  ])
                  .then(async (answers) => {
                    const role_id = result.find(
                      (row) => row.title === answers.add_role
                    ).id;

                    getTableFromDB("employee").then((result) => {
                      let employeeNames = [];
                      result.map((row) => {
                        employeeNames.push(
                          `${row.first_name} ${row.last_name}`
                        );
                      });
                      inquirer // get the role of the employee
                        .prompt([
                          {
                            type: "list",
                            name: "add_manager",
                            message: "Who is the employee's manager?",
                            choices: employeeNames,
                          },
                        ])
                        .then(async (answers) => {
                          const splitName = answers.add_manager.split(" ");
                          const manager_id = result.find(
                            (row) =>
                              row.first_name === splitName[0] &&
                              row.last_name === splitName[1]
                          ).id;
                          db.insertIntoEmployee(
                            newFirstName,
                            newLastName,
                            role_id,
                            manager_id
                          );
                          init(
                            `Added ${newFirstName} ${newLastName} to the database\nWhat would you like to do?`
                          );
                        });
                    });
                  });
              });
            });
        });
    } else if (answers.menu === "Update Employee Role") {
      console.clear();
      getTableFromDB("employee").then((result) => {
        let employeeNames = [];
        result.map((row) => {
          employeeNames.push(`${row.first_name} ${row.last_name}`);
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "update_employee",
              message: "Which employee's role do you want to update?",
              choices: employeeNames,
            },
          ])
          .then(async (answers) => {
            const splitName = answers.update_employee.split(" ");
            const employee_id = result.find(
              (row) =>
                row.first_name === splitName[0] &&
                row.last_name === splitName[1]
            ).id;

            getTableFromDB("role").then((result) => {
              let roleNames = [];
              result.map((row) => roleNames.push(row.title));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "update_role",
                    message: "What is the employee's new role?",
                    choices: roleNames,
                  },
                ])
                .then(async (answers) => {
                  const role_id = result.find(
                    (row) => row.title === answers.update_role
                  ).id;
                  inquirer // get the manager of the employee
                    .prompt([
                      {
                        type: "list",
                        name: "add_manager",
                        message: "Who is the employee's manager?",
                        choices: employeeNames,
                      },
                    ])
                    .then(async (answers) => {
                      const splitName = answers.add_manager.split(" ");
                      const manager_id = result.find(
                        (row) =>
                          row.first_name === splitName[0] &&
                          row.last_name === splitName[1]
                      ).id;
                      db.updateEmployeeRole(employee_id, role_id, manager_id);
                      init(
                        `Updated ${answers.update_employee}'s role to ${answers.update_role}\nWhat would you like to do?`
                      );
                    });
                });
            });
          });
      });
    } else if (answers.menu === "Delete Employee") {
      console.clear();
      getTableFromDB("employee").then((result) => {
        let employeeNames = [];
        result.map((row) => {
          employeeNames.push(`${row.first_name} ${row.last_name}`);
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "delete_employee",
              message: "Which employee do you want to delete?",
              choices: employeeNames,
            },
          ])
          .then(async (answers) => {
            const splitName = answers.delete_employee.split(" ");
            const employee_id = result.find(
              (row) =>
                row.first_name === splitName[0] &&
                row.last_name === splitName[1]
            ).id;
            inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "confirm_delete",
                  message: `Are you sure you want to delete ${answers.delete_employee}?`,
                },
              ])
              .then(async (answers) => {
                if (answers.confirm_delete) {
                  db.deleteEmployee(employee_id);
                  init(
                    `Deleted ${answers.delete_employee} from the database\nWhat would you like to do?`
                  );
                } else {
                  init("What would you like to do?");
                }
              });
          });
      });
    } else if (answers.menu === "Quit") {
      db.closeConnection();
      console.clear();
      console.log("Goodbye!");
      process.exit();
    }
  });
};

init();

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
