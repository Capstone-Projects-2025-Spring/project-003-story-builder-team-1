import { useState } from 'react';

function USE_LOGIN() {
    const [error, setError] = useState('');

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                setError(message || 'Invalid username or password');
                return false;
            }

            setError('');
            return true;
        } catch (err) {
            setError('Something went wrong. Please try again.');
            return false;
        }
    };

    return { login, error };
}

export default USE_LOGIN;