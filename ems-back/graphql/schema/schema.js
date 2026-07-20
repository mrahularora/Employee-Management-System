const typeDefs = `#graphql
  type Employee {
    id: ID!
    FirstName: String!
    LastName: String!
    Age: Int!
    DateOfJoining: String!
    Title: String!
    Department: String!
    EmployeeType: String!
    CurrentStatus: Boolean!
  }

  input EmployeeInput {
    FirstName: String!
    LastName: String!
    Age: Int!
    DateOfJoining: String!
    Title: String!
    Department: String!
    EmployeeType: String!
  }

  type EmployeeCommunity {
    id: ID!
    EmployeeId: ID
    EmployeeName: String!
    DepartmentName: String!
    ClubName: String!
    NumberOfMembers: Int!
  }
    
  type Registration {
  id: ID!
  name: String!
  email: String!
  activity: String!
  }

  enum UserRole {
    ADMIN
    USER
  }

  type User {
    id: ID!
    username: String!
    role: UserRole!
    active: Boolean!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    username: String!
    role: UserRole!
  }

  type DepartmentMetric {
    name: String!
    count: Int!
  }

  type Metrics {
    totalEmployees: Int!
    activeEmployees: Int!
    inactiveEmployees: Int!
    totalCommunities: Int!
    totalCommunityMembers: Int!
    departments: [DepartmentMetric!]!
  }

  type Query {
    employees: [Employee]
    employeeCommunities: [EmployeeCommunity]
    registrations: [Registration]
    metrics: Metrics!
    users: [User!]!
  }

  type Mutation {
    login(
      username: String!
      password: String!
    ): AuthPayload
    createUser(
      username: String!
      password: String!
      role: UserRole!
    ): User!
    setUserActive(
      id: ID!
      active: Boolean!
    ): User!
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    setEmployeeStatus(id: ID!, active: Boolean!): Employee!
    createEmployeeCommunity(
      EmployeeId: ID!
      ClubName: String!
      NumberOfMembers: Int!
    ): EmployeeCommunity
    register(
      name: String!
      email: String!
      activity: String!
    ): Registration
  }
`;

module.exports = typeDefs;
