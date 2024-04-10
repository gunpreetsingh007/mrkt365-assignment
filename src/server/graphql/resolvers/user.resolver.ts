import type { ParentArguments, ResolverArguments, ServerContext } from "../server";
export type SignUpInput = {
    email: string;
    name: string;
    password: string;
}
export type LoginInput = {
    email: string;
    password: string;
}
type EditUserInterestInput = {
    categoryId: string;
    isInterested: boolean;
}
const userResolvers = {
    Query: {
        getUserDetails: async (_: ParentArguments , __: ResolverArguments, { models }: ServerContext ) => {
            return await models.User.getUserDetails();
        },
    },
    Mutation: {
        signUp: async (_: ParentArguments, { email, name, password }: SignUpInput, { models }: ServerContext ) => {
            return await models.User.signUp(email, name, password);
        },
        login: async (_: ParentArguments, { email, password }: LoginInput, { models }: ServerContext ) => {
            return await models.User.login(email, password);
        },
        editUserInterests: async (_: ParentArguments, { categoryId, isInterested }: EditUserInterestInput, { models }: ServerContext ) => {
            return await models.User.editUserInterests(categoryId, isInterested);
        },
    },
};

export default userResolvers;