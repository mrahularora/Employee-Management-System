import assert from "node:assert/strict";
import { employeesToCsv, parseEmployeesCsv } from "./employeeCsv.mjs";

const csv = "FirstName,LastName,Age,DateOfJoining,Title,Department,EmployeeType,CurrentStatus\r\n\"Rahul, R.\",Arora,30,2024-01-15,Manager,IT,FullTime,inactive";
const [employee] = parseEmployeesCsv(csv);

assert.equal(employee.FirstName, "Rahul, R.");
assert.equal(employee.Age, 30);
assert.equal(employee.CurrentStatus, false);
assert.match(employeesToCsv([employee]), /\"Rahul, R\.\"/);
assert.throws(() => parseEmployeesCsv("FirstName\nRahul"), /CSV columns must be/);

console.log("Employee CSV validation passed");
