import axios from "axios";
import { useState } from "react";

export const usePostApi = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const registerUser = async (registerValues) => {
        try {
            setLoading(true)
          await axios.post(url, registerValues , {withCredentials : true} )
                .then(response => setData(response?.data))
        }
        catch (err) {
            setError(err.response.data?.message)
        }
        finally {
            setLoading(false)
        }
    }
    return { registerUser, data, loading, error }
}