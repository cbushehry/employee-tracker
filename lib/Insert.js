const mysql = require('mysql2');

const cTable = require('console.table');
 

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sqlMarshall716',
    database: 'employeeTracker_db'
  });
  
  connection.connect(function(err) {
      if (err) throw err;
    });


class Insert {
    constructor(answers, output) {
        const {departmentName, roleTitle, salary, roleDepartment, departmentId, firstName, lastName, employeeRole, employeeManager} = answers;
        this.firstName = firstName;
        this.lastName = lastName;
        this.employeeRole = employeeRole;
        this.employeeManager = employeeManager; 
        if (!this.employeeManager) { 
        } else { 
            this.employeeManagerName =  this.employeeManager.split(' ').shift()
            this.employeeManagerLastName = this.employeeManager.split(' ').pop()
        }
        this.departmentName = departmentName;
        this.roleTitle = roleTitle;
        this.salary = salary;
        let outputTest = []
        outputTest = output; 
        if (!outputTest) {
        } else {
            outputTest.filter(({ id }) => id)
            .map(({ id }) => {
            this.id = id;
        });
        }
    }

    getInsertDepartment() {
    
        return connection.promise().query(
            `INSERT INTO department SET ?;`,
            {
                name: `${this.departmentName}`
            })
            .then( ([rows,fields]) => {
              })
              .catch(console.log)
    }

    getInsertRole() {

        connection.query(
            `INSERT INTO role SET ?;`,
            {
                title: `${this.roleTitle}`,
                salary: Number(`${this.salary}`),
                department_id: Number(`${this.id}`)
            },
            function(err, results, fields) {
              if (err) throw err;
            }
        );
    }

    getInsertEmployee() {
        
        return connection.promise().query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ('${this.firstName}', '${this.lastName}', (select distinct r.id as id from role r WHERE r.title = '${this.employeeRole}'), (select distinct e.id as id from employee e WHERE e.first_name = '${this.employeeManagerName}' and e.last_name = '${this.employeeManagerLastName}'));`)
            .then( ([rows,fields]) => {
                const table = cTable.getTable(rows);
                return rows
              })
              .catch(console.log)
        }
        
}

module.exports = Insert