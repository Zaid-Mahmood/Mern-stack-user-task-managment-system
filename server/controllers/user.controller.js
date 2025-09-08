import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User, ResetPassword } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const currentUser = await User.findById(userId);
        const accessToken = await currentUser?.generateAccessToken();
        const refreshToken = await currentUser?.generateRefreshToken();
        currentUser.refreshToken = refreshToken;
        await currentUser.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    }
    catch (err) {
        throw new ApiError(500, "Something went wrong while generating access token and refresh token")
    }
}

const sendResetLink = async (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD 
        }
    })
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
        from: "Precise Tech Development Team",
        to: email,
        subject: 'Password Reset',
        html: `
        <p>Hello,</p>
        <p>You recently requested a password reset for your Precise Tech account.</p>
        <p>Our system has generated a secure link for you to reset your password.</p>
        <p>Please click the link below to proceed:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p><strong>Note:</strong> This link is valid for 1 hour. If you did not request this, please ignore this message.</p>
        <br>
        <p>Best regards,</p>
        <p>Zaid Mahmood<br>
        Next.js Developer<br>
        Precise Tech</p>
` };

    await transporter.sendMail(mailOptions);
}

const registerUser = asyncHandler(async (req, res) => {
    const { Name, Email, PhoneNo, Password, DOB } = req.body;
    if ([Name, Email, PhoneNo, Password, DOB].some(field =>
        field === ""
    )) throw new ApiError(401, "All fields are required !!")
    const userExists = await User.findOne(
        {
            $or: [{ Name }, { Email }]
        })

    if (userExists) throw new ApiError(401, "User already exists")

    const createUser = await User.create({
        Name, Email, PhoneNo, Password, DOB
    })

    const userCreated = await User.findById(createUser?._id).select("-Password");

    if (!userCreated) throw new ApiError(401, "User doesnot created !!")

    return res
        .status(200)
        .json(new ApiResponse(200, userCreated, "User has been registered successfully !!"))
})


const loginUser = asyncHandler(async (req, res) => {
    const { Name, Email, Password } = req.body;
    if ([Name, Email].some(field => field === "")) throw new ApiError(404, "Name or Email is not provided")

    const user = await User.findOne({
        $and: [{ Name }, { Email }]
    })

    if (!user) throw new ApiError(404, "Name or Email doesnot exist in database");

    const comparePassword = await user.isPasswordCorrect(Password);
    if (!comparePassword) throw new ApiError(401, "Please enter correct password");

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select("-Password");


    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true
        })
        .json(new ApiResponse(200, { loggedUser }, "User logged in successfully !!"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await req.user?._id;
    await User.findByIdAndUpdate(
        user,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie("accessToken", { httpOnly: true, secure: true })
        .clearCookie("refreshToken", { httpOnly: true, secure: true })
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const generateLink = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(email , "email")
    if (!email) throw new ApiError(404, "Email is not provided")

    const user = await User.findOne({ Email: email })
    if (!user) throw new ApiError(404, "User doesnot found with the provided email")

    const resetToken = CryptoJS.HmacSHA1(email, process.env.APP_PASSWORD_SECRET_KEY, { outputLength: 224 }).toString(CryptoJS.enc.Hex);

    if (!resetToken) throw new ApiError(404, "Reset token is not provided")

    await ResetPassword.findByIdAndUpdate(
        user._id,
        {
            $set: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000)
            }
        },
        {
            new: true, upsert: true
        }
    )
    await sendResetLink(email, resetToken)
    return res.status(200)
        .json(new ApiResponse(200, {}, "Link has been send successfully"))
})

const resetPassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;
    if (!token) throw new ApiError(404, "Token doesnot found")
    if (!(newPassword === confirmPassword)) throw new ApiError(401, "New password doesnot match with confirm password")
    const userExisted = await ResetPassword.findOne({ resetPasswordToken: token });
    if (!userExisted) throw new ApiError(404, "User doensot found with the provided token")
    const matchUserId = await User.findById(userExisted?._id).select("-Password");
    if (!matchUserId) throw new ApiError(404, "User doesnot found")
    matchUserId.Password = newPassword;
    await matchUserId.save({ validateBeforeSave: false });
    const userResponse = delete matchUserId?.Password;
    return res.status(200).json(new ApiResponse(200, { userResponse }, "Password has been resetted successfully"))
})

export { registerUser, loginUser, logoutUser, generateLink, resetPassword }