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
  init();
  function init() {
  connection.connect(function(err) {
    if (err) throw err;
    await inquirer.prompt(
        {
            type: "list",
            message: "Hi user, what could I help you with today?",
            name: "action",
            choices:["Add departments, roles, employees", "View departments, roles, employees", "Update employee roles"]
        }
    ).then((data)=>{
        switch(data.action){
        case "Add departments, roles, employees":
            addNewItem();
            break;
        case "View departments, roles, employees":
            viewItem();
            break;
        case "Update employee roles":
            updateRole();
        }
    });
  });
  };
function addNewItem() {
    await inquirer.prompt(
        {
            type: "list",
            message: "Which item would you like to add?",
            name: "item",
            choices:["Department", "Role", "Employee"]
        }
    ).then((data)=>{
        switch(data.item){
            case "Department":
                inquirer.prompt({
                    type: "input",
                    message:"Please enter the name of the department.",
                    name: "department"
                }).then((data)=>{
                    connection.query('Insert into department set ?', {name: data.department}, function(err, result, fields){
                        if (err) throw err;
                        console.log(`New Department ${data.department} has been added to the table.`);
                    })
                });
                break;
            case "Role":
                inquirer.prompt({
                    type: "input",
                    message:"Please enter the name of the role.",
                    name: "role"
                }).then((data)=>{
                    connection.query('Insert into role set ?', {name: data.role}, function(err, result, fields){
                        if (err) throw err;
                        console.log(`New role ${data.role} has been added to the table.`);
                    })
                });
                break;
            case "Employee":
                inquirer.prompt(
                    [{
                    type: "input",
                    message:"Please enter the first name of the employee.",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "Please enter the last name of the employee.",
                    name: "lastName"
                }
            ]).then((data)=>{
                    connection.query('Insert into employee set ?', {first_name: data.firstName, last_name: data.lastName}, function(err, result, fields){
                        if (err) throw err;
                        console.log(`New employee ${data.firstName} ${data.lastName} has been added to the table.`);
                    })
                });                
        }
    });
    connection.end();
    init();
};

function viewItem(){
    await inquirer.prompt({
        type: "list",
        message: "What would you like to view?",
        name: "item",
        choices:["Department", "Role", "Employee"]
    }).then((data)=>{
        switch (data.item){
            case "Department":
                connection.query('Select * from department', function(err, result, field){
                    if (err) throw err;
                    let result = JSON.parse(result);
                    console.log(result);
                });
                break;
            case "Role":
                connection.query('Select * from role', function(err, result, field){
                    if (err) throw err;
                    let result = JSON.parse(result);
                    console.log(result);
                });
                break;   
            case "Employee":
                connection.query('Select * from employee', function(err, result, field){
                    if (err) throw err;
                    let result = JSON.parse(result);
                    console.log(result);
                });
        }
    });
    connection.end();
    init();
};

function updateRole(){
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
    connection.end();
    init();
};