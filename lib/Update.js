const mysql = require('mysql2');

const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sqlMarshall716',
    database: 'employeeTracker_db'
  });
  
  connection.connect(function(err) {
      if (err) throw err;
    });

    

class Update {
    constructor(answers) {
        const {employeName, newRole} = answers;
        this.employeName = employeName;
        if (!this.employeName || !this.employeName) {
        } else { 
            this.employeeFirstName =  this.employeName.split(' ').shift()
            this.employeeLastName = this.employeName.split(' ').pop()
        }
        this.newRole = newRole;
    }

    getUpdateEmployee() {

        return connection.promise().query(
            `UPDATE employee, (select id from employee where first_name = '${this.employeeFirstName}' and last_name = '${this.employeeLastName}') AS employeeTarget
            SET role_id = (select id FROM role where title = '${this.newRole}')
            WHERE employee.id = employeeTarget.id;`
            ,
)           .then( ([rows,fields]) => {
                const table = cTable.getTable(rows);
                let outputReturn = `Record for: ${this.employeeFirstName} ${this.employeeLastName} has been updated. New role is ${this.newRole}.`
                return outputReturn
              })
              .catch(console.log)
    }
}

module.exports = Update