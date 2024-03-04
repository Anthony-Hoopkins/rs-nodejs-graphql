import { UUID } from 'crypto';
import { MemberTypeId } from '../../member-types/schemas.js';

export type Subscriber = { userId: UUID, authorId: UUID }
export type SubscriberAuthor = { userId: UUID, subscriberId: UUID }

export type Dto = { id: UUID, dto: unknown };
export type DtoOnly = { dto: unknown };

export type IdDto = { id: UUID };

export type User = {
  id: UUID;
  name: string;
  balance: number;
  profile: Profile;
  posts: Post[];
  subscribedToUser?: SubscribedToUser[];
  userSubscribedTo?: UserSubscribedTo[];
}

export type Post = {
  id: UUID;
  authorId: UUID;
  title: string;
  content: string;
};

export type Profile = {
  id: UUID;
  isMale: boolean;
  yearOfBirth: number;
  userId: UUID;
  memberTypeId: MemberTypeId.BASIC | MemberTypeId.BUSINESS;
  memberType: MemberType;
};

export type MemberType = {
  id: UUID;
  discount: number;
  postsLimitPerMonth: number;
}

export type SubscribedToUser = {
  subscriber: {
    id: UUID;
    balance: number;
    name: string;
    userSubscribedTo: Subscriber[];
  };
};

export type UserSubscribedTo = {
  author: {
    id: UUID;
    balance: number;
    name: string;
    subscribedToUser: SubscriberAuthor[];
  };
};
