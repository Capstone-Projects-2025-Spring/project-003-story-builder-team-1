import React from 'react';
import { Button } from '@mantine/core';

function Side_Button({ text, onClick }) {
    return (
        <Button size="lg" fullWidth onClick={onClick} variant='filled' color="gray">
            {text}
        </Button>
    );
}

export default Side_Button;