const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const EmployeeCommunity = require("./EmployeeCommunity");

const validRecord = new EmployeeCommunity({
  EmployeeId: new mongoose.Types.ObjectId(),
  ClubName: "Wellness Club",
  NumberOfMembers: 8,
});

assert.equal(validRecord.validateSync(), undefined);
assert.ok(new EmployeeCommunity().validateSync().errors.EmployeeId);
console.log("EmployeeCommunity validation passed");
