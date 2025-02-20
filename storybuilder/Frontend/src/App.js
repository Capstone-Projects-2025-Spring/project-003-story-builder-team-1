import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

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
    fetch('http://localhost:3000', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
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
