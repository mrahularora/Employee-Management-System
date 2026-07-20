const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const EmployeeCommunity = require("../models/EmployeeCommunity");
const Registration = require("../models/Registration");

require("dotenv").config();

const normalize = (value) => String(value || "").trim().replace(/\s+/g, " ").toLowerCase();

async function migrate() {
  const apply = process.argv.includes("--apply");
  await mongoose.connect(process.env.MONGO_URI);

  const employees = await Employee.find().lean();
  const byId = new Map(employees.map((employee) => [String(employee._id), employee]));
  const byName = new Map(employees.map((employee) => [
    normalize(`${employee.FirstName} ${employee.LastName}`),
    employee,
  ]));
  const communities = await EmployeeCommunity.collection.find().toArray();
  const registrations = await Registration.collection.find().toArray();
  const result = { communities: 0, registrations: 0, unmatched: 0, duplicates: 0 };

  for (const community of communities) {
    const employee = byId.get(String(community.EmployeeId)) || byName.get(normalize(community.EmployeeName));
    if (!employee) {
      result.unmatched += 1;
      continue;
    }
    result.communities += 1;
    if (apply) {
      await EmployeeCommunity.collection.updateOne(
        { _id: community._id },
        {
          $set: { EmployeeId: employee._id },
          $unset: { EmployeeName: "", DepartmentName: "" },
        }
      );
    }
  }

  for (const registration of registrations) {
    const employee = byId.get(String(registration.EmployeeId)) || byName.get(normalize(registration.name));
    if (!employee) {
      result.unmatched += 1;
      continue;
    }
    const duplicate = await Registration.collection.findOne({
      _id: { $ne: registration._id },
      EmployeeId: employee._id,
      activity: registration.activity,
    });
    if (duplicate) {
      result.duplicates += 1;
      continue;
    }
    result.registrations += 1;
    if (apply) {
      await Registration.collection.updateOne(
        { _id: registration._id },
        {
          $set: { EmployeeId: employee._id },
          $unset: { name: "", email: "" },
        }
      );
    }
  }

  console.log(`${apply ? "Applied" : "Dry run"}:`, result);
}

migrate()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
