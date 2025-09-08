import * as yup from "yup";

const loginUtils = [
    { name: "Name", type: "text" },
    { name: "Email", type: "email" },
    { name: "Password", type: "password" }
]

const loginBtn = "Login"

const initialValues = {
    Name: "",
    Email: "",
    Password: ""
}

const validationSchema = yup.object().shape({
    Name: yup.string().required("Please enter your name"),
    Email: yup.string().required("Please enter your email").email("Please enter valid email"),
    Password: yup.string().required("Please enter your password")
})

export { loginUtils, loginBtn, initialValues, validationSchema }