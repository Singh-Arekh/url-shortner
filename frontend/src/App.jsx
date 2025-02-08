import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/short`, { originalUrl })
      .then((res) => {
        setShortUrl(res.data.url.shortUrl);
        console.log("API response:", res.data.url.shortUrl);
      })
      .catch((err) => console.log(err));
    console.log("Original URL:", originalUrl);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>URL Shortener</h1>
        <input
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          name="originalUrl"
          type="text"
          placeholder="Enter a URL to shorten"
        />
        <button onClick={handleSubmit} type="button">Shorten</button>

        {shortUrl && (
          <div className="short-url-container">
            <p>Shortened URL:</p>
            <a href={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${shortUrl}`} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
