const assert = require("node:assert/strict");
const Employee = require("./Employee");

const validEmployee = {
  FirstName: "Rahul",
  LastName: "Arora",
  Age: 30,
  DateOfJoining: new Date("2024-01-15"),
  Title: "Manager",
  Department: "HR",
  EmployeeType: "FullTime",
};

assert.equal(new Employee(validEmployee).validateSync(), undefined);
assert.equal(new Employee({ ...validEmployee, Age: 19 }).validateSync().errors.Age.kind, "min");
assert.ok(new Employee({ ...validEmployee, FirstName: "" }).validateSync().errors.FirstName);

console.log("Employee validation passed");
