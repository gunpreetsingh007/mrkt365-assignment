import jwt from "jsonwebtoken";

export const signAuthJwt = (user: {id: string }) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? '', {
        expiresIn: "1d",
    })
}

export const verifyJwt = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET ?? '')
}


// Define the expected structure of JWT payload
export type DecodedJwtPayload = {
    id: string;
};