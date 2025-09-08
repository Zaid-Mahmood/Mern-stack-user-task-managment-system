import axios from "axios";
import { useState } from "react";

const useGetApi = (url) => {
    const [getLoading, setGetLoading] = useState(false);
    const [getError, setGetError] = useState(null);

    const commonGetFunction = async () => {
        try {
            setGetLoading(true);
            const response = await axios.get(url, { withCredentials: true })
            return response.data
        }
        catch (err) {
            setGetError(err.response.data?.message)
        }
        finally {
            setGetLoading(false);
        }
    }
    return { commonGetFunction, getLoading, getError }

}

export { useGetApi }