const Employee = require("../../models/Employee");
const EmployeeCommunity = require('../../models/EmployeeCommunity');
const Registration = require('../../models/Registration');
const { createToken, requireAuth } = require("../../utils/auth");

const resolvers = {
  Query: {
    employees: (_, __, context) => {
      requireAuth(context);
      return Employee.find().exec();
    },
    employeeCommunities: (_, __, context) => {
      requireAuth(context);
      return EmployeeCommunity.find().exec();
    },
    registrations: (_, __, context) => {
      requireAuth(context);
      return Registration.find().exec();
    },
  },
  Mutation: {
    login: (_, { username, password }) => {
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (username !== adminUsername || password !== adminPassword) throw new Error("Invalid login");
      return { token: createToken(username), username };
    },
    createEmployee: async (_, { FirstName, LastName, Age, DateOfJoining, Title, Department, EmployeeType }, context) => {
      requireAuth(context);
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
    createEmployeeCommunity: async (_, { EmployeeName, DepartmentName, ClubName, NumberOfMembers }, context) => {
      requireAuth(context);
      const newCommunity = new EmployeeCommunity({
        EmployeeName,
        DepartmentName,
        ClubName,
        NumberOfMembers
      });
      await newCommunity.save();
      return newCommunity;
    },
    register: async (_, { name, email, activity }, context) => {
      requireAuth(context);
      const newRegistration = new Registration({ name, email, activity });
      await newRegistration.save();
      return newRegistration;
    },
  },
};

module.exports = resolvers;
