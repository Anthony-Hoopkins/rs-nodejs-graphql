import { GraphQLSchema } from 'graphql/type/index.js';
import { buildSchema } from 'graphql/utilities/index.js';

export const schemaQ = null;

export const schema: GraphQLSchema = buildSchema(`
  enum MemberTypeId {
    basic
    business
  }

  type User {
    id: UUID!
    name: String
    balance: Float
    profile: Profile
    posts: [Post]
    subscribedToUser: [SubscribedToUserList]
    userSubscribedTo: [UserSubscribedToList]
  }

  type Profile {
    id: UUID!
    memberType: MemberType
    isMale: Boolean
    yearOfBirth: Int
  }
  
  type MemberType {
    id: UUID!
    postsLimitPerMonth: Int
    discount: Float
  }

  type Post {
    id: UUID!
    title: String
    content: String
  }
  
  type SubscribedToFromUserId {
    id: UUID!
  }
  
  type UserSubscribedToList {
    id: UUID!
    name: String
    subscribedToUser: [SubscribedToFromUserId]
  }

  type SubscribedToUserList {
    id: UUID!
    name: String
    userSubscribedTo: [SubscribedToFromUserId]
  }

  type Query {
    user(id: UUID!): User
    users: [User]
    profile(id: UUID!): Profile
    profiles: [Profile]
    post(id: UUID!): Post
    posts: [Post]
    memberTypes: [MemberType]
    memberType(id: MemberTypeId!): MemberType
    usersSubscribedTo: [UserSubscribedToList]
    subscribedToUsers: [SubscribedToUserList]
  }
`);
