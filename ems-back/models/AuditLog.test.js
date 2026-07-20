const assert = require("node:assert/strict");
const AuditLog = require("./AuditLog");

const validAuditLog = new AuditLog({
  actor: "admin",
  action: "EMPLOYEE_CREATED",
  targetType: "Employee",
  targetId: "employee-1",
  summary: "Created employee Rahul Arora",
});

assert.equal(validAuditLog.validateSync(), undefined);
assert.ok(new AuditLog({ actor: "admin" }).validateSync().errors.summary);

console.log("AuditLog validation passed");
