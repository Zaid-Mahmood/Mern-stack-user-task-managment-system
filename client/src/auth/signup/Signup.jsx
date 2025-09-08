import { initialValues, SignupUtils, submitBtn, validationSchema } from "./SignupDummy.utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostApi } from "../../customHooks/usePostApi";
import { Formik, Form, ErrorMessage } from "formik";
import { FaEye } from "react-icons/fa";

const Signup = () => {
    const navigate = useNavigate();
    const postUrl = `${import.meta.env.VITE_API_URL}register`;
    const [pswdFormat, setPswdFormat] = useState({ eyeIcon: false, pswdType: "password" });
    const { registerUser, data, loading, error } = usePostApi(postUrl);

    const changePswdFormat = () => {
        pswdFormat.pswdType === "password" ?
            setPswdFormat((prev) => ({ ...prev, pswdType: "text" }))
            :
            setPswdFormat((prev) => ({ ...prev, pswdType: "password" }))
    }

    const handlePhoneNumberChange = (e, setFieldValue) => {
        const { value } = e.target;
        const prefix = '+92-';
        if (!value.startsWith(prefix)) {
            setFieldValue('PhoneNo', prefix);
        }

        const numericValue = value.substring(prefix.length).replace(/[^\d]/g, '');

        let formattedValue = '';
        if (numericValue.length > 0) {
            formattedValue += numericValue.slice(0, 3);
            if (numericValue.length > 3) {
                formattedValue += '-' + numericValue.slice(3, 10);
            }
        }
        setFieldValue('PhoneNo', prefix + formattedValue);
    };

    const changeVal = (e, setFieldValue) => {
        const { name, value } = e.target;
        setFieldValue(name, value);
    };
    const handleSubmit = async (values) => {
        const digitsOnly = values.PhoneNo.replace(/\D/g, '');
        let normalized;
        if (digitsOnly.startsWith('92')) {
            normalized = digitsOnly.substring(2);
        } else if (digitsOnly.startsWith('0')) {
            normalized = digitsOnly.substring(1);
        } else {
            normalized = digitsOnly;
        }

        const formattedPhone = `+92-${normalized.slice(0, 3)}-${normalized.slice(3, 10)}`;
        const formattedValues = {
            ...values,
            PhoneNo: formattedPhone
        };

        await registerUser(formattedValues);
    };

    useEffect(() => {
        if (data?.success) {
            navigate("/")
        }
    }, [data]);

    return (
        <>
            {error ?
                <p>{error}</p>
                :
                loading ?
                    <p className="text-black">Loading ...</p>
                    :
                    <div className="h-screen content-center">
                        <h2 className="text-center text-white font-bold bg-blue-500 border-blue-500 border-2 rounded-full w-[15%] p-4 mx-auto">SignUp Form</h2>
                        <div className="flex justify-center">
                            <div className="flex-col">
                                <Formik
                                    initialValues={{ ...initialValues, PhoneNo: '+92-' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, setFieldValue }) => (
                                        <Form>
                                            {SignupUtils.map((item, id) => (
                                                <div className="flex" key={id}>
                                                    <label className="text-black my-4 mx-4 w-24" htmlFor="vals">{item.name}</label>
                                                    {item.name === "Password"
                                                        ?
                                                        <div className="relative my-4 w-64">
                                                            <input name={item.name} onChange={(e) => changeVal(e, setFieldValue)} className=" border-black border-2 w-full" type={pswdFormat.pswdType} />
                                                            {values.Password?.length > 0 && <FaEye onClick={changePswdFormat} className=" cursor-pointer absolute top-[30%] -translate-1/2 right-0" />}
                                                            <p className='text-red-500 my-4'>
                                                                <ErrorMessage name='Password' />
                                                            </p>
                                                        </div>
                                                        :
                                                        item.name === "PhoneNo"
                                                            ?
                                                            <>
                                                                <div className="relative my-4 w-64">
                                                                    <input
                                                                        name={item.name}
                                                                        onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                                                                        className=" border-black border-2 w-full"
                                                                        value={values.PhoneNo}
                                                                        type={item.type}
                                                                    />
                                                                    <p className='text-red-500 my-4'>
                                                                        <ErrorMessage name={item.name} />
                                                                    </p>
                                                                </div>
                                                            </>
                                                            :
                                                            <div className="flex-col">
                                                                <input name={item.name} onChange={(e) => changeVal(e, setFieldValue)} className="border-2 border-black my-4 w-64" type={item.type} />
                                                                <p className='text-red-500 my-4'>
                                                                    <ErrorMessage name={item.name} />
                                                                </p>
                                                            </div>
                                                    }
                                                </div>
                                            ))}
                                            <div className="text-center">
                                                <button type="submit" className="bg-blue-500 rounded-full px-5 py-2 text-white cursor-pointer">{submitBtn}</button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Signup;