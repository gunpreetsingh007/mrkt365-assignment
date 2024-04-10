import type { ParentArguments, ResolverArguments, ServerContext } from "../server";

type PaginatedCategoriesInput = {
    page: number;
}
const categoryResolvers = {
    Query: {
        getPaginatedCategories: async (_: ParentArguments, { page }: PaginatedCategoriesInput, { models }: ServerContext ) => {
            return await models.Category.getPaginatedCategories(page);
        },
        getTotalPaginatedCountForCategories: async (_: ParentArguments, __: ResolverArguments, { models }: ServerContext) => {
            return await models.Category.getTotalPaginatedCountForCategories();
        },
    },
};
export default categoryResolvers;