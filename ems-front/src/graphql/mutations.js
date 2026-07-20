import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      username
      role
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $role: UserRole!) {
    createUser(username: $username, password: $password, role: $role) {
      id
      username
      role
      active
      createdAt
    }
  }
`;

export const SET_USER_ACTIVE = gql`
  mutation SetUserActive($id: ID!, $active: Boolean!) {
    setUserActive(id: $id, active: $active) {
      id
      active
    }
  }
`;

const EMPLOYEE_FIELDS = gql`
  fragment EmployeeFields on Employee {
    id
    FirstName
    LastName
    Age
    DateOfJoining
    Title
    Department
    EmployeeType
    CurrentStatus
  }
`;

export const CREATE_EMPLOYEE = gql`
  ${EMPLOYEE_FIELDS}
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      ...EmployeeFields
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  ${EMPLOYEE_FIELDS}
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      ...EmployeeFields
    }
  }
`;

export const SET_EMPLOYEE_STATUS = gql`
  ${EMPLOYEE_FIELDS}
  mutation SetEmployeeStatus($id: ID!, $active: Boolean!) {
    setEmployeeStatus(id: $id, active: $active) {
      ...EmployeeFields
    }
  }
`;


export const CREATE_EMPLOYEE_COMMUNITY = gql`
  mutation CreateEmployeeCommunity(
    $EmployeeId: ID!
    $ClubName: String!
    $NumberOfMembers: Int!
  ) {
    createEmployeeCommunity(
      EmployeeId: $EmployeeId
      ClubName: $ClubName
      NumberOfMembers: $NumberOfMembers
    ) {
      id
      EmployeeId
      EmployeeName
      DepartmentName
      ClubName
      NumberOfMembers
    }
  }
`;
