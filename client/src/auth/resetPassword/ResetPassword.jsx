import { useState } from 'react'
import { usePostApi } from '../../customHooks/usePostApi';
import { useParams } from 'react-router-dom';
import { ResetPasswordUtils } from './ResetPasswordUtils';
import Login from '../login/Login';
const ResetPassword = () => {
  const { token } = useParams();
  const postUrl = `${import.meta.env.VITE_API_URL}reset-password/${token}`;

  const { registerUser, loading, data, error } = usePostApi(postUrl)
  const [passwords, setPasswords] = useState({ newPassword: null, confirmPassword: null })
  const changeVal = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }))
  }
  const submitValues = async () => {
    await registerUser(passwords);
  }
  return (
    <>
      {error
        ?
        <p>{error}</p>
        :
        loading ?
          <p>Loading ...</p>
          :
          data
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
