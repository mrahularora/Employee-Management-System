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
    employee: Employee
    ClubName: String!
    NumberOfMembers: Int!
  }
    
  type Registration {
    id: ID!
    employee: Employee
    name: String
    email: String
    activity: String!
    createdAt: String
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

  type AuditLog {
    id: ID!
    actor: String!
    action: String!
    targetType: String!
    targetId: String!
    summary: String!
    createdAt: String!
  }

  type Query {
    employees: [Employee]
    employeeCommunities: [EmployeeCommunity]
    registrations: [Registration]
    metrics: Metrics!
    users: [User!]!
    auditLogs(limit: Int = 50): [AuditLog!]!
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
      EmployeeId: ID!
      activity: String!
    ): Registration!
  }
`;

module.exports = typeDefs;
