import { loginUtils, loginBtn, initialValues, validationSchema } from "./LoginDummy.utils";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostApi } from "../../customHooks/usePostApi";
import { FaRegEye } from "react-icons/fa";
import { Formik, Form, ErrorMessage } from "formik";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const loginUrl = `${import.meta.env.VITE_API_URL}login`;
  const [pswdSetting, setPswdSettings] = useState({ pswdEye: false, pswdFormat: "password" })
  const { data, error, registerUser, loading } = usePostApi(loginUrl)
  const changeVal = (event, setFieldValue) => {
    const { name, value } = event.target;
    setFieldValue(name, value)
    if (name === "Password") {
      setPswdSettings((prev) => ({ ...prev, pswdEye: true }))
    }
  }
  const handleSubmit = async (values) => {
    await registerUser(values);
  }

  const convertPassToText = (pswdValue) => {
    if (pswdValue && pswdSetting.pswdFormat === "password") {
      setPswdSettings((prev) => ({ ...prev, pswdFormat: "text" }))
    } else {
      setPswdSettings((prev) => ({ ...prev, pswdFormat: "password" }))
    }
  }

  useEffect(() => {
    if (data?.success) {
      setIsLoggedIn(true)
      navigate("/dashboard")
      localStorage.setItem("loggedUser" , JSON.stringify(data?.data?.loggedUser))
    }
  }, [data])

  return (
    <>
      {error ?
        error :
        loading ?
          <p>Loading ...</p>
          :
          <div className="h-screen content-center">
            <h2 className="text-center">Login Form</h2>
            <div className="flex justify-center">
              <div className="flex-col">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values, setFieldValue }) =>
                  (
                    <Form >
                      {loginUtils.map((item, id) => (
                        <div className="flex" key={id}>
                          <label className="text-black my-4 mx-4 w-24" >{item.name}</label>
                          {item.name === "Password" ?
                            <div className="relative w-64 my-4">
                              <input
                                onChange={(e) => {
                                  changeVal(e, setFieldValue)
                                }}
                                name={item.name}
                                className="border-2 border-black w-full"
                                type={pswdSetting.pswdFormat}
                              />
                              <Link to="/forgot-password" className="text-end cursor-pointer">Forgot Password</Link>
                              {pswdSetting.pswdEye && values.Password.length > 0 && <FaRegEye onClick={() => convertPassToText(values.Password)} className="absolute top-[30%] right-2 -translate-y-1/2 cursor-pointer" />}
                              <p className='text-red-500 my-4'>
                                <ErrorMessage name='Password' />
                              </p>
                            </div>
                            :
                            <div className="flex-col">
                              <input
                                onChange={(e) => {
                                  changeVal(e, setFieldValue)
                                }}
                                name={item.name} className="border-2 border-black my-4 w-64" type={item.type} />
                              <p className='text-red-500'>
                                <ErrorMessage name={item.name} />
                              </p>
                            </div>
                          }
                        </div>
                      ))}
                      <p className="my-5">If you donot have an account then please <Link className="text-blue-500 underline" to="/sign-up">signup</Link> first</p>
                      <div className="text-center">
                        <button type="submit" className="text-white cursor-pointer bg-blue-500 rounded-full px-5 py-2 text-white">{loginBtn}</button>
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

export default Login
