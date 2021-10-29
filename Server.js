const inquirer = require("inquirer");

// make array to hold employees
const employeeArr = [];

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
      ],
      name: "initialQuestion",
    },
  ]);
};
const followUp = (answers) => {
  const answer = answers.initialQuestion;
  if (answer === "view all departments") {
    console.log("display table for departments");
    initialQuestion().then((answers) => {
      return followUp(answers);
    });
  }
  if (answer === "view all roles") {
    console.log("display table for roles");
    initialQuestion().then((answers) => {
      return followUp(answers);
    });
  }
  if (answer === "view all employees") {
    console.log("display table for all employees");
    initialQuestion().then((answers) => {
      return followUp(answers);
    });
  }
  if (answer === "add a department") {
    let selection = "department";
    addDepartment(selection)
      .then(() => {
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "add a role") {
    let selection = "role";
    addRole(selection)
      .then(() => {
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "add an employee") {
    addEmployee()
      .then((answers) => {
        employeeArr.push(answers.employeeFirstName);
        console.log(employeeArr);
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
  }
  if (answer === "update an employee role") {
    return updateEmployee()
      .then(() => {
        return initialQuestion();
      })
      .then((answers) => {
        return followUp(answers);
      });
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
      message: "Which Department will this role be in?",
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
      message: "What is this Employee's role?",
    },
    {
      type: "input",
      name: "employeeManager",
      message: "Who is this employee's Manager?",
    },
  ]);
};

const updateEmployee = () => {
  if (employeeArr.length === 0) {
    console.log("You have no Employee's!");
    return initialQuestion().then((answers) => {
      return followUp(answers);
    });
  }
  return inquirer.prompt([
    {
      type: "list",
      name: "employee",
      // replace with employee database later
      choices: employeeArr,
      message: "Choose the employee you wish to update:",
    },
    {
      type: "list",
      name: "newEmployeeRole",
      // replace with role database later
      choices: ["test"],
      message: "Choose the role you wish for them to have!",
    },
  ]);
};

initialQuestion()
  .then((answers) => {
    return followUp(answers);
  })
  .catch((err) => {
    console.log(err);
  });
