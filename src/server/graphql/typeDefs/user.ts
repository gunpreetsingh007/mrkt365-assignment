const userTypeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type MessageResponse {
    message: String!
    statusCode: Int!
  }

  type Query {
    getUserDetails: User!
  }
  
  type Mutation {
    signUp(email: String!, name: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    editUserInterests(categoryId: ID!, isInterested: Boolean!): MessageResponse!
  }
`;

export default userTypeDefs;