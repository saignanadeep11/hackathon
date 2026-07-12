/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetAssets($filter: AssetFilterInput) {\n  assets(filter: $filter) {\n    id\n    asset_tag\n    name\n    serial_number\n    acquisition_date\n    acquisition_cost\n    condition\n    location\n    is_shared_bookable\n    status\n    custom_fields_data\n    photo_url\n    createdAt\n    category {\n      id\n      name\n    }\n  }\n}\n\nquery GetCategories {\n  categories {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nmutation RegisterAsset($input: RegisterAssetInput!) {\n  registerAsset(input: $input) {\n    id\n    asset_tag\n    name\n  }\n}": typeof types.GetAssetsDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nquery Me {\n  me {\n    id\n    name\n    email\n    role\n    status\n  }\n}": typeof types.LoginDocument,
    "\n  query GetDashboardMetrics {\n    dashboardMetrics {\n      assetsAvailable\n      assetsAllocated\n      maintenanceToday\n      activeBookings\n      pendingTransfers\n      upcomingReturns\n      overdueReturns\n    }\n  }\n": typeof types.GetDashboardMetricsDocument,
    "mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}": typeof types.CreateCategoryDocument,
    "\n  query GetDepartments {\n    departments {\n      id\n      name\n      status\n      head {\n        name\n      }\n      parent_department {\n        name\n      }\n    }\n  }\n": typeof types.GetDepartmentsDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      email\n      role\n      status\n      department {\n        name\n      }\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  mutation PromoteToAdmin($id: String!) {\n    promoteToAdmin(id: $id) {\n      id\n      role\n    }\n  }\n": typeof types.PromoteToAdminDocument,
    "\n  mutation PromoteToDeptHead($id: String!) {\n    promoteToDeptHead(id: $id) {\n      id\n      role\n    }\n  }\n": typeof types.PromoteToDeptHeadDocument,
    "\n  mutation UpdateDepartmentStatus($id: String!, $status: GeneralStatus!) {\n    updateDepartmentStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n": typeof types.UpdateDepartmentStatusDocument,
    "\n  mutation AssignDepartmentHead($id: String!, $head_id: String!) {\n    assignDepartmentHead(id: $id, head_id: $head_id) {\n      id\n      head {\n        id\n        name\n      }\n    }\n  }\n": typeof types.AssignDepartmentHeadDocument,
    "\n  mutation CreateDepartment($name: String!, $head_id: String, $parent_department_id: String) {\n    createDepartment(name: $name, head_id: $head_id, parent_department_id: $parent_department_id) {\n      id\n      name\n      status\n    }\n  }\n": typeof types.CreateDepartmentDocument,
    "\n  mutation PromoteToAssetManager($id: String!) {\n    promoteToAssetManager(id: $id) {\n      id\n      role\n    }\n  }\n": typeof types.PromoteToAssetManagerDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n": typeof types.GetCategoriesDocument,
    "\n  mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n    createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n    updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n": typeof types.UpdateCategoryDocument,
};
const documents: Documents = {
    "query GetAssets($filter: AssetFilterInput) {\n  assets(filter: $filter) {\n    id\n    asset_tag\n    name\n    serial_number\n    acquisition_date\n    acquisition_cost\n    condition\n    location\n    is_shared_bookable\n    status\n    custom_fields_data\n    photo_url\n    createdAt\n    category {\n      id\n      name\n    }\n  }\n}\n\nquery GetCategories {\n  categories {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nmutation RegisterAsset($input: RegisterAssetInput!) {\n  registerAsset(input: $input) {\n    id\n    asset_tag\n    name\n  }\n}": types.GetAssetsDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nquery Me {\n  me {\n    id\n    name\n    email\n    role\n    status\n  }\n}": types.LoginDocument,
    "\n  query GetDashboardMetrics {\n    dashboardMetrics {\n      assetsAvailable\n      assetsAllocated\n      maintenanceToday\n      activeBookings\n      pendingTransfers\n      upcomingReturns\n      overdueReturns\n    }\n  }\n": types.GetDashboardMetricsDocument,
    "mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}": types.CreateCategoryDocument,
    "\n  query GetDepartments {\n    departments {\n      id\n      name\n      status\n      head {\n        name\n      }\n      parent_department {\n        name\n      }\n    }\n  }\n": types.GetDepartmentsDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      email\n      role\n      status\n      department {\n        name\n      }\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation PromoteToAdmin($id: String!) {\n    promoteToAdmin(id: $id) {\n      id\n      role\n    }\n  }\n": types.PromoteToAdminDocument,
    "\n  mutation PromoteToDeptHead($id: String!) {\n    promoteToDeptHead(id: $id) {\n      id\n      role\n    }\n  }\n": types.PromoteToDeptHeadDocument,
    "\n  mutation UpdateDepartmentStatus($id: String!, $status: GeneralStatus!) {\n    updateDepartmentStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n": types.UpdateDepartmentStatusDocument,
    "\n  mutation AssignDepartmentHead($id: String!, $head_id: String!) {\n    assignDepartmentHead(id: $id, head_id: $head_id) {\n      id\n      head {\n        id\n        name\n      }\n    }\n  }\n": types.AssignDepartmentHeadDocument,
    "\n  mutation CreateDepartment($name: String!, $head_id: String, $parent_department_id: String) {\n    createDepartment(name: $name, head_id: $head_id, parent_department_id: $parent_department_id) {\n      id\n      name\n      status\n    }\n  }\n": types.CreateDepartmentDocument,
    "\n  mutation PromoteToAssetManager($id: String!) {\n    promoteToAssetManager(id: $id) {\n      id\n      role\n    }\n  }\n": types.PromoteToAssetManagerDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n    createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n    updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n": types.UpdateCategoryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAssets($filter: AssetFilterInput) {\n  assets(filter: $filter) {\n    id\n    asset_tag\n    name\n    serial_number\n    acquisition_date\n    acquisition_cost\n    condition\n    location\n    is_shared_bookable\n    status\n    custom_fields_data\n    photo_url\n    createdAt\n    category {\n      id\n      name\n    }\n  }\n}\n\nquery GetCategories {\n  categories {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nmutation RegisterAsset($input: RegisterAssetInput!) {\n  registerAsset(input: $input) {\n    id\n    asset_tag\n    name\n  }\n}"): (typeof documents)["query GetAssets($filter: AssetFilterInput) {\n  assets(filter: $filter) {\n    id\n    asset_tag\n    name\n    serial_number\n    acquisition_date\n    acquisition_cost\n    condition\n    location\n    is_shared_bookable\n    status\n    custom_fields_data\n    photo_url\n    createdAt\n    category {\n      id\n      name\n    }\n  }\n}\n\nquery GetCategories {\n  categories {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nmutation RegisterAsset($input: RegisterAssetInput!) {\n  registerAsset(input: $input) {\n    id\n    asset_tag\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nquery Me {\n  me {\n    id\n    name\n    email\n    role\n    status\n  }\n}"): (typeof documents)["mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nquery Me {\n  me {\n    id\n    name\n    email\n    role\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDashboardMetrics {\n    dashboardMetrics {\n      assetsAvailable\n      assetsAllocated\n      maintenanceToday\n      activeBookings\n      pendingTransfers\n      upcomingReturns\n      overdueReturns\n    }\n  }\n"): (typeof documents)["\n  query GetDashboardMetrics {\n    dashboardMetrics {\n      assetsAvailable\n      assetsAllocated\n      maintenanceToday\n      activeBookings\n      pendingTransfers\n      upcomingReturns\n      overdueReturns\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}"): (typeof documents)["mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDepartments {\n    departments {\n      id\n      name\n      status\n      head {\n        name\n      }\n      parent_department {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDepartments {\n    departments {\n      id\n      name\n      status\n      head {\n        name\n      }\n      parent_department {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    users {\n      id\n      name\n      email\n      role\n      status\n      department {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      name\n      email\n      role\n      status\n      department {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PromoteToAdmin($id: String!) {\n    promoteToAdmin(id: $id) {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation PromoteToAdmin($id: String!) {\n    promoteToAdmin(id: $id) {\n      id\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PromoteToDeptHead($id: String!) {\n    promoteToDeptHead(id: $id) {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation PromoteToDeptHead($id: String!) {\n    promoteToDeptHead(id: $id) {\n      id\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDepartmentStatus($id: String!, $status: GeneralStatus!) {\n    updateDepartmentStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDepartmentStatus($id: String!, $status: GeneralStatus!) {\n    updateDepartmentStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AssignDepartmentHead($id: String!, $head_id: String!) {\n    assignDepartmentHead(id: $id, head_id: $head_id) {\n      id\n      head {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AssignDepartmentHead($id: String!, $head_id: String!) {\n    assignDepartmentHead(id: $id, head_id: $head_id) {\n      id\n      head {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDepartment($name: String!, $head_id: String, $parent_department_id: String) {\n    createDepartment(name: $name, head_id: $head_id, parent_department_id: $parent_department_id) {\n      id\n      name\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDepartment($name: String!, $head_id: String, $parent_department_id: String) {\n    createDepartment(name: $name, head_id: $head_id, parent_department_id: $parent_department_id) {\n      id\n      name\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PromoteToAssetManager($id: String!) {\n    promoteToAssetManager(id: $id) {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation PromoteToAssetManager($id: String!) {\n    promoteToAssetManager(id: $id) {\n      id\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n    categories {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n"): (typeof documents)["\n  query GetCategories {\n    categories {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n    createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n    createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n    updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n    updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n      id\n      name\n      custom_fields_schema\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;