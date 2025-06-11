import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // States
  const [text, setText] = useState('');
  const [updatedText, setUpdatedText] = useState('');
  const [keywords, setKeywords] = useState({});

  // Handle textarea input
  function handleChange(e) {
    setText(e.target.value);
  }

  // Handle analyze button click
  function handleSubmit() {
    axios.post('http://localhost:3001/api/analyze', { text })
      .then((response) => {
        const data = response.data;
        setUpdatedText(data.updatedText);
        setKeywords(data.keywords || {}); //  Convert object to array
      })
      .catch((error) => {
        alert("Analysis Failed");
        console.log(error);
      });
  }

  function insertKeyword(word) {
  const wordList = updatedText.trim().split(/\s+/);
  if (wordList.includes(word)) return;

  setUpdatedText(prev => prev.trim() + ' ' + word);
}

  return (
    <div className="App">
      <div className="navbar">
        <h1>SEO Analyzer Web Page</h1>
      </div>
      {/* LEFT SIDE */}
      <div className='page'>
        <div className="left">
          <h3>Input Text:</h3>
          <textarea
            rows="6"
            value={text}
            onChange={handleChange}
            placeholder="Enter your text here"
          />
          <button onClick={handleSubmit}>Analyze</button>

          {Object.keys(keywords).length > 0 && (
            <div className="results">
              <h3>Keywords:</h3>
              <ul>
                {Object.entries(keywords).map(([kw, count], i) => (
                  <li key={i}>
                    {kw} :{count}
                    <button class="libtn" onClick={() => insertKeyword(kw)}>Insert</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h3>Updated Text:</h3>
          <p className="text-preview">{updatedText}</p>
          <button onClick={() => navigator.clipboard.writeText(updatedText)}>
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
