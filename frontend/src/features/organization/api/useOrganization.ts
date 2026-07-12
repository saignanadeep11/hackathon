import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
      status
      head {
        name
      }
      parent_department {
        name
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      status
      department {
        name
      }
    }
  }
`;

export const PROMOTE_TO_ADMIN = gql`
  mutation PromoteToAdmin($id: String!) {
    promoteToAdmin(id: $id) {
      id
      role
    }
  }
`;

export const PROMOTE_TO_DEPT_HEAD = gql`
  mutation PromoteToDeptHead($id: String!) {
    promoteToDeptHead(id: $id) {
      id
      role
    }
  }
`;

export const UPDATE_DEPARTMENT_STATUS = gql`
  mutation UpdateDepartmentStatus($id: String!, $status: GeneralStatus!) {
    updateDepartmentStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const ASSIGN_DEPARTMENT_HEAD = gql`
  mutation AssignDepartmentHead($id: String!, $head_id: String!) {
    assignDepartmentHead(id: $id, head_id: $head_id) {
      id
      head {
        id
        name
      }
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($name: String!, $head_id: String, $parent_department_id: String) {
    createDepartment(name: $name, head_id: $head_id, parent_department_id: $parent_department_id) {
      id
      name
      status
    }
  }
`;

export function useOrganization() {
  const {
    result: departmentsResult,
    loading: departmentsLoading,
    refetch: refetchDepartments,
  } = useQuery(GET_DEPARTMENTS);
  const { result: usersResult, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_USERS);

  const { mutate: promoteToAdmin } = useMutation(PROMOTE_TO_ADMIN, {
    update: () => {
      void refetchUsers();
    },
  });

  const { mutate: promoteToDeptHead } = useMutation(PROMOTE_TO_DEPT_HEAD, {
    update: () => {
      void refetchUsers();
    },
  });

  const { mutate: updateDepartmentStatus } = useMutation(UPDATE_DEPARTMENT_STATUS, {
    update: () => {
      void refetchDepartments();
    },
  });

  const { mutate: assignDepartmentHead } = useMutation(ASSIGN_DEPARTMENT_HEAD, {
    update: () => {
      void refetchDepartments();
    },
  });

  const { mutate: createDepartment, loading: createDepartmentLoading } = useMutation(
    CREATE_DEPARTMENT,
    {
      update: () => {
        void refetchDepartments();
      },
    },
  );

  return {
    departmentsResult,
    departmentsLoading,
    usersResult,
    usersLoading,
    promoteToAdmin,
    promoteToDeptHead,
    createDepartment,
    createDepartmentLoading,
    updateDepartmentStatus,
    assignDepartmentHead,
  };
}
