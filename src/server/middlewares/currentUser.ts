import { GraphQLError } from "graphql";
import type { NextApiRequest } from "next";
import { verifyJwt } from "~/utils/jwt";
import type { DecodedJwtPayload } from "~/utils/jwt";

const getCurrentUserFromRequest = async (req: NextApiRequest) => {
    let currentUser = null;

    const authHeader = req.headers.authorization ?? "";
    const token = authHeader?.split(' ')[1];
    if (token) {
      try {
        const decodedToken = verifyJwt(token) as DecodedJwtPayload;
        if (decodedToken?.id) {
          currentUser = { id: decodedToken.id };
        }
        else {
          throw new GraphQLError('Invalid Token', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }
      }
      catch (e) {
        throw new GraphQLError('Invalid Token', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
    }
    return currentUser;
}

export default getCurrentUserFromRequest;