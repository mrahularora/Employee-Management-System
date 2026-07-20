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
      totalRegistrations
      departments {
        name
        count
      }
      employeeTypes {
        name
        count
      }
      joiningTrend {
        month
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

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    auditLogs(limit: 50) {
      id
      actor
      action
      targetType
      summary
      createdAt
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications(limit: 20) {
      id
      action
      message
      createdAt
    }
  }
`;
