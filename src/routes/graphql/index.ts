import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { schema } from './shema.js';
import { queryResolver } from './resolvers/query.resolver.js';
import { mutationResolver } from './resolvers/mutation.resolver.js';
import depthLimit from 'graphql-depth-limit';

const NESTED_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const { prisma } = fastify;
      const source = req.body.query;
      const variableValues = req.body.variables;
      const rootValue = { ...queryResolver(prisma), ...mutationResolver(prisma) };

      const errors = validate(schema, parse(source), [depthLimit(NESTED_LIMIT)]);

      if (errors.length > 0) {
        return { errors };
      }

      return await graphql({
        schema,
        source,
        variableValues,
        rootValue,
      });
    },
  });
};

export default plugin;
