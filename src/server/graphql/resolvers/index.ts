import categoryResolvers from "./category.resolver";
import userResolvers from "./user.resolver";

export default {
    Query: {
        ...userResolvers.Query,
        ...categoryResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
    }
}