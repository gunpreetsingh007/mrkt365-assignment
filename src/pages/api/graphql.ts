import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { apolloServer, createServerContext } from "~/server/graphql/server";

export default startServerAndCreateNextHandler(apolloServer, {
    context: createServerContext
});