import { boot } from 'quasar/wrappers';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, createHttpLink, InMemoryCache, from } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { Notify } from 'quasar';

import { setContext } from '@apollo/client/link/context';
import { useAuthStore } from 'src/stores/auth.store';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('assetflow_access_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

// Global Error Handling Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`);
      
      // Auto-logout on unauthorized
      if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Unauthorized') || message.includes('log in')) {
        const authStore = useAuthStore();
        void authStore.clearSession();
        // Redirect will be handled by router guards if state changes, or we can force reload
        window.location.href = '/#/login'; 
      }
      
      Notify.create({
        type: 'negative',
        message: `Error: ${message}`,
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
  link: from([errorLink, authLink, httpLink]),
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
