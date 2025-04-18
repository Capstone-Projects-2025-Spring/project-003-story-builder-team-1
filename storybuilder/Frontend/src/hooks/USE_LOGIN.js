import { useState } from 'react';
import USE_AXIOS from './USE_AXIOS';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import { USE_USER } from '../context/USER_CONTEXT';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function USE_LOGIN() {
    const [user_error, set_user_error] = useState('');
    const [pass_error, set_pass_error] = useState('');
    const { use_axios } = USE_AXIOS();
    const { login_auth } = USE_AUTH();
    const { fetch_user_data } = USE_USER();

    const login = async (username, password) => {
        // reset errors
        let has_error = false;
        set_user_error('');
        set_pass_error('');

        // input handling
        // if any inputs are empty
        if (username === '') {
            set_user_error('Username must not be empty');
            has_error = true;
        }
        if (password === '') {
            set_pass_error('Password must not be empty');
            has_error = true;
        }

        // if no error, api call to backend
        if (!has_error) {
            const { data, error } = await use_axios(SERVER_URL + '/db/account_login', 'POST', { username, password });
            if (data === null) {
                return { login_success: false, error: error };
            }

            // update auth context
            login_auth(data);

            // get db calls for user context when login success
            await fetch_user_data(data.user_id);

            // if no error return true
            return { login_success: true, user_data: data };
        }

        return { login_success: false };
    };

    return { login, user_error, pass_error };
}

export default USE_LOGIN;