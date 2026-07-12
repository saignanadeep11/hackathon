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
    "mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}": typeof types.CreateCategoryDocument,
};
const documents: Documents = {
    "query GetAssets($filter: AssetFilterInput) {\n  assets(filter: $filter) {\n    id\n    asset_tag\n    name\n    serial_number\n    acquisition_date\n    acquisition_cost\n    condition\n    location\n    is_shared_bookable\n    status\n    custom_fields_data\n    photo_url\n    createdAt\n    category {\n      id\n      name\n    }\n  }\n}\n\nquery GetCategories {\n  categories {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nmutation RegisterAsset($input: RegisterAssetInput!) {\n  registerAsset(input: $input) {\n    id\n    asset_tag\n    name\n  }\n}": types.GetAssetsDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    user {\n      id\n      name\n      email\n      role\n      status\n    }\n  }\n}\n\nquery Me {\n  me {\n    id\n    name\n    email\n    role\n    status\n  }\n}": types.LoginDocument,
    "mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}": types.CreateCategoryDocument,
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
export function graphql(source: "mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}"): (typeof documents)["mutation CreateCategory($name: String!, $customFieldsSchema: String!) {\n  createCategory(name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}\n\nquery GetCategoriesPage($filter: CategoryFilterInput, $first: Float, $after: String, $last: Float, $before: String) {\n  categoriesPage(\n    filter: $filter\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        name\n        custom_fields_schema\n      }\n    }\n  }\n}\n\nmutation UpdateCategory($id: String!, $name: String, $customFieldsSchema: String) {\n  updateCategory(id: $id, name: $name, customFieldsSchema: $customFieldsSchema) {\n    id\n    name\n    custom_fields_schema\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;