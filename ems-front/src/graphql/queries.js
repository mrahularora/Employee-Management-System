import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
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

export const GET_EMPLOYEE_COMMUNITIES = gql`
  query GetEmployeeCommunities {
    employeeCommunities {
      id
      employee {
        id
        FirstName
        LastName
        Department
        CurrentStatus
      }
      ClubName
      NumberOfMembers
    }
  }
`;

export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      totalEmployees
      activeEmployees
      inactiveEmployees
      totalCommunities
      totalCommunityMembers
      departments {
        name
        count
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      role
      active
      createdAt
    }
  }
`;
