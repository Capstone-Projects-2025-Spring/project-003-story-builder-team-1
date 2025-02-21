import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

const backend = 'http://localhost:8080/';
const text_box = backend + 'api/text_box/'; 

function App() {
  const [input_string, set_input_string] = useState('');
  const [confirmed_string, set_confirmed_string] = useState('');

  const handle_input_change = (event) => {
    set_input_string(event.target.value);
  };

  const handle_confirm_click = () => {
    set_confirmed_string(input_string);

    //Converts String to JSON data
    const data = {'Content': input_string}

    //POSTing data to Backend
    fetch(text_box, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    // handle response
    .then((response) => {
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    })
    .then((data) => console.log('Success:', data))
    .catch((error) => console.error('Fetch Error:', error));
  };

  return (
    <div>
      <div className="title">
        <h1>StoryBuilder</h1>
      </div>

      <div className="textbox">
        <input
          type="text"
          value={input_string}
          onChange={handle_input_change}
          placeholder="Enter text"
        />
        <button onClick={handle_confirm_click}>Confirm</button>
        {confirmed_string && <p>String inputted: {confirmed_string}</p>}
      </div>
    </div>
  );
}

export default App;
