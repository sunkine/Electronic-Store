import jwt from "jsonwebtoken"

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return false
        } else {
            return decoded
        }
    })
}

export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token === undefined) {
        return "No token found in the header";
    } else {
        return token;
    }
}

export const isLoggedin = (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);
    //verift the token
    const decodedUser = verifyToken(token);
    //save the user into req obj
    if (!decodedUser) {
        throw new Error("Invalid/Expired Token, please login again");
    }
    else {
        req.userAuthId = decodedUser?._id;
        next();
    }
}