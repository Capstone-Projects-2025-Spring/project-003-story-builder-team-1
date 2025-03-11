import { ScrollArea, Box, Text } from '@mantine/core';
import React, { useRef } from 'react';
import './Chat_Area.css';

function Chat_Area({ messages }) {
    console.log('Messages in Chat_Area:', messages);
    const viewport = useRef(null);

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    }

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ScrollArea style={{ flexGrow: 1 }} viewportRef={viewport}>
            {messages.map((message, i) => 
                <div key={i} style={{ display: 'flex', justifyContent: message.is_ai ? 'flex-start' : 'flex-end', marginBottom: '10px' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', borderRadius: '10px', backgroundColor: '#333', padding: '1rem', maxWidth: '60%' }}>
                        {message.is_ai ? (
                            <>
                                <img className="chat-icons" src="/ai-icon.png" alt="AI" style={{ marginRight: '10px' }}/>
                                <Text className="txt">{message.text}</Text>
                            </>
                        ) : (
                            <>
                                <Text className="txt">{message.text}</Text>
                                <img className="chat-icons" src="/user-icon.png" alt="User" style={{ marginLeft: '10px' }}/>
                            </>
                        )}
                    </Box>
                </div>
            )}
        </ScrollArea>
    );
}

export default Chat_Area;