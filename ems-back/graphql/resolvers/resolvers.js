const Employee = require("../../models/Employee");
const EmployeeCommunity = require('../../models/EmployeeCommunity');
const Registration = require('../../models/Registration');

const resolvers = {
  Query: {
    employees: async () => await Employee.find(),
    employeeCommunities: async () => {
      try {
        return await EmployeeCommunity.find();
      } catch (err) {
        console.error('Error fetching employee communities:', err);
        throw new Error('Failed to fetch employee communities');
      }
    },
    registrations: async () => {
      try {
        return await Registration.find();
      } catch (err) {
        console.error('Error fetching registrations:', err);
        throw new Error('Failed to fetch registrations');
      }
    },
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
      try {
        const newCommunity = new EmployeeCommunity({
          EmployeeName,
          DepartmentName,
          ClubName,
          NumberOfMembers
        });
        await newCommunity.save();
        return newCommunity;
      } catch (err) {
        console.error('Error creating employee community:', err);
        throw new Error('Failed to create employee community');
      }
    },
    register: async (_, { name, email, activity }) => {
      try {
        const newRegistration = new Registration({ name, email, activity });
        await newRegistration.save();
        return newRegistration;
      } catch (err) {
        console.error('Error registering activity:', err);
        throw new Error('Failed to register activity');
      }
    },
  },
};

module.exports = resolvers;
