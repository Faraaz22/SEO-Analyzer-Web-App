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

  // Insert keyword into updated text
  function insertKeyword(word) {
    if (updatedText.includes(word)) return;
    const words = updatedText.trim().split(' ');
    words.splice(2, 0, word);
    setUpdatedText(words.join(' '));
  }


  return (
    <div className="App">
      {/* LEFT SIDE */}
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
                  {kw} ({count})
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
  );
}

export default App;
