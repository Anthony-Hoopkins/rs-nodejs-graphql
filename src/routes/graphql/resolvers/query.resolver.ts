/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { UUID } from 'crypto';
import { User } from '../types/types.js';
import { completeResolvers, UserModel } from '../models/user.model.js';

export const queryResolver = (prisma) => {
  return {
    users: async () => {
      const usersData: User[] = await prisma.user.findMany({
        include: {
          ...userInclude,
          subscribedToUser: { select: { subscriber: { include: { userSubscribedTo: true } } } },
          userSubscribedTo: { select: { author: { include: { subscribedToUser: true } } } },
        },
      });
      await completeResolvers(prisma);

      return usersData.map((user: User) => new UserModel(user));
    },
    // users: async () => {
    //   return await prisma.user.findMany({
    //     include: userInclude,
    //   });
    // },
    user: async ({ id }: { id: UUID }) => {
      const userData = await prisma.user.findUnique({
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

      if (userData === null) {
        return userData;
      }

      return { ...userData, userSubscribedTo, subscribedToUser };
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
      const type = await prisma.memberType.findMany({ where: { id: id } });
      return type.length === 0 ? null : { ...type[0] };
    },

    posts: () => {
      return prisma.post.findMany();
    },
    post: async ({ id }: { id: UUID }) => {
      const post = await prisma.post.findMany({ where: { id: id } });
      return post.length === 0 ? null : { ...post[0] }
    },
  };
};

export const userInclude = {
  profile: { include: { memberType: true } },
  posts: true,
};
