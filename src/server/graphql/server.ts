import { ApolloServer } from "@apollo/server";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { GraphQLFormattedError } from "graphql";
import userController from "../controllers/user.controller";
import categoryController from "../controllers/category.controller";
import type { NextApiRequest, NextApiResponse } from "next";
import { unknown } from "zod";

export type Category = {
  id: string;
  name: string;
  isInterested: boolean;
}

export type User = {
  id: string;
  name: string;
  email: string;
}

export type AuthPayload = {
  token: string;
  user: User;
}

type MessageResponse = {
  message: string;
  statusCode: number;
}

// Define interfaces for unused parameters with optional properties
export type ParentArguments = unknown
export type ResolverArguments = Record<string, unknown>

interface UserController {
  getUserDetails: () => Promise<User>;
  signUp: (email: string, name: string, password: string) => Promise<AuthPayload>;
  login: (email: string, password: string) => Promise<AuthPayload>;
  editUserInterests: (categoryId: string, isInterested: boolean) => Promise<MessageResponse>;
}

interface CategoryController {
  getPaginatedCategories: (page: number) => Promise<Category[]>;
  getTotalPaginatedCountForCategories: () => Promise<number>;
}

export type Models = {
  User: UserController;
  Category: CategoryController;
};

export type ServerContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  models: Models;
}

export const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
    return {
      message: formattedError.message,
      code: formattedError.extensions?.code,
    }
  }
});

export const createServerContext = async (req: NextApiRequest, res: NextApiResponse): Promise<ServerContext> => ({
  req,
  res,
  models: {
    User: userController(req),
    Category: categoryController(req),
  },
})