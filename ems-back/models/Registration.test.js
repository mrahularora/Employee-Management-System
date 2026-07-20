const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Registration = require("./Registration");

const validRegistration = new Registration({
  EmployeeId: new mongoose.Types.ObjectId(),
  activity: "Yoga Session",
});

assert.equal(validRegistration.validateSync(), undefined);
assert.ok(new Registration({ activity: "Unknown Activity" }).validateSync().errors.activity);

console.log("Registration validation passed");
