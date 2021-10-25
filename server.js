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
    password: 'sqlMarshall716',
    database: 'employeeTracker_db'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.clear();
    console.log(this.appLogo);
    new RunApplication().getInquirerOptions();
  });

  class RunApplication {
    constructor () {
        // *** N/A for this app. Could be used for the future. *** //
  
        this.appLogo = `
        ╔═╗┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ╔╦╗┬─┐┌─┐┌─┐┬┌─┌─┐┬─┐
        ║╣ │││├─┘│  │ │└┬┘├┤ ├┤    ║ ├┬┘├─┤│  ├┴┐├┤ ├┬┘
        ╚═╝┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘   ╩ ┴└─┴ ┴└─┘┴ ┴└─┘┴└─
                        ╔═╗╔═╗╔═╗                      
                        ║ ║║ ║╠═╝                      
                        ╚═╝╚═╝╩                              
        \n`
        console.clear();
        console.log(this.appLogo)
        
      }
  
      getInquirerOptions() {
  
            // Clear console.log
            //console.clear()
            //console.log(this.appLogo)
            return inquirer
            .prompt([
              {
                type: 'list',
                name: 'queryType',
                message: "What would you like to do?",
                choices: ['View All Departments','View All Roles', 'View All employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update Employee Role', 'View All Employees By Department', 'View All Employees by Manager', 'Exit Application']
              }
            ])

            .then(answers => {
 
                const resultSet = new Sql(answers)
             
              switch(resultSet.queryType) {
                case "View All Departments":
 
 
                console.clear() 
                  console.log(this.appLogo)
                  async function viewAllDepartments() {
                    return resultSet.getViewAllDepartments();
                  }
                  viewAllDepartments().then(output => {
                  
                    this.getInquirerOptions();
                  });  
                  break;
  
                case "View All Roles":
                  console.clear() 
                  console.log(this.appLogo)
                  async function viewAllRoles() {
                    return resultSet.getViewAllRoles();
                  }
                  viewAllRoles().then(output => {

                    this.getInquirerOptions();
                  });  
                  break;
  
                case "View All employees":
                  console.clear() 
                  console.log(this.appLogo)
                  async function viewAllEmployees() {
                    return resultSet.getViewAllEmployees();
                  }
                  viewAllEmployees().then(output => {

                    this.getInquirerOptions();
                  }); // 1               
                  break;
  
                case "Add a Department":

                console.clear() 
                  console.log(this.appLogo)
                  this.addDepartment();
                  break;
  
                case "Add a Role":
                  this.addRole()
                  break;
  
                case "Add An Employee":
                  this.addEmployee()
                  break;
  
                case "Update Employee Role":
                  this.updateEmployeRole();
                  break;
  
                   
                case "View All Employees By Department":
  
                  async function runQueryEmployeeByDepartment() {
                    return resultSet.getViewAllEmployeesByDeparment()
                  }
                  runQueryEmployeeByDepartment().then(output => {
                    console.clear();
                    console.log(this.applicationLogo);
                    console.log(output);
                    this.getInquirerOptions();
                  });  
                  break;
  
                case "View All Employees by Manager":
                  
                  async function runQueryEmployeeByManager() {
                    return resultSet.getViewAllEmployeesByManager();
                  }
                  runQueryEmployeeByManager().then(output => {
                    console.clear();
                    console.log(this.applicationLogo);
                    console.log(output);
                    this.getInquirerOptions();
                  });     
                  break;
  
                 case "Exit Application":             
                 break;              
              }
            })
      }
  
     
      addDepartment() {
        
       return inquirer
        .prompt([
          {
            type: 'input',
            name: 'departmentName',
            message: "What is the department name?",
            validate: departmentName => {
                if (departmentName) {
                  return true;
                } else {
                  console.log("Please enter the department's name");
                  return false;
                }
              }
        }
        ])
        .then(answers => {
          
          const resultSet = new Insert(answers )
          async function runInsert() {
            return resultSet.getInsertDepartment();
          }
          runInsert().then(output => {
            this.getInquirerOptions();
          });        
        });
  
      }
  
  
      addRole() {
  

        const queryName = "View All Departments"
        const resultSet = new Sql(queryName)
        async function viewAllDepartments() {
          return resultSet.getViewAllDepartmentsNames();
        }
  
        viewAllDepartments().then(output => {
  
        inquirer
        .prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: "What is the role title?",
            validate: employeeName => {
                if (employeeName) {
                  return true;
                } else {
                  console.log("Please enter the role's title");
                  return false;
                }
              }
        },
        {
          type: 'input',
          name: 'salary',
          message: `What is the role's salary (Number with up to two decimal places)?`,
          validate: employeeName => {
              if (Number(employeeName)) {
                return true;
              } else {
                console.log("Please enter role's salary in numbers.");
                return false;
              }
            }
        },
        {
          type: 'list',
          name: 'roleDepartment',
          message: "To what department this role should be assigned to ?",
          choices: output
        },
        ])

        .then(answers => {


            const resultDepIdByName = new Sql(answers)
         let resultDepIdByNameOutput = ""

         async function selectQuery() {
            return resultDepIdByName.getViewAllDepartmentsIdByName();
          }
          selectQuery().then(output => {
            let outputTest = []
            outputTest = output;
            outputTest.filter(({ id }) => id)
            .map(({ id }) => {
            
              outputTest = id
  
            });
  
            const InsertRecord = new Insert(answers, output)
            async function selectQuery() {
              return InsertRecord.getInsertRole();;
            }
            selectQuery().then(output => {
              console.clear();
              console.log(this.appLogo);
              console.log("Record Inserted\n");
              this.getInquirerOptions();
            });
          });    
        });
      }); 
    };
  
      addEmployee() {
  
        const queryName = "View All Departments"
        const resultSet = new Sql(queryName)
        
  
        async function mutipleQuery() {
          return resultSet.getMultipleQuery();
        }
  
        mutipleQuery().then(output => {
  
          
          let employeeRoleObject = output[0]
          let employeeManagerObject = output[1]


          output[1].push({name: 'No Manager'});
          
          
        inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: firstName => {
                if (firstName) {
                  return true;
                } else {
                  console.log("Please enter employee first name");
                  return false;
                }
              }
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name?",
          validate: lastName => {
              if (lastName) {
                return true;
              } else {
                console.log("Please enter employee's last name");
                return false;
              }
            }
        },
        {
          type: 'list',
          name: 'employeeRole',
          message: "To what department this role should be assigned to ?",
          choices: employeeRoleObject
        },
      {
        type: 'list',
        name: 'employeeManager',
        message: "To what manager would you like the user to be added to?",
        choices: employeeManagerObject
      }
        ])
        
        .then(answers => {
      
          const InsertRecord = new Insert(answers)
          async function insertQuery() {
            return InsertRecord.getInsertEmployee();
          }
          insertQuery().then(output => {
           
           console.clear();
            console.log(this.appLogo);
            console.log("Record Inserted\n");
            this.getInquirerOptions();
          });
        });
      });
    };
  
    updateEmployeRole() {
      
      const queryName = "View All Departments"
      const resultSet = new Sql(queryName)
      async function multipleQuery() {
        return resultSet.getMultipleQuery();
      }
      multipleQuery().then(output => {
        
        let employeeList = output[2]
        let roleList = output[3]
  
  
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeName',
            message: "Please choose an employee to update their role",
            choices: employeeList
          },
          {
            type: 'list',
            name: 'newRole',
            message: "Please enter a new role?",
            choices: roleList
          }
        ])
        .then(answers => {
  
          const InsertRecord = new Update(answers)
          async function updateQuery() {
            return InsertRecord.getUpdateEmployee();
          }
          updateQuery().then(output => {
            console.clear();
            console.log(this.appLogo);
            console.log(output + '\n');
            
            this.getInquirerOptions();
          })
        })
      })
    }
  }








