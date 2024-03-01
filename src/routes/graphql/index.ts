import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { resolver } from './resolver.js';
import { schema } from './shema.js';

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
      const rootValue = resolver(prisma);

      return await graphql({
        schema,
        source,
        variableValues,
        rootValue,
        // contextValue: { db: prisma },
      });
    },
  });
};

export default plugin;
