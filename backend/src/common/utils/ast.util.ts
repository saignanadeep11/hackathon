import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';

/**
 * Parses the GraphQL info object to extract requested fields.
 * This is used to prevent over-fetching in TypeORM by only selecting fields the frontend asked for.
 */
export function getSelectedFields(info: GraphQLResolveInfo): string[] {
  // graphqlFields returns a deeply nested object of all selected fields.
  // We extract the top-level keys which map to the entity columns.
  const parsedFields = graphqlFields(info);

  // Exclude GraphQL metadata fields like __typename
  const fields = Object.keys(parsedFields).filter(
    (key) => !key.startsWith('__'),
  );

  return fields;
}
