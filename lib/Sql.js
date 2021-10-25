const RunApplication = require('../server')

    const mysql = require('mysql2');

    const cTable = require('console.table');
   
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sqlMarshall716',
        database: 'employeeTracker_db',
        multipleStatements: true 
      });

      connection.connect(function(err) {
          if (err) throw err;
        });


class Sql {

  constructor(answers) {

  const {queryType, roleDepartment} = answers;
      this.queryType = queryType;
      this.roleDepartment = roleDepartment;
  }

  getMultipleQuery () {

    return connection.promise().query(`
    select r.title AS name from role AS r inner join department AS d on r.department_id = d.id; 
    select  DISTINCT CONCAT(e.first_name, ' ' , e.last_name) AS name
            from employee AS e    
            ORDER BY e.first_name;
    select CONCAT(e.first_name, ' ' , e.last_name) AS name from employee e ORDER BY name;
    select DISTINCT title as name from role ORDER BY name`)
    .then( ([rows,fields]) => {

        const table = cTable.getTable(rows);
      return rows
    })
    .catch(console.log)
  }
  
  getViewAllEmployees() {
    return connection.promise().query(
      `select e.first_name, e.last_name, r.title, dep.name AS department, 
      r.salary,
      IFNULL(CONCAT(m.first_name, ' ' , m.last_name), 'No Manager') AS 'manager'
      from employee AS e
      INNER JOIN role AS r ON e.role_id = r.id 
      INNER JOIN department AS dep ON r.department_id = dep.id
      LEFT JOIN employee AS m ON m.id = e.manager_id
      ORDER BY e.first_name;`
      )
      .then( ([rows,fields]) => {
        const table = cTable.getTable(rows);
        console.log(table);
      })
      .catch(console.log)
  }

  getViewAllDepartmentsNames() {  
    return connection.promise().query(
      `select name from department dep;`
    ) 
    .then( ([rows,fields]) => {
      const table = cTable.getTable(rows);
      return rows
    })
    .catch(console.log)
  }

  getViewAllDepartmentsIdByName() {
    return connection.promise().query(
      `select DISTINCT d.id from department d WHERE d.name = '${this.roleDepartment}';`
    ) 
    .then( ([rows,fields]) => {
      const table = cTable.getTable(rows);
      return rows
    })
    .catch(console.log) 
  }

getViewAllDepartments() {
  return connection.promise().query(

    `select id, name from department dep;`
  ) 
  .then( ([rows,fields]) => {
    const table = cTable.getTable(rows);
    console.log(table);
  })
  .catch(console.log)
}

  getViewAllRoles() {
    return connection.promise().query(
      `select r.title, r.id AS 'role id', d.name AS 'department name', r.salary AS 'salary' from role AS r
      inner join department AS d on r.department_id = d.id;`
      
    )
    .then( ([rows,fields]) => {
      const table = cTable.getTable(rows);
      console.log(table);
    })
    .catch(console.log)
  }

  getAddRole() {

    connection.query(
      `select * from department role;`,
      function(err, results, fields) {
        const table = cTable.getTable(results);
        console.table(table);
      }
    );
  };
      
  getViewAllEmployeesByDeparment() {
    return connection.promise().query(
      `select dep.name AS department, e.first_name, e.last_name
      from employee AS e
      INNER JOIN role AS r ON e.role_id = r.id 
      INNER JOIN department AS dep ON r.department_id = dep.id
      LEFT JOIN employee AS m ON m.id = e.manager_id
      ORDER BY department;`)
      .then( ([rows,fields]) => {
        const table = cTable.getTable(rows);
        return table;
      })
      .catch(console.log)
  }

  getViewAllEmployeesByManager() {
    return connection.promise().query(
      `select IFNULL(CONCAT(m.first_name, ' ' , m.last_name), 'No Manager') AS 'manager', e.first_name, e.last_name
      from employee AS e
      INNER JOIN role AS r ON e.role_id = r.id 
      INNER JOIN department AS dep ON r.department_id = dep.id
      INNER JOIN employee AS m ON m.id = e.manager_id
      ORDER BY manager;`)
      .then( ([rows,fields]) => {
        const table = cTable.getTable(rows);
        return table;
      })
      .catch(console.log)
  }

  getRole() {
      return 'Employee'
  }

}
module.exports = Sql

