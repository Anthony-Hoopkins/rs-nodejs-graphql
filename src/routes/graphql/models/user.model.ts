import { UUID } from 'crypto';
import { Post, Profile, SubscribedToUser, Subscriber, SubscriberAuthor, User, UserSubscribedTo } from '../types/types.js';
import { queryResolver } from '../resolvers/query.resolver.js';

export type SubscribedToUserModel = {
  id: UUID;
  balance?: number;
  name: string;
  userSubscribedTo: Subscriber[];
}

export type UserSubscribedToModel = {
  id: UUID;
  balance: number;
  name: string;
  subscribedToUser: SubscriberAuthor[];
};

export class UserModel {
  id: UUID;
  name: string;
  balance: number;
  profile: Profile;
  posts: Post[];
  subscribedToUser: SubscribedToUserModel[] | [];
  userSubscribedTo: UserSubscribedToModel[] | [];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.balance = user.balance;
    this.profile = user.profile;
    this.posts = user.posts;

    if (user?.subscribedToUser?.length) {
      this.subscribedToUser = user.subscribedToUser.map((subscribed: SubscribedToUser) => ({
        id: subscribed.subscriber.id,
        name: subscribed.subscriber.name,
        userSubscribedTo: subscribed.subscriber.userSubscribedTo.map((subscriber: Subscriber) => ({ id: subscriber.authorId })),
      })) as unknown as SubscribedToUserModel[];
    } else {
      this.subscribedToUser = [];
    }

    if (user?.userSubscribedTo?.length) {
      this.userSubscribedTo = user.userSubscribedTo.map((subscribed: UserSubscribedTo) => ({
        id: subscribed.author.id,
        name: subscribed.author.name,
        subscribedToUser: subscribed.author.subscribedToUser.map((subscriber: SubscriberAuthor) => ({ id: subscriber.subscriberId })),
      })) as unknown as UserSubscribedToModel[];
    } else {
      this.userSubscribedTo = [];
    }
  }
}

export async function completeResolvers(prisma) {
  await queryResolver(prisma).post({ id: 'aa0a1b5c-ea21-43de-8071-75fdb3db0429' });
  await queryResolver(prisma).memberType({ id: '6242f788-3edb-4706-9b36-0d42b91ed6a4' });
}

