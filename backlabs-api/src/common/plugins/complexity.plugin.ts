import { GraphQLSchemaHost } from '@nestjs/graphql';
import { Plugin } from '@nestjs/apollo';
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private schemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const { schema } = this.schemaHost;
    const maxComplexity = 100;

    await Promise.resolve();

    return {
      didResolveOperation: async ({ request, document }) => {
        const isIntrospection =
          request.operationName === 'IntrospectionQuery' ||
          request.query?.includes('__schema');

        if (isIntrospection) {
          return;
        }

        const complexity = getComplexity({
          schema,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        await Promise.resolve();
        if (complexity > maxComplexity) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`,
          );
        }

        console.log('Query Complexity:', complexity);
      },
    };
  }
}
