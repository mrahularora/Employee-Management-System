const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const Employee = require("../../models/Employee");
const EmployeeCommunity = require('../../models/EmployeeCommunity');
const Registration = require('../../models/Registration');
const User = require("../../models/User");
const {
  createToken,
  hashPassword,
  normalizeUsername,
  requireAdmin,
  requireAuth,
  verifyPassword,
} = require("../../utils/auth");

const badInput = (message) => new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT" } });
const invalidLogin = () => new GraphQLError("Invalid username or password", {
  extensions: { code: "UNAUTHENTICATED" },
});
const DUMMY_SALT = "0".repeat(32);
const DUMMY_HASH = "0".repeat(128);

const resolvers = {
  EmployeeCommunity: {
    employee: ({ EmployeeId }) => EmployeeId || null,
  },
  Registration: {
    employee: ({ EmployeeId }) => EmployeeId || null,
    createdAt: ({ createdAt }) => createdAt?.toISOString() || null,
  },
  User: {
    role: ({ role }) => role.toUpperCase(),
    createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
  },
  Query: {
    employees: (_, __, context) => {
      requireAuth(context);
      return Employee.find().exec();
    },
    employeeCommunities: (_, __, context) => {
      requireAuth(context);
      return EmployeeCommunity.find().populate("EmployeeId").sort({ ClubName: 1 }).exec();
    },
    registrations: (_, __, context) => {
      requireAdmin(context);
      return Registration.find()
        .select("+name +email")
        .populate("EmployeeId")
        .sort({ createdAt: -1 })
        .exec();
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
    users: (_, __, context) => {
      requireAdmin(context);
      return User.find().sort({ role: 1, username: 1 }).exec();
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({
        username: normalizeUsername(username),
        active: true,
      }).select("+passwordHash +passwordSalt");
      const valid = password.length <= 128 && await verifyPassword(
        password,
        user?.passwordSalt || DUMMY_SALT,
        user?.passwordHash || DUMMY_HASH
      );
      if (!user || !valid) throw invalidLogin();

      return {
        token: createToken(user),
        username: user.username,
        role: user.role.toUpperCase(),
      };
    },
    createUser: async (_, { username, password, role }, context) => {
      requireAdmin(context);
      const normalizedUsername = normalizeUsername(username);
      if (!/^[a-z0-9._-]{3,32}$/.test(normalizedUsername)) {
        throw badInput("Username must be 3-32 characters using letters, numbers, dots, dashes, or underscores");
      }

      const credentials = await hashPassword(password);
      try {
        return await User.create({
          username: normalizedUsername,
          ...credentials,
          role: role.toLowerCase(),
        });
      } catch (error) {
        if (error.code === 11000) throw badInput("Username already exists");
        throw error;
      }
    },
    setUserActive: async (_, { id, active }, context) => {
      requireAdmin(context);
      if (!mongoose.isObjectIdOrHexString(id)) throw badInput("User was not found");
      if (String(id) === context.user.id && !active) {
        throw badInput("You cannot disable your own account");
      }

      const user = await User.findByIdAndUpdate(id, { active }, { new: true }).exec();
      if (!user) throw badInput("User was not found");
      return user;
    },
    createEmployee: async (_, { input }, context) => {
      requireAdmin(context);
      try {
        return await Employee.create({ ...input, CurrentStatus: true });
      } catch (error) {
        if (["ValidationError", "CastError"].includes(error.name)) {
          throw badInput("Employee details are invalid");
        }
        throw error;
      }
    },
    updateEmployee: async (_, { id, input }, context) => {
      requireAdmin(context);
      if (!mongoose.isObjectIdOrHexString(id)) throw badInput("Employee was not found");

      try {
        const employee = await Employee.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        }).exec();
        if (!employee) throw badInput("Employee was not found");

        return employee;
      } catch (error) {
        if (error.extensions?.code === "BAD_USER_INPUT") throw error;
        if (["ValidationError", "CastError"].includes(error.name)) {
          throw badInput("Employee details are invalid");
        }
        throw error;
      }
    },
    setEmployeeStatus: async (_, { id, active }, context) => {
      requireAdmin(context);
      if (!mongoose.isObjectIdOrHexString(id)) throw badInput("Employee was not found");

      const employee = await Employee.findByIdAndUpdate(
        id,
        { CurrentStatus: active },
        { new: true, runValidators: true }
      ).exec();
      if (!employee) throw badInput("Employee was not found");
      return employee;
    },
    createEmployeeCommunity: async (_, { EmployeeId, ClubName, NumberOfMembers }, context) => {
      requireAdmin(context);
      if (!mongoose.isObjectIdOrHexString(EmployeeId)) {
        throw badInput("Selected employee is invalid");
      }
      const employee = await Employee.findOne({ _id: EmployeeId, CurrentStatus: true }).exec();
      if (!employee) throw badInput("Selected active employee was not found");

      const clubName = ClubName.trim();
      if (await EmployeeCommunity.exists({ EmployeeId, ClubName: clubName })) {
        throw badInput("This employee is already assigned to the community");
      }

      const newCommunity = new EmployeeCommunity({
        EmployeeId,
        ClubName: clubName,
        NumberOfMembers
      });
      await newCommunity.save();
      return newCommunity.populate("EmployeeId");
    },
    register: async (_, { EmployeeId, activity }, context) => {
      requireAuth(context);
      if (!mongoose.isObjectIdOrHexString(EmployeeId)) {
        throw badInput("Selected employee is invalid");
      }

      const employee = await Employee.findOne({ _id: EmployeeId, CurrentStatus: true }).exec();
      if (!employee) throw badInput("Selected active employee was not found");
      if (await Registration.exists({ EmployeeId, activity })) {
        throw badInput("This employee is already registered for the activity");
      }

      try {
        const registration = await Registration.create({ EmployeeId, activity });
        return registration.populate("EmployeeId");
      } catch (error) {
        if (error.code === 11000) throw badInput("This employee is already registered for the activity");
        if (error.name === "ValidationError") throw badInput("Activity selection is invalid");
        throw error;
      }
    },
  },
};

module.exports = resolvers;
