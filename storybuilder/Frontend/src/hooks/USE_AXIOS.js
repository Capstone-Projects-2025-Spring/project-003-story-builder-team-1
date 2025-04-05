import axios from 'axios';

// axios hook so i dont need to repeat the error catching for calls.
function USE_AXIOS() {
    const use_axios = async (url, method = 'GET', data = null) => {
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
            const message = error.response?.data?.message || 'Something went wrong';
            return { data: null, error: message };
        }
    };

    return { use_axios };
}

export default USE_AXIOS;