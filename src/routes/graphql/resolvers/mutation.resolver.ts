/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { queryResolver } from './query.resolver.js';
import { Dto, DtoOnly, IdDto, Subscriber } from '../types/types.js';

export const mutationResolver = (prisma) => {
  return {
    createPost: async (post) => {
      return await prisma.post.create({
        data: post.dto,
      });
    },
    changePost: async ({ id, dto }: Dto) => {
      try {
        return await prisma.post.update({ where: { id }, data: dto });
      } catch {
        return false;
      }
    },
    deletePost: async ({ id }: IdDto) => {
      try {
        await prisma.post.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },

    createUser: async (dto: DtoOnly) => {
      return await prisma.user.create({
        data: dto.dto,
      });
    },
    changeUser: async ({ id, dto }: Dto) => {
      try {
        return await prisma.user.update({ where: { id }, data: dto });
      } catch {
        return false;
      }
    },
    deleteUser: async ({ id }: IdDto) => {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },

    createProfile: async (dto: DtoOnly) => {
      return await prisma.profile.create({
        data: dto.dto,
      });
    },
    changeProfile: async ({ id, dto }: Dto) => {
      const profile = await queryResolver(prisma).profile({ id });

      if (profile) {
        return await prisma.profile.update({ where: { id }, data: dto });
      }
      return new Error('Field "userId" is not defined by type "ChangeProfileInput"');
    },
    deleteProfile: async ({ id }: IdDto) => {
      try {
        await prisma.profile.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },

    subscribeTo: async (subscriber: Subscriber) => {
      const subscribeAuthor = { subscriberId: subscriber.userId, authorId: subscriber.authorId };

      await prisma.subscribersOnAuthors.create({
        data: subscribeAuthor,
      });

      return await queryResolver(prisma).user({ id: subscriber.userId });
    },
    unsubscribeFrom: async (subscriber: Subscriber) => {
      const unsubscribeAuthor = { subscriberId: subscriber.userId, authorId: subscriber.authorId };

      try {
        await prisma.subscribersOnAuthors.delete({ where: { subscriberId_authorId: unsubscribeAuthor } });
        return true;
      } catch {
        return false;
      }
    },
  };
};
