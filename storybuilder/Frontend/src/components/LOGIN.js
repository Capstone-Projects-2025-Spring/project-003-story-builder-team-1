import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
    Center,
    Flex
    } from '@mantine/core';

function LOGIN() {
return (
    <Container size="md" my={40}>
    <Title ta="center" >
        Welcome to StoryBuilderAI!
    </Title>
    <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
        Create account
        </Anchor>
    </Text>

    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Username" placeholder="Your username" required />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl">
        Sign in
        </Button>
    </Paper>
    </Container>

    );
}

export default LOGIN;