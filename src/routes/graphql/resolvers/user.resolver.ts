import { userInclude } from './query.resolver.js';

export const userResolver = async (prisma) => {
  return await prisma.user.findMany({
    include: userInclude,
  });
};
