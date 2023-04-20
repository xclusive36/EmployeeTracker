require("dotenv").config(); // load .env file into process.env to access hidden environment variables
const mysql = require("mysql2/promise"); // import mysql2

class Database {
  // create a class to handle database connection and queries
  constructor() {
    // create a constructor
    this.table = null; // set the table name to null initially
    this.connection = null; // set the connection to null initially
  }

  async connectToDatabase() {
    // create a method to connect to the database
    return (this.connection = await mysql.createConnection({
      // create a connection to the database
      host: "localhost", // set the host as localhost
      user: process.env.MYSQL_LOGIN, // set the user as the environment variable MYSQL_LOGIN from .env file
      password: process.env.MYSQL_PASSWORD, // set the password as the environment variable MYSQL_PASSWORD from .env file
      database: process.env.MYSQL_DATABASE, // set the database as the environment variable MYSQL_DATABASE from .env file
    }));
  }

  async queryDatabase(table) {
    // create a method to query the database

    return this.connection.query(`SELECT * FROM ${table}`); // query the database
  }

  async insertIntoDepartment(departmentName) {
    // create a method to insert into the department table
    return await this.connection.execute(
      // execute the query
      `INSERT INTO department (name) VALUES ('${departmentName}')` // insert into the department table
    );
  }

  async deleteFromDepartment(departmentName) {
    // create a method to delete from the department table
    return await this.connection.execute(
      // execute the query
      `DELETE FROM department WHERE name = '${departmentName}'` // delete from the department table
    );
  }

  async insertIntoRole(title, salary, department_id) {
    // create a method to insert into the role table
    return await this.connection.execute(
      // execute the query
      `INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', '${department_id}')` // insert into the role table
    );
  }

  async deleteFromRole(title) {
    // create a method to delete from the role table
    return await this.connection.execute(
      // execute the query
      `DELETE FROM role WHERE title = '${title}'` // delete from the role table
    );
  }

  async insertIntoEmployee(first_name, last_name, role_id, manager_id) {
    // create a method to insert into the employee table
    return await this.connection.execute(
      // execute the query
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', '${role_id}', '${manager_id}')` // insert into the employee table
    );
  }

  async deleteFromEmployee(first_name, last_name) {
    // create a method to delete from the employee table
    return await this.connection.execute(
      // execute the query
      `DELETE FROM employee WHERE first_name = '${first_name}' AND last_name = '${last_name}'` // delete from the employee table
    );
  }

  async closeConnection() {
    // create a method to close the connection
    if (!this.connection) {
      // check if the connection is null
      throw new Error("Database is not connected"); // throw an error if the connection is null
    } else {
      // if the connection is not null
      await this.connection.end(); // end the connection
      this.connection = null; // set the connection variable to null
    }
  }
}

module.exports = Database; // export the Database class
