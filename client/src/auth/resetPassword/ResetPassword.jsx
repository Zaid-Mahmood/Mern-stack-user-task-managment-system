import { useState } from 'react'
import { usePatchApi } from '../../customHooks/usePatchApi';
import { useParams } from 'react-router-dom';
import { ResetPasswordUtils, initialValues, validationSchema, submitBtn } from './ResetPasswordUtils';
import { Formik, Form, ErrorMessage } from 'formik';
import Login from '../login/Login';
const ResetPassword = () => {
  const { token } = useParams();
  const updatePswdUrl = `${import.meta.env.VITE_API_URL}reset-password/${token}`;
  const { patchData, updateData, updateError, updateLoading } = usePatchApi(updatePswdUrl);
  const [passwords, setPasswords] = useState({ newPassword: null, confirmPassword: null })
  const changeVal = (event, setFieldValue) => {
    const { name, value } = event.target;
    console.log(name, value, "changeVal")
    setFieldValue(name, value);
  }
  const submitValues = async (values) => {
    await patchData(values);
  }
  return (
    <>
      {updateError
        ?
        <p>{updateError}</p>
        :
        updateLoading ?
          <p>Loading ...</p>
          :
          updateData
            ?
            <Login />
            :
            <div className='h-screen content-center text-center'>
              <Formik initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={submitValues}
              >
                {({ values, setFieldValue }) =>
                (
                  <Form>
                    {ResetPasswordUtils.map((item, id) => (
                      <div key={id}>
                        <div className='flex items-center justify-center my-4' key={id}>
                          <label className='text-black w-[15%] text-lg'>{item.value}</label>
                          <input value={values[item.name] || ""} name={item.name} type={item.type} className='border-2 rounded-md px-4 py-2 w-2/10 text-center' onChange={(e) => changeVal(e, setFieldValue)} />
                          <br />
                        </div>
                         <p className='text-red-500 my-4'>
                            <ErrorMessage name={item.name} />
                          </p>
                      </div>
                    ))}
                    <button type='submit' className='text-white border-2 bg-blue-500 rounded-full px-4 py-2'>{submitBtn}</button>

                  </Form>
                )
                }
              </Formik>
            </div>
      }
    </>
  )
}

export default ResetPassword
