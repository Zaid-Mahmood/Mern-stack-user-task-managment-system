import { useState } from "react";
import { usePostApi } from "../../customHooks/usePostApi";

const ForgotPassword = () => {
    const postUrl = `${import.meta.env.VITE_API_URL}generate-link`;

    const { registerUser, data, loading, error } = usePostApi(postUrl)
    const [emailValueAndValid, setEmailValueAndValid] = useState({
        emailValue: null,
        isEmailValid: null,
        emailRequiredStatus: false
    });

    const changeVal = (event) => {
        setEmailValueAndValid((prev) => ({ ...prev, emailValue: event.target.value }))
    }

    const generateLink = async () => {
        if (!emailValueAndValid.emailValue) {
            setEmailValueAndValid((prev) => ({ prev, emailRequiredStatus: true }))
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const matchFound = emailRegex.test(emailValueAndValid.emailValue);
        if (!matchFound) {
            setEmailValueAndValid((prev) => ({ ...prev, isEmailValid: matchFound }));
        }
        if (matchFound) {
            setEmailValueAndValid((prev) => ({ ...prev, isEmailValid: matchFound }))
            await registerUser({ email: emailValueAndValid.emailValue })
        }
        if (data) {
            alert("Email has been sent to your registered email address")
        }
    }
    return (
        <>
            {error ?
                <p>{error}</p>
                :
                loading ?
                    <p>Loading...</p>
                    :
                    <div className="text-center content-center h-svh">
                        <h2 className="text-black font-medium text-xl">Enter your registered email address</h2>
                        <br />
                        <input className={`border-2 rounded-md px-4 py-2 w-1/4 text-center ${emailValueAndValid.isEmailValid === false || (emailValueAndValid.emailRequiredStatus && !emailValueAndValid.emailValue) ? 'border-red-500' : 'border-black'}`} type="email" onChange={changeVal} />
                        <br /><br />
                        {emailValueAndValid.emailRequiredStatus && !emailValueAndValid.emailValue ? <p className="text-red-500">Email is required</p> : emailValueAndValid.isEmailValid === false ? <p className="text-red-500">Email format is not correct</p> : null}
                        <button type="submit" className="cursor-pointer text-white bg-blue-500 border-2 rounded-full px-4 py-2" onClick={generateLink}>Generate Link</button>
                    </div>
            }
        </>
    )
}

export default ForgotPassword;
