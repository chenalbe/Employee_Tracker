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
 async function init() {

    await inquirer.prompt(
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
async function addNewRole(){
    let deptID = [];
    connection.query('select name from department', function(err, result){
        if (err) throw err;
        for (let i=0; i<result.length; i++){
            deptID.push(JSON.parse(result[i]));
        }
    })
    await inquirer.prompt({
        type: "input",
        message:"Please enter the name of the role.",
        name: "role"
    },
    {
        type: "input",
        message: "Please enter the salary.",
        name: "salary" 
    },
    {
        type: "list",
        message: "Please choose the department",
        name: "departmentName",
        choices:[deptID]
    }).then((data)=>{
        let deptID;
        let title = data.role;
        let salary = data.salary;
        connection.query('select id from department where name = ?', data.departmentName, function(err, result){
            if(err) throw err;
            deptID = result;
        });
        connection.query('Insert into role set ?', {title: title, salary: salary, department_id: deptID }, function(err, result, fields){
            if (err) throw err;
            console.log(`New role ${data.role} has been added to the table.`);
        })
    });
    init();
};
async function addNewEmployee() {
    let roles = [];
    connection.query('Select title from role', function(err, result, field){
        for (let i = 0; i<result.length; i++){
            let roleTempt = JSON.parse(result[i]);
            roles.push(roleTempt);
        }
    });

    await inquirer.prompt(
        [{
        type: "input",
        message:"Please enter the first name of the employee.",
        name: "firstName"
    },
    {
        type: "input",
        message: "Please enter the last name of the employee.",
        name: "lastName"
    },
    {
        type: "list",
        message: "Please choose the title.",
        name:"role",
        choices: [roles]
    }, 
    {
        type: "Input",
        message: "Enter the Manager's ID if applicable?",
        name: "manager"
    }
]).then((data)=>{
    let firstName = data.firstName;
    let lastName = data.lastName;
    let managerID = data.manager;
    let roleID;
    connection.query('select id from role where title =?', data.role, function(err, result){
        roleID = result.id;
        });
        connection.query('Insert into employee set ?', {first_name: firstName, last_name: lastName, role_id : roleID, manager_id : managerID}, function(err, result, fields){
            if (err) throw err;
            console.log(`New employee ${data.firstName} ${data.lastName} has been added to the table.`);
    });
    });
    init();
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
        console.table(res);
        console.log("");
    });
    init();
};
function viewEmployee(){
    connection.query('Select * from employee', function(err, result, field){
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log("");
    });
    init();
};

async function updateRole(){
    await inquirer.prompt(
        [{
        type: "input",
        message: "Please enter the last name of the employee.",
        name: "last_name"
    },
    {
        type: "input",
        message: "Please enter the first name of the employee.",
        name: "first_name"
    },
    {
        type:"input",
        message: "Please enter the new role for the employee.",
        name: "role"
    }
    ]).then((data)=>{
        let firstName = data.first_name;
        let lastName = data.last_name;
        let role = data.role;
        connection.query('select id from role where title =?', role, function(err, result, field){
            if (err) throw err;
            let id = parseInt(result);
            connection.query('Update employee set role_id = ? where first_name = ? and last_name = ?', [id, firstName, lastName], function(err, result, field){
                if (err) throw err;
                console.log(`You have updated ${firstName} ${lastName}'s role into ${role}`);
            })
        })
    })
    init();
};

init();