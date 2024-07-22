import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [numBots, setNumBots] = useState(1);
  const [status, setStatus] = useState('');

  const startBots = async () => {
    try {
      setStatus('Starting bots...');
      const response = await axios.post('http://localhost:3000/start-bot', { url, numBots });
      setStatus(response.data);
    } catch (error) {
      console.error(error);
      setStatus('Error starting bots');
    }
  };

  return (
    <div className="App">
      <h1>Complex Bot Controller</h1>
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Bots"
        value={numBots}
        onChange={(e) => setNumBots(e.target.value)}
      />
      <button onClick={startBots}>Start Bots</button>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
