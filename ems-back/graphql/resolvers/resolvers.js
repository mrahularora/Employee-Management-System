const mongoose = require("mongoose");
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
    metrics: async (_, __, context) => {
      requireAuth(context);
      const [
        totalEmployees,
        activeEmployees,
        totalCommunities,
        communityMembers,
        departments,
      ] = await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ CurrentStatus: true }),
        EmployeeCommunity.countDocuments(),
        EmployeeCommunity.aggregate([{ $group: { _id: null, total: { $sum: "$NumberOfMembers" } } }]),
        Employee.aggregate([
          { $group: { _id: "$Department", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ]),
      ]);

      return {
        totalEmployees,
        activeEmployees,
        inactiveEmployees: totalEmployees - activeEmployees,
        totalCommunities,
        totalCommunityMembers: communityMembers[0]?.total || 0,
        departments: departments.map(({ _id, count }) => ({ name: _id, count })),
      };
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
    createEmployeeCommunity: async (_, { EmployeeId, ClubName, NumberOfMembers }, context) => {
      requireAuth(context);
      if (!mongoose.isObjectIdOrHexString(EmployeeId)) {
        throw new Error("Selected employee is invalid");
      }
      const employee = await Employee.findById(EmployeeId).exec();
      if (!employee) throw new Error("Selected employee was not found");

      const newCommunity = new EmployeeCommunity({
        EmployeeId,
        EmployeeName: `${employee.FirstName} ${employee.LastName}`.trim(),
        DepartmentName: employee.Department,
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
