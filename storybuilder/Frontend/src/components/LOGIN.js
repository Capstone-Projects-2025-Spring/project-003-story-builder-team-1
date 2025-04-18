import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title, } from '@mantine/core';
import { useState } from 'react';
import USE_LOGIN from '../hooks/USE_LOGIN';
import { useNavigate } from 'react-router';
import { USE_AUTH } from '../context/AUTH_CONTEXT';

function LOGIN() {
    const navigate = useNavigate();
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const { login, user_error, pass_error } = USE_LOGIN();
    const [api_error, set_api_error] = useState('');
    const { login_auth } = USE_AUTH();

    const handle_login = async () => {
        const { login_success, user_data, error } = await login(username, password);
        if (login_success) {
            console.log("Login Successful")
            console.log("response: ", user_data)
            login_auth(user_data);
            navigate(`/home`);
        }
        else {
            console.log("Login Unsuccessful");
            console.log("login_success: ", login_success)
            console.log("response: ", user_data)
            console.log("api_error: ", error)
            set_api_error(error);
        }
    }

    const handle_create_account = () => {
        navigate(`/account_creation`);
    }

return (
    <Container size="sm" my={40}>
    <Title ta="center" >
        Welcome to StoryBuilderAI!
    </Title>
    <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button" onClick={handle_create_account}>
        Create account
        </Anchor>
    </Text>

    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {/* Username Input Box */}
        <TextInput
            label="Username"
            placeholder="Your username" required
            value={username}
            onChange={(e) => set_username(e.target.value)}
            error={user_error || api_error}
        />

        {/* Password Input Box */}
        <PasswordInput
            label="Password"
            placeholder="Your password" required
            mt="md"
            value={password}
            onChange={(e) => set_password(e.target.value)}
            error={pass_error || api_error}
        />

        {/* Sign In Button */}
        <Button fullWidth mt="xl" onClick={handle_login}>
        Log in
        </Button>
    </Paper>
    </Container>

    );
}

export default LOGIN;