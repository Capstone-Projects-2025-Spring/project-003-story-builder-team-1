import axios from 'axios';
import { useCallback } from 'react';

// axios hook so i dont need to repeat the error catching for calls.
function USE_AXIOS() {
    const use_axios = useCallback(async (url, method = 'GET', data = null) => {
        try {
            const response = await axios({
                url,
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                data,
            });

            return { data: response.data, error: null };
        } catch (error) {
            console.log("error: ", error)
            const message = error.response?.data?.error || 'Something went wrong';
            return { data: null, error: message };
        }
    }, []);

    return { use_axios };
}

export default USE_AXIOS;