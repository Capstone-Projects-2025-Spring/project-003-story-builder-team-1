import { useState } from 'react';
import USE_AXIOS from './USE_AXIOS';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function USE_LOGIN() {
    const [is_error, set_is_error] = useState(false);
    const [user_error, set_user_error] = useState('');
    const [pass_error, set_pass_error] = useState('');
    const [api_error, set_api_error] = useState('');
    const { use_axios } = USE_AXIOS();

    const login = async (username, password) => {
        // reset errors
        set_user_error('');
        set_pass_error('');
        set_api_error('');
        set_is_error(false);

        // input handling
        // if any inputs are empty
        if (username === '') {
            set_user_error('Username must not be empty');
            set_is_error(true);
        }
        if (password === '') {
            set_pass_error('Password must not be empty');
            set_is_error(true);
        }

        // if no error, api call to backend
        if (!is_error) {
            const { data, error } = await use_axios(SERVER_URL + '/db/account_login', 'POST', { username, password });
            if (data === null) {
                set_api_error(error);
                set_is_error(true);
                return false;
            }
            // if no error return true
            return true;
        }

        return false
    };

    return { login, user_error, pass_error, api_error };
}

export default USE_LOGIN;