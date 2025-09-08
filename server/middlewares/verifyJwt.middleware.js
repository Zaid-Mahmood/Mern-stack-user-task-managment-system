import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const verifyJwt = asyncHandler( async (req, res, next) => {
    try {
        const accessCookies = await req.cookies?.accessToken;
        if (!accessCookies) throw new ApiError(404, "Access Cookies are missing")
        const decodeToken =  jwt.verify(accessCookies, process.env.ACCESS_TOKEN_SECRET_KEY);
        if (!decodeToken) throw new ApiError(404, "Can't decode the access token");
        const user = await User.findById(decodeToken._id);
        if (!user) throw new ApiError(404, "User doesnot found with the provided token id")
        req.user = user;
        next()
    }
    catch (err) {
        throw new ApiError(500, "Error found in verifying jwt token")
    }
}
)
export default verifyJwt;