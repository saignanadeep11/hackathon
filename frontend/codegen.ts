import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.graphql', '!src/graphql/generated/**/*'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
