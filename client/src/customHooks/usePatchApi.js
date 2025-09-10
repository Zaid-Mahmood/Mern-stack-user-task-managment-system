import axios from "axios";
import { useState } from "react";
const usePatchApi = (url) => {
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateData, setUpdateData] = useState(null);

    const patchData = async (values) => {
        try {
            setUpdateLoading(true)
            axios.patch(url, values)
                .then((response) => setUpdateData(response?.data))
        }
        catch (error) {
            setUpdateError(error.response.data?.message)
        }
        finally {
            setUpdateLoading(false);
        }
    }
    return{patchData ,updateData , updateError ,  updateLoading}
}

export {usePatchApi};