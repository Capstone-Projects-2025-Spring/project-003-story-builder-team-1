import React, { useState } from 'react';
import { Textarea, Group, Button } from '@mantine/core';
import './Input_Text_Area.css';

function Input_Text_Area({ onSend }) {
  const [input_string, set_input_string] = useState('');

  const handle_input_change = (event) => {
    set_input_string(event.target.value);
  };
  
  // Function for handling send click
  const handle_send_click = async () => {
    // If input is empty, return from function
    const trimmed_input = input_string.trim();
    if (!trimmed_input) return;

    // Call the sendMessage function from the parent
    onSend(trimmed_input);

    // Clear the input field
    set_input_string('');
  };

  return (
    <Group align='center' style={{ width: '100%' }} gap="0.5rem">
      <Textarea
        placeholder="Enter Text Here"
        autosize
        minRows={1}
        maxRows={5}
        value={input_string}
        onChange={handle_input_change}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handle_send_click();
          }
        }}
        style={{ flexGrow: 1 }}
      />
      <button 
        onClick={handle_send_click} 
        style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center' }}
      >
        <img className="send-icon" src="/send-icon.png" alt="Send"/>
      </button>
    </Group>
  );
}

export default Input_Text_Area;