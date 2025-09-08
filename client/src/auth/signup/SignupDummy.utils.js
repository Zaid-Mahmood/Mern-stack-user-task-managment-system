import * as yup from "yup";

const SignupUtils = [
    { name: "Name", type: "text" },
    { name: "Email", type: "email" },
    { name: "Password", type: "password" },
    { name: "PhoneNo", type: "text" },
    { name: "DOB", type: "date" }
];

const submitBtn = "Submit";

const initialValues = {
    Name: "",
    Email: "",
    Password: "",
    PhoneNo: "",
    DOB: ""
}

const validationSchema = yup.object().shape({
    Name: yup.string().required("Name is required"),
    Email: yup.string().required("Please enter your email").email("Please enter valid email"),
    Password: yup.string().required("Please enter your password"),
    PhoneNo:  yup
    .string()
    .test(
      "required",
      "Phone number is required",
      (value) => {
        const numericValue = value ? value.replace(/\D/g, '').substring(2) : '';
        return numericValue.length > 0;
      }
    )
    .test(
      "maxDigits",
      "10 digits are allowed to enter after +92-",
      (value) => {
        const numericValue = value ? value.replace(/\D/g, '').substring(2) : '';
        return numericValue.length >= 10;
      }
    ),
    DOB: yup.date()
        .transform((value, originalValue) => {
            const parsedDate = new Date(originalValue);
            return parsedDate;
        })
        .typeError('Invalid date format. Please use a valid date format (e.g., YYYY-MM-DD or Month Day, Year)') 
        .max(new Date(), "Date of Birth cannot be in the future") 
        .required('Date of Birth is required')
});     

export { SignupUtils, submitBtn, initialValues, validationSchema }