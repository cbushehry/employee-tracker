const mysql = require('mysql2');
const inquirer = require('inquirer');

// Import employee class
const Sql = require('./lib/Sql');
// Import Insert class
const Insert = require('./lib/Insert');
// Import Update class
const Update = require('./lib/Update');


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cantimploras87=',
    database: 'employeeTracker_db'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.clear();
    console.log(this.appLogo);
    new RunApplication().getInquirerOptions();
  });










