import { useState } from 'react';
import USE_AXIOS from './USE_AXIOS';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function USE_CREATE_ACCOUNT() {
    const [user_error, set_user_error] = useState('');
    const [pass_error, set_pass_error] = useState('');
    const [confirm_pass_error, set_confirm_pass_error] = useState('');
    const { use_axios } = USE_AXIOS();

    const create_account = async (username, password, confirm_password, strength) => {
        // reset errors
        let has_error = false;
        set_user_error('');
        set_pass_error('');
        set_confirm_pass_error('');

        // input handling
        // Check if username is alphanumeric
        const is_alphanumeric = /^[a-zA-Z0-9]+$/.test(username);
        if (!is_alphanumeric) {
            set_user_error('Username must be alphanumeric');
            has_error = true;
        }
        // check if password strength is max, if not set error *check this first so if input is empty, the empty input error shows
        if (strength !== 100) {
            set_pass_error('Password must be stronger');
            has_error = true;
        }

        // if any inputs are empty
        if (username === '') {
            set_user_error('Username must not be empty');
            has_error = true;
        }
        if (password === '') {
            set_pass_error('Password must not be empty');
            has_error = true;
        }

        // check if passwords match, if not set error message
        if (password !== confirm_password) {
            set_confirm_pass_error('Passwords must match');
            has_error = true;
        }

        // if no error, api call to backend
        if (!has_error) {
            const { data, error } = await use_axios(SERVER_URL + '/db/account_creation', 'POST', { username, password });
            if (data === null) {
                return { create_success: false, error: error };
            }

            return { create_success: true };
        }

        return { create_success: false };
    };

    return { create_account, user_error, pass_error, confirm_pass_error };
}

export default USE_CREATE_ACCOUNT;