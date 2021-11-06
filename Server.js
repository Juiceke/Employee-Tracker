const inquirer = require("inquirer");
const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
const cTable = require("console.table");

// create a connection
const Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "DavidHunter722!",
  database: "Tracker",
  waitForConnections: true,
});

//make the initial questioning
const initialQuestion = () => {
  return inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "quit",
      ],
      name: "initialQuestion",
    },
  ]);
};

const followUp = (answers) => {
  const answer = answers.initialQuestion;
  if (answer === "view all departments") {
    //send database to console
    Connection.query(`SELECT * FROM Department`, (err, results) => {
      console.table(results);
      //loop the questions
      initialQuestion().then((answers) => {
        followUp(answers);
      });
    });
  }
  if (answer === "view all roles") {
    Connection.query(`SELECT * FROM Role`, (err, results) => {
      console.table(results);
      initialQuestion().then((answers) => {
        followUp(answers);
      });
    });
  }
  if (answer === "view all employees") {
    const sql = `
    SELECT employee.id,
           employee.first_name,
           employee.last_name,
           role.title,
           role.salary,
           CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
           LEFT JOIN role ON employee.role_id = role.id
           LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;
    Connection.query(sql, (err, results) => {
      console.table(results);
      initialQuestion().then((answers) => {
        followUp(answers);
      });
    });
  }
  if (answer === "add a department") {
    let selection = "department";
    addDepartment(selection)
      .then((Answers) => {
        addingDepartment(Answers);
      })
      .then(() => {
        console.log("Department added!");
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "add a role") {
    let selection = "role";
    addRole(selection)
      .then((Answers) => {
        addingRole(Answers);
        console.log("Role added!");
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "add an employee") {
    addEmployee()
      .then((answers) => {
        AddingEmployee(answers);
        console.log("Employee added!");
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "update an employee role") {
    updateEmployee()
      .then((Answers) => {
        updatingEmployee(Answers);
      })
      .then((Answers) => {
        console.log("Employee updated!");
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "quit") {
    return;
  }
};

// functions that will be called upon when user selects an add decision
const addDepartment = (selection) => {
  return inquirer.prompt([
    {
      type: "input",
      name: "add",
      message: `enter the name of the ${selection}:`,
    },
  ]);
};

const addRole = (selection) => {
  return inquirer.prompt([
    {
      type: "input",
      name: "addName",
      message: `enter the name of the ${selection}:`,
    },
    {
      type: "input",
      name: "addSalary",
      message: "Enter the salary for this role:",
    },
    {
      type: "input",
      name: "addDepartment",
      message: "Enter the id of the department this role will be in:",
    },
  ]);
};

const addEmployee = (selection) => {
  return inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is the Employee's first name?",
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is the Employee's last name?",
    },
    {
      type: "input",
      name: "employeeRole",
      message: "Enter the id of the Role this employee will have:",
    },
    {
      type: "input",
      name: "employeeManager",
      message:
        "Enter the id of employee that will be this employee's manager: (enter null if no manager)",
    },
  ]);
};

const updateEmployee = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "employeeUpdate",
      message: "Enter the id of the employee you would like to update",
    },
    {
      type: "input",
      name: "newEmployeeRole",
      message: "Enter the id of the role you would like to update them to!",
    },
  ]);
};

// insert the Employee's info into the database
function AddingEmployee(Answers) {
  Connection.query(
    `INSERT INTO Employee(first_name,last_name,role_id,manager_id) 
    VALUES('${Answers.employeeFirstName}', '${Answers.employeeLastName}', ${Answers.employeeRole}, ${Answers.employeeManager})`,
    function (err, results, fields) {
      console.log(err);
      console.log("Employee Added!");
    }
  );
}

// insert the role's info into the database
function addingRole(Answers) {
  Connection.query(
    `INSERT INTO Role(title,salary,department_id)
  VALUES('${Answers.addName}', ${Answers.addSalary}, ${Answers.addDepartment})`,
    function (err, results, fields) {
      console.log(err);
    }
  );
}

//insert the departments info into the database
function addingDepartment(Answers) {
  Connection.query(
    `INSERT INTO Department(name)
    VALUES('${Answers.add}')`,
    function (err, results, fields) {
      console.log(err);
    }
  );
}

function updatingEmployee(Answers) {
  Connection.query(
    `UPDATE employee SET role_id = ${Answers.newEmployeeRole} WHERE id = ${Answers.employeeUpdate}`,
    (err, results) => {
      console.log(err);
    }
  );
}

initialQuestion()
  .then((answers) => {
    return followUp(answers);
  })
  .catch((err) => {
    console.log(err);
  });
