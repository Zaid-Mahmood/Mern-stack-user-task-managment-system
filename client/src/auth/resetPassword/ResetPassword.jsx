import { useState } from 'react'
import { usePatchApi } from '../../customHooks/usePatchApi';
import { useParams } from 'react-router-dom';
import { ResetPasswordUtils } from './ResetPasswordUtils';
import Login from '../login/Login';
const ResetPassword = () => {
  const { token } = useParams();
  const updatePswdUrl = `${import.meta.env.VITE_API_URL}reset-password/${token}`;
  const { patchData, updateData, updateError, updateLoading } = usePatchApi(updatePswdUrl);
  const [passwords, setPasswords] = useState({ newPassword: null, confirmPassword: null })
  const changeVal = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }))
  }
  const submitValues = async () => {
    await patchData(passwords);
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
              {ResetPasswordUtils.map((item, id) => (
                <div className='flex items-center justify-center my-4' key={id}>
                  <label className='text-black w-[10%]'>{item.value}</label>
                  <input name={item.name} type={item.type} className='border-2 border-black' onChange={changeVal} />
                  <br /> <br />
                </div>
              ))}
              <button onClick={submitValues} type='submit' className='text-white border-2 bg-blue-500 rounded-full px-4 py-2'>Reset Password</button>
            </div>
      }
    </>
  )
}

export default ResetPassword
