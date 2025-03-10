import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

const backend = 'http://localhost:8080/';
const text_box = backend + 'app/text_box/'; 

function App() {
  // Hook to keep track of end of messages
  const message_end = useRef(null);
  // State for string in input text box
  const [input_string, set_input_string] = useState('');
  // State array of message objects, holds the message and if the message is from the ai or not
  const [messages, set_messages] = useState([
    {
      text: "What story should I write?",
      is_ai: true,
    }
  ]);

  // Hook to scroll to end of messages everytime messages is updated
  useEffect(() => {
    message_end.current.scrollIntoView();
  }, [messages])

  // Function for input text box event handling
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
    <div className="App">

      {/* Sidebar: Contains logo (and past stories? and agent creation and agent selection button to be later implemented)*/}
      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="Logo"></img><span className="logo-name">StoryBuilderAI</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main">
        {/* Chat Messages */}
        <div className="chats">
          {messages.map((message, i) => 
            <div key={i} className={message.is_ai ? "chat ai" : "chat"}>
              <img className="chat-icons" src={message.is_ai ? "/ai-icon.png" : "/user-icon.png"} alt="AI"/><p className="txt">{message.text}</p>
            </div>
          )}
          <div ref={message_end}/>
        </div>

        {/* Chat Footer: User Input & Send Button */}
        <div className="chat-footer">
          <div className="input-box">
          <input
          type="text"
          value={input_string}
          onChange={handle_input_change}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handle_send_click();
            }
          }}
          placeholder="Enter text"
          />
          <button className="send-button" onClick={handle_send_click}><img className="send-icon" src="/send-icon.png" alt="Send"/></button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
