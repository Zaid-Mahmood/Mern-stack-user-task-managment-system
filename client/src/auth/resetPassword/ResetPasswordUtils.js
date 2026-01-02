import * as yup from "yup";

export const ResetPasswordUtils = [
    { name: "newPassword", value: "New Password", type: "password" },
    { name: "confirmPassword", value: "Confirm Password", type: "password" },
]

export const initialValues = {
    newPassword: "",
    confirmPassword: ""
}

export const validationSchema = yup.object().shape({
    newPassword: yup.string().required("Please enter your new password"),
    confirmPassword: yup.string()
        .required("Confirm Password is a required field")
        .test("password-match", "Confirm Password and New Password must matched",
            function (value) {
                return (value === this.parent.newPassword)
            })
})

export const submitBtn = "Reset Password";