import React, { useState } from 'react';
import { Textarea } from '@mantine/core';

const backend = 'http://localhost:8080/';
const text_box = backend + 'app/text_box/'; 

function Input_Text_Area() {
    const [input_string, set_input_string] = useState('');

    const handle_input_change = (event) => {
        set_input_string(event.target.value);
    };
    
    // Function for handling send clock
    const handle_send_click = async () => {
    // If input is empty, return from function
    const trimmed_input = input_string.trim();
    if (!trimmed_input) return;

    //Converts String to JSON data
    const data = {'Content': trimmed_input}

    //POSTing data to Backend
    try {
        const response = await fetch(text_box, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        })

        // Check if response status is an error, if yes throw an error
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        // Parse the response
        const res_data = await response.json();
        console.log('Success:', res_data);

        // Set messages from input or response from ai
        set_messages([
        ...messages,
        {text: input_string, is_ai: false},
        {text: res_data.message, is_ai: true}
        ]);

        // Clear the input box by resetting the input_string state
        set_input_string('');

    // Catch errors
    } catch (error) {
        console.error("Fetch Error: ", error)
    }
    };

    return (
        <Textarea
        placeholder="Autosize with no rows limit"
        label="Autosize with no rows limit"
        autosize
        minRows={1}
        maxRows={5}
        onChange={handle_input_change}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handle_send_click();
            }
          }}
        />
    );
}

export default Input_Text_Area;