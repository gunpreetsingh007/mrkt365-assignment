const categoryTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    isInterested: Boolean
  }

  type Query {
    getPaginatedCategories(page: Int!): [Category!]!
    getTotalPaginatedCountForCategories: Int!
  }
`;

export default categoryTypeDefs;