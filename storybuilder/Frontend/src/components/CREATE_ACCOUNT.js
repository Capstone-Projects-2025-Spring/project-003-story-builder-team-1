import { Anchor, Button, Container, Paper, PasswordInput, TextInput, Title, Progress, Text, Popover, Box } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import USE_CREATE_ACCOUNT from '../hooks/USE_CREATE_ACCOUNT';
import IconCheck from '@tabler/icons-react/dist/esm/icons/IconCheck';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX';

// rendering of the password requirements
function PASSWORD_REQUIREMENT({ meets, label }) {
return (
    <Text
    component="div"
    c={meets ? 'teal' : 'red'}
    style={{ display: 'flex', alignItems: 'center' }}
    mt={7}
    size="sm"
    >
    {meets ? <IconCheck size={14} /> : <IconX size={14} />}
    <Box ml={10}>{label}</Box>
    </Text>
);
}

// requirements for password
const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

// function to get the strength for the strength bar
function GET_STRENGTH(password) {
    let multiplier = password.length > 7 ? 0 : 1;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
        multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function CREATE_ACCOUNT() {
    const navigate = useNavigate();
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const { create_account, user_error, pass_error, confirm_pass_error, api_error } = USE_CREATE_ACCOUNT();
    const [popover_opened, set_popover_opened] = useState(false);
    const checks = requirements.map((requirement, index) => (
        <PASSWORD_REQUIREMENT key={index} label={requirement.label} meets={requirement.re.test(password)} />
    ));

    const strength = GET_STRENGTH(password);
    const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

    const handle_create_account = async () => {
        // send account info to backend for creation
        const create_success = await create_account(username, password, confirm_password, strength);
        if (create_success) {
            console.log("Account Creation Successful");
        }
        else {
            console.log("Account Creation Unsuccessful");
            console.log("API ERROR: ", api_error)
        }
    }

    const handle_login = () => {
        navigate("/");
    }

return (
    <Container size="sm" my={40}>
    <Title ta="center" >
        Create Your Account
    </Title>
    <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already Have An Account?{' '}
        <Anchor size="sm" component="button" onClick={handle_login}>
        Login
        </Anchor>
    </Text>

    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {/* Username Input Box */}
        <TextInput
            label="Username"
            placeholder="Your username" required
            value={username}
            onChange={(e) => set_username(e.target.value)}
            error={user_error}
        />

        {/* Password Input Box w/ Requirement Strength Meter Popup*/}
        <Popover opened={popover_opened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
            <Popover.Target>
                <div
                onFocusCapture={() => set_popover_opened(true)}
                onBlurCapture={() => set_popover_opened(false)}
                >
                <PasswordInput
                    label="Password"
                    placeholder="Your password" required
                    mt="md"
                    value={password}
                    onChange={(e) => set_password(e.target.value)}
                    error={pass_error}
                />
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <Progress color={color} value={strength} size={5} mb="xs" />
                <PASSWORD_REQUIREMENT label="Includes at least 8 characters" meets={password.length > 7} />
                {checks}
            </Popover.Dropdown>
        </Popover>

        {/* Confirm Password Input Box */}
        <PasswordInput
            label="Confirm Password"
            placeholder="Your password" required
            mt="md"
            value={confirm_password}
            onChange={(e) => set_confirm_password(e.target.value)}
            error={confirm_pass_error}
        />

        {/* Create Account Button */}
        <Button fullWidth mt="xl" onClick={handle_create_account}>
            Create Your Account
        </Button>
    </Paper>
    </Container>

    );
}

export default CREATE_ACCOUNT;