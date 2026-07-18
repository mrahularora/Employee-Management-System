import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      username
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $FirstName: String!
    $LastName: String!
    $Age: Int!
    $DateOfJoining: String!
    $Title: String!
    $Department: String!
    $EmployeeType: String!
  ) {
    createEmployee(
      FirstName: $FirstName
      LastName: $LastName
      Age: $Age
      DateOfJoining: $DateOfJoining
      Title: $Title
      Department: $Department
      EmployeeType: $EmployeeType
    ) {
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
  }
`;


export const CREATE_EMPLOYEE_COMMUNITY = gql`
  mutation CreateEmployeeCommunity(
    $EmployeeName: String!
    $DepartmentName: String!
    $ClubName: String!
    $NumberOfMembers: Int!
  ) {
    createEmployeeCommunity(
      EmployeeName: $EmployeeName
      DepartmentName: $DepartmentName
      ClubName: $ClubName
      NumberOfMembers: $NumberOfMembers
    ) {
      id
      EmployeeName
      DepartmentName
      ClubName
      NumberOfMembers
    }
  }
`;
