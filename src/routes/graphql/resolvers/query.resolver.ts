/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { UUID } from 'crypto';

export const queryResolver = (prisma) => {
  return {
    users: async () => {
      return await prisma.user.findMany({
        include: userInclude,
      });
    },
    user: async ({ id }: { id: UUID }) => {
      const result = await prisma.user.findUnique({
        where: { id },
        include: userInclude,
      });

      const userSubscribedToBasic = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: id },
        include: { author: { include: { subscribedToUser: true } } },
      });

      const authorSubscribers = userSubscribedToBasic.length > 0
        ? userSubscribedToBasic[0].author.subscribedToUser.map((subscr) => ({ id: subscr.subscriberId }))
        : {};

      const userSubscribedTo = userSubscribedToBasic.map((subscr) => {
        return {
          id: subscr.authorId,
          name: subscr.author.name,
          subscribedToUser: authorSubscribers,
        };
      });

      const subscribedToUserBasic = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: id },
        include: { subscriber: { include: { userSubscribedTo: true } } },
      });

      const userSubscribers = subscribedToUserBasic.length > 0
        ? subscribedToUserBasic[0].subscriber.userSubscribedTo.map((subscr) => ({ id: subscr.authorId }))
        : {};

      const subscribedToUser = subscribedToUserBasic.map((subscr) => {
        return {
          id: subscr.subscriberId,
          name: subscr.subscriber.name,
          userSubscribedTo: userSubscribers,
        };
      });

      if (result === null) {
        return result;
      }

      return {
        ...result,
        userSubscribedTo,
        subscribedToUser,
      };
    },

    profiles: () => {
      return prisma.profile.findMany();
    },
    profile: async ({ id }: { id: UUID }) => {
      return await prisma.profile.findUnique({ where: { id: id } });
    },

    memberTypes: () => {
      return prisma.memberType.findMany();
    },
    memberType: async ({ id }: { id: UUID }) => {
      return await prisma.memberType.findUnique({ where: { id: id } });
    },

    posts: () => {
      return prisma.post.findMany();
    },
    post: async ({ id }: { id: UUID }) => {
      return await prisma.post.findUnique({ where: { id: id } });
    },
  };
};

export const userInclude = {
  profile: { include: { memberType: true } },
  posts: true,
};
