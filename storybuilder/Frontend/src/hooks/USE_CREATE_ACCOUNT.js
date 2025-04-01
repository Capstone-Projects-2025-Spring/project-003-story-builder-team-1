import { useState } from 'react';
import USE_AXIOS from './USE_AXIOS';

function USE_CREATE_ACCOUNT() {
    const [is_error, set_is_error] = useState(false);
    const [user_error, set_user_error] = useState('');
    const [pass_error, set_pass_error] = useState('');
    const [confirm_pass_error, set_confirm_pass_error] = useState('');
    const [api_error, set_api_error] = useState('');
    const { use_axios } = USE_AXIOS();

    const create_account = async (username, password, confirm_password, strength) => {
        // reset errors
        set_user_error('');
        set_pass_error('');
        set_confirm_pass_error('');
        set_api_error('');
        set_is_error(false);

        // input handling
        // Check if username is alphanumeric
        const is_alphanumeric = /^[a-zA-Z0-9]+$/.test(username);
        if (!is_alphanumeric) {
            set_user_error('Username must be alphanumeric');
            set_is_error(true);
        }
        // check if password strength is max, if not set error *check this first so if input is empty, the empty input error shows
        if (strength !== 100) {
            set_pass_error('Password must be stronger');
            set_is_error(true);
        }

        // if any inputs are empty
        if (username === '') {
            set_user_error('Username must not be empty');
            set_is_error(true);
        }
        if (password === '') {
            set_pass_error('Password must not be empty');
            set_is_error(true);
        }

        // check if passwords match, if not set error message
        if (password !== confirm_password) {
            set_confirm_pass_error('Passwords must match');
            set_is_error(true);
        }

        // if no error, api call to backend
        if (!is_error) {
            const { data, error } = await use_axios('/api/login', 'POST', { username, password });
            if (data === null) {
                set_api_error(error);
                set_is_error(true);
                return false;
            }

            return true;
        }

        return false;
    };

    return { create_account, user_error, pass_error, confirm_pass_error, api_error };
}

export default USE_CREATE_ACCOUNT;