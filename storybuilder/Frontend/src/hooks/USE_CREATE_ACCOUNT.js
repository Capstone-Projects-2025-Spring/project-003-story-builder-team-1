import { useState } from 'react';

function USE_CREATE_ACCOUNT() {
    const [is_error, set_is_error] = useState(false);
    const [user_error, set_user_error] = useState('');
    const [pass_error, set_pass_error] = useState('');
    const [confirm_pass_error, set_confirm_pass_error] = useState('');
    const [api_error, set_api_error] = useState('')

    const create_account = async (username, password, confirm_password, strength) => {
        // reset errors
        set_user_error('');
        set_pass_error('');
        set_confirm_pass_error('');

        // input handling
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
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                
                // *** this will need to check the response, if username taken set username error, if other error set api_error ***
                if (!response.ok) {
                    const { message } = await response.json();
                    set_api_error(message);
                    return false;
                }
    
                return true;
            } catch (err) {
                return false;
            }
        }
    };

    return { create_account, user_error, pass_error, confirm_pass_error, api_error };
}

export default USE_CREATE_ACCOUNT;