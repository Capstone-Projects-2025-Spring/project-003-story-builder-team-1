import { useState } from 'react';

const backend = 'http://localhost:8080/';
const text_box = backend + 'app/text_box/'; 

const Use_Messages = () => {
    const [messages, set_messages] = useState([
        {
          text: "What story should I write?",
          is_ai: true,
        }
      ]);

  const Send_Message = async (input_string) => {
    const trimmed_input = input_string.trim();
    if (!trimmed_input) return;

    const data = { 'Content': trimmed_input };

    try {
      // Send the message to the backend
      const response = await fetch(text_box, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const res_data = await response.json();
      console.log('Success:', res_data);

      // Add the user's message and AI response to the state
      set_messages((prev_messages) => [
        ...prev_messages,
        { text: input_string, is_ai: false },
        { text: res_data.message, is_ai: true },
      ]);
    } catch (error) {
      console.error("Fetch Error: ", error);
    }
  };

  return {
    messages,
    Send_Message,
  };
};

export default Use_Messages;