import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

const backend = 'http://localhost:8080/';
const text_box = backend + 'api/text_box/'; 

function App() {
  const [inputString, setInputString] = useState('');
  const [confirmedString, setConfirmedString] = useState('');

  const handleInputChange = (event) => {
    setInputString(event.target.value);
  };

  const handleConfirmClick = () => {
    setConfirmedString(inputString);

    //Converts String to JSON data
    const data = {'Content': inputString}

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
          value={inputString}
          onChange={handleInputChange}
          placeholder="Enter text"
        />
        <button onClick={handleConfirmClick}>Confirm</button>
        {confirmedString && <p>String inputted: {confirmedString}</p>}
      </div>
    </div>
  );
}

export default App;
