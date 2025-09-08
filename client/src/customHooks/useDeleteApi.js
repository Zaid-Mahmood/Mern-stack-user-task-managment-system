import axios from "axios";
import { useState } from "react";
export const useDeleteApi = (url) => {
    const [delloading, setDelLoading] = useState(false);
    const [delError, setDelError] = useState(null);
    const deleteRow = async (delIndex) => {
        try {
            setDelLoading(true)
            const response = await axios.post(url, delIndex, { withCredentials: true })
            return (response?.data)
        }
        catch (error) {
            setDelError(error.response.data?.message)
        }
        finally {
            setDelLoading(false)
        }
    }
    return {  deleteRow, delloading, delError }
}


