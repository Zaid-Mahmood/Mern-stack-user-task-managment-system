import mongooese, { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        Name: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        PhoneNo: {
            type: String,
            required: true
        },
        Password: {
            type: String,
            required: true
        },
        DOB: {
            type: Date,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next()
    this.Password = await bcrypt.hash(this.Password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    const comparePasswords = await bcrypt.compare(password, this.Password);
    return comparePasswords
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            Name: this.Name,
            Password: this.Password
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this.id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

export const User = new model("User", userSchema)

const resetPasswordSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        resetPasswordToken: {
            type: String,
            required: true
        },
        resetPasswordExpires: {
            type: Date,
            index: { expires: 0 }
        }
    }
)

export const ResetPassword = new model  ("ResetPassword", resetPasswordSchema);
