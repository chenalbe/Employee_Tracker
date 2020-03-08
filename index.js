const inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "rootpass",
    database: "employee_db"
  });
  connection.connect(function(err) {
    if (err) throw err;
  });
function init() {

    inquirer.prompt(
        {
            type: "list",
            message: "Hi user, what could I help you with today?",
            name: "action",
            choices:[
                "View all Department",
                "View all Roles",
                "View all Employees",
                "Add new Department",
                "Add new Role",
                "Add new Employee",
                "Update Role for Employee"
            ]
        }
    ).then((data)=>{
        switch(data.action){
        case "View all Department":
            viewDepartment();
            break;
        case "View all Roles":
            viewRole();
            break;
        case "View all Employees":
            viewEmployee();
            break;
        case "Add new Department":
            addNewDept();
            break;
        case "Add new Role":
            addNewRole();
            break;
        case "Add new Employee":
            addNewEmployee();
            break;
        case "Update Role for Employee":
            updateRole();
        }
    });
  };
 async function addNewDept(){
    await inquirer.prompt({
        type: "input",
        message:"Please enter the name of the department.",
        name: "department"
    }).then((data)=>{
        connection.query('Insert into department set ?', {name: data.department}, function(err, result, fields){
            if (err) throw err;
            console.log(`New Department ${data.department} has been added to the table.`);
        })
    });
    init();
 };
function addNewRole(){
    let array = [];
    const query = "SELECT id as value, name as name FROM department";
    connection.query(query, function (err, res) {
      if (err) throw err;
      array = JSON.parse(JSON.stringify(res));
      const questions = [
        {
          type: "input",
          name: "name",
          message: "What is the name of the new role?"
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this new role?",
        },
        {
          type: "list",
          name: "department",
          message: "To which department does the new roll belong?",
          choices: array
        }];
  
      inquirer.prompt(questions).then(answer => {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [answer.name, answer.salary, answer.department], function (err, res) {
            if (err) throw err;
            if (res.affectedRows > 0) {
              console.log(res.affectedRows + " record added successfully!");
            }
            console.log("");
            init();
          });
      });
    });
};
function addNewEmployee() {
    let array = [];
    const query = "SELECT id as value, title as name FROM role";
    connection.query(query, function (err, res) {
      if (err) throw err;
      array = JSON.parse(JSON.stringify(res));
      const questions = [
        {
          type: "input",
          name: "firstName",
          message: "What is the first name of the new employee?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the last name of the new employee?"
          },
        {
          type: "list",
          name: "roleID",
          message: "Please choose the tole for the new employee.",
          choices: array
        }];
  
      inquirer.prompt(questions).then(answer => {
        connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
          [answer.firstName, answer.lastName, answer.roleID], function (err, res) {
            if (err) throw err;
            if (res.affectedRows > 0) {
              console.log(res.affectedRows + " record added successfully!");
            }
            console.log("");
            init();
          });
      });
    });
};
function viewDepartment(){
    connection.query('Select * from department', function(err, result, field){
        if (err) throw err;
        console.log('\n');
        console.table(result);
        console.log("");
    });
    init();
};
function viewRole(){
    connection.query('Select * from role', function(err, result, field){
        if (err) throw err;
        console.log('\n');
        console.table(result);
        console.log("");
    });
    init();
};
function viewEmployee(){
    connection.query('Select * from employee', function(err, result, field){
        if (err) throw err;
        console.log('\n');
        console.table(result);
        console.log("");
    });
    init();
};

function updateRole(){
    let roleID = [];
    let employeeList = [];
    connection.query(`select concat(first_name, ' ', last_name) as name, id as value from employee`, function(err, result){
        if (err) throw err;
        employeeList = JSON.parse(JSON.stringify(result));
        inquirer.prompt({
            type: "list",
            message: "Please choose the employee for the role update.",
            name: "name",
            choices: employeeList
        }).then((answerName)=>{
            connection.query('SELECT id as value, title as name from role', function(err, result){
                if (err) throw err;
                roleID = JSON.parse(JSON.stringify(result));
                inquirer.prompt({
                    type: "list",
                    message: "Please choose the new title.",
                    name: "newTitle",
                    choices: roleID
                }).then((answer2)=>{
                    connection.query('update employee set role_id = ? where id = ?', [answer2.newTitle, answerName.name], function(err, res){
                        if (err) throw err;
                        console.log("Update successful!");
                        init();
                    });

                })
            });
        });
    });
};
init();