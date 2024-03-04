import { GraphQLSchema } from 'graphql/type/index.js';
import { buildSchema } from 'graphql/utilities/index.js';

export const schemaQ = null;

export const schema: GraphQLSchema = buildSchema(`
  scalar UUID

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
  
  # Mutations:
    
  input CreatePostInput {
    authorId: String
    title: String
    content: String
  }
  
  input CreateUserInput {
    name: String
    balance: Float
  }
  
  input CreateProfileInput {
    userId: String
    memberTypeId: String
    isMale: Boolean
    yearOfBirth: Int
  }
  
  input ChangePostInput {
    authorId: String
    title: String
    content: String
  }
  
  input ChangeUserInput {
    name: String
    balance: Float
  }
  
  input ChangeProfileInput {
    memberTypeId: String
    userId: String
    isMale: Boolean
    yearOfBirth: Int
  }
  
  type Mutation {
    createUser(dto: CreateUserInput): User
    changeUser(id: UUID!, dto: ChangeUserInput): User
    deleteUser(id: UUID!): Boolean
    
    createProfile(dto: CreateProfileInput): Profile
    changePost(id: UUID!, dto: ChangePostInput): Post
    deleteProfile(id: UUID!): Boolean
    createPost(dto: CreatePostInput): Post
    deletePost(id: UUID!): Boolean
    changeProfile(id: UUID!, dto: ChangeProfileInput): Profile
  
    subscribeTo(userId: UUID!, authorId: UUID!): User
    unsubscribeFrom(userId: UUID!, authorId: UUID!): Boolean
  }
  
`);
