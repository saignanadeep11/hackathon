import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import { computed, ref } from 'vue';
import {
  GetDepartmentsPageDocument,
  GetUsersPageDocument,
  type DepartmentFilterInput,
  type UserFilterInput,
} from 'src/graphql/generated/graphql';

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
      status
      head {
        id
        name
      }
      parent_department {
        id
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

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment(
    $id: String!
    $name: String
    $head_id: String
    $parent_department_id: String
  ) {
    updateDepartment(
      id: $id
      name: $name
      head_id: $head_id
      parent_department_id: $parent_department_id
    ) {
      id
      name
      head {
        id
        name
      }
      parent_department {
        id
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String!
    $role: UserRole
    $status: GeneralStatus
    $department_id: String
  ) {
    updateUser(id: $id, role: $role, status: $status, department_id: $department_id) {
      id
      name
      email
      role
      status
      department {
        id
        name
      }
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

  const { mutate: updateDepartment, loading: updateDepartmentLoading } = useMutation(
    UPDATE_DEPARTMENT,
    {
      update: () => {
        void refetchDepartments();
      },
    },
  );

  const { mutate: updateUser, loading: updateUserLoading } = useMutation(UPDATE_USER, {
    update: () => {
      void refetchUsers();
    },
  });

  return {
    departmentsResult,
    departmentsLoading,
    usersResult,
    usersLoading,
    promoteToAdmin,
    promoteToDeptHead,
    createDepartment,
    createDepartmentLoading,
    updateDepartment,
    updateDepartmentLoading,
    updateDepartmentStatus,
    assignDepartmentHead,
    updateUser,
    updateUserLoading,
  };
}

export function useDepartmentsPage(
  variables: {
    filter?: DepartmentFilterInput;
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  } = {},
) {
  const variablesRef = ref(variables);

  const { result, loading, error, refetch, fetchMore } = useQuery(
    GetDepartmentsPageDocument,
    variablesRef,
    { fetchPolicy: 'cache-and-network' },
  );

  const pageResult = computed(() => result.value?.departmentsPage);
  const departments = computed(() => pageResult.value?.edges.map((e) => e.node) ?? []);
  const pageInfo = computed(() => pageResult.value?.pageInfo);
  const totalCount = computed(() => pageResult.value?.totalCount ?? 0);

  return {
    variables: variablesRef,
    departments,
    pageInfo,
    totalCount,
    loading,
    error,
    refetch,
    fetchMore,
  };
}

export function useUsersPage(
  variables: {
    filter?: UserFilterInput;
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  } = {},
) {
  const variablesRef = ref(variables);

  const { result, loading, error, refetch, fetchMore } = useQuery(
    GetUsersPageDocument,
    variablesRef,
    { fetchPolicy: 'cache-and-network' },
  );

  const pageResult = computed(() => result.value?.usersPage);
  const users = computed(() => pageResult.value?.edges.map((e) => e.node) ?? []);
  const pageInfo = computed(() => pageResult.value?.pageInfo);
  const totalCount = computed(() => pageResult.value?.totalCount ?? 0);

  return {
    variables: variablesRef,
    users,
    pageInfo,
    totalCount,
    loading,
    error,
    refetch,
    fetchMore,
  };
}
