import Account from "../models/account.model.js";

const isAdmin = async (req, res, next) => {

    //find user from db
    const user = await Account.findById(req.userAuthId);

    //check if user is admin
    if (user.Role) {
        next();
    } else {
        next(new Error("Access denied, admin only"));
    }
}
export default isAdmin