import { GraphQLError } from "graphql";
import { signAuthJwt } from "~/utils/jwt";
import { db } from "../db";
import bcrypt from 'bcrypt';
import getCurrentUserFromRequest from "../middlewares/currentUser";
import type { NextApiRequest } from "next";

const userController = (req: NextApiRequest) => ({
    getUserDetails: async () => {

        const currentUser = await getCurrentUserFromRequest(req);
        const userId = currentUser!.id;

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) {
            throw new GraphQLError('User not found', {
                extensions: {
                    code: 'NOT_FOUND',
                },
            })
        }

        return user;

    },
    signUp: async (email: string, name: string, password: string) => {

        if (await db.user.findUnique({ where: { email } })) {
            throw new GraphQLError('User already exists', {
                extensions: {
                    code: 'CONFLICT',
                },
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            },
            select: {
                id: true,
                name: true,
                email: true
            },
        });
        return { token: signAuthJwt({ id: user.id }), user }

    },
    login: async (email: string, password: string) => {

        const user = await db.user.findUnique({
            where: { email },
            select: { id: true, password: true, name: true, email: true },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new GraphQLError('Invalid credentials', {
                extensions: {
                    code: 'UNAUTHORIZED',
                },
            })
        }

        return { token: signAuthJwt({ id: user.id }), user: { id: user.id, name: user.name, email: user.email} }

    },
    editUserInterests: async (categoryId: string, isInterested: boolean) => {

        const currentUser = await getCurrentUserFromRequest(req);
        const userId = currentUser!.id;

        if (isInterested) {
            await db.userInterest.upsert({
                where: {
                    userId_categoryId: {
                        userId,
                        categoryId
                    }
                },
                create: {
                    userId,
                    categoryId
                },
                update: {
                    userId,
                    categoryId
                }
            })
        }
        else {
            await db.userInterest.deleteMany({
                where: {
                    userId,
                    categoryId
                }
            })
        }
        return { message : "Interest updated successfully", statusCode: 200 };

    },
});

export default userController;