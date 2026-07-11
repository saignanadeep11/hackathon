import { boot } from 'quasar/wrappers';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, createHttpLink, InMemoryCache, from } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { Notify } from 'quasar';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.GRAPHQL_URI || 'http://localhost:3000/graphql',
});

// Global Error Handling Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`);
      Notify.create({
        type: 'negative',
        message: `GraphQL Error: ${message}`,
        position: 'top',
      });
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    Notify.create({
      type: 'negative',
      message: 'Network Error: Cannot connect to server',
      position: 'top',
    });
  }
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default boot(({ app }) => {
  // Provide Apollo Client globally to Vue app
  app.provide(DefaultApolloClient, apolloClient);
});
