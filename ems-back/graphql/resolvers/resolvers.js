const Employee = require("../../models/Employee");
const EmployeeCommunity = require('../../models/EmployeeCommunity');
const Registration = require('../../models/Registration');

const resolvers = {
  Query: {
    employees: () => Employee.find(),
    employeeCommunities: () => EmployeeCommunity.find(),
    registrations: () => Registration.find(),
  },
  Mutation: {
    createEmployee: async (_, { FirstName, LastName, Age, DateOfJoining, Title, Department, EmployeeType }) => {
      const employee = new Employee({
        FirstName,
        LastName,
        Age,
        DateOfJoining,
        Title,
        Department,
        EmployeeType,
        CurrentStatus: true, // working = true
      });
      await employee.save();
      return employee;
    },
    createEmployeeCommunity: async (_, { EmployeeName, DepartmentName, ClubName, NumberOfMembers }) => {
      const newCommunity = new EmployeeCommunity({
        EmployeeName,
        DepartmentName,
        ClubName,
        NumberOfMembers
      });
      await newCommunity.save();
      return newCommunity;
    },
    register: async (_, { name, email, activity }) => {
      const newRegistration = new Registration({ name, email, activity });
      await newRegistration.save();
      return newRegistration;
    },
  },
};

module.exports = resolvers;
