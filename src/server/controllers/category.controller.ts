import type { NextApiRequest } from "next";
import { db } from "../db";
import getCurrentUserFromRequest from "../middlewares/currentUser";

const CATEGORIES_PER_PAGE = 6;
const categoryController = (req: NextApiRequest) => ({
    getPaginatedCategories: async (page: number) => {
        const currentUser = await getCurrentUserFromRequest(req);
        const userId = currentUser!.id;

        // Calculate the pagination offset
        const offset = (page - 1) * CATEGORIES_PER_PAGE;

        const paginatedCategoriesWithInterest = await db.category.findMany({
            skip: offset,
            take: CATEGORIES_PER_PAGE,
            select: {
                id: true,
                name: true,
                users: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        userId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Map the categories to include a boolean for user interest
        const categoriesWithInterest = paginatedCategoriesWithInterest.map(category => {
            const { users, ...categoryWithoutUsers } = category;
            return {
                ...categoryWithoutUsers,
                isInterested: users.length > 0, // If the user has an interest, the array won't be empty
            };
        });
        return categoriesWithInterest;

    },
    getTotalPaginatedCountForCategories: async () => {

        await getCurrentUserFromRequest(req);
        const totalCategoryCount = await db.category.count();
        return Math.ceil(totalCategoryCount / CATEGORIES_PER_PAGE);

    },
});

export default categoryController;