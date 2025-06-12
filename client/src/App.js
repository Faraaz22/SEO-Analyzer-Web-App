import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // States
  // store input text
  const [text, setText] = useState('');
  // store bresponse text
  const [updatedText, setUpdatedText] = useState('');
  // object that maps keyword and frequency 
  const [keywords, setKeywords] = useState({});

  // Handle textarea input
  function handleChange(e) {
    setText(e.target.value);
  }

  // Handle analyze button click
  function handleSubmit() {
    // Sends a POST request to /api/analyze with the input text
    axios.post('http://localhost:3001/api/analyze', { text })
      .then((response) => {
        // store response data
        const data = response.data;
        // sets updatedText and keywords from response.
        setUpdatedText(data.updatedText);
        //  sets the keywords object
        setKeywords(data.keywords || {});
      })
      .catch((error) => {
        // EDGE CASE: If analysis fails/not reachable/no internet
        alert("Analysis Failed");
        console.log(error);
      });
  }

  function insertKeyword(word) {
    // trims the updatedText and splits it into words
    const wordList = updatedText.trim().split(/\s+/);
    // prevents inserting duplicates
    if (wordList.includes(word)) return;
    // sets the updated text by adding the keywors to the end of sentence
    // NOTE: I used this logic because the document provided says we cannot change the coherence of the original text
    setUpdatedText(prev => prev.trim() + ' ' + word);
  }

  return (
    <div className="App">
      <div className="navbar">
        <h1>SEO Analyzer Web Page</h1>
      </div>
      <div className='page'>
        {/* LEFT SIDE */}
        <div className="left">
          <h3>Input Text:</h3>
          {/* text aread where the input text will be entered */}
          <textarea
            rows="6"
            value={text}
            onChange={handleChange}
            placeholder="Enter your text here"
          />
          {/* submit button */}
          <button onClick={handleSubmit}>Analyze</button>
          {/* renders the keywords if they exist */}
          {Object.keys(keywords).length > 0 && (
            <div className="results">
              <h3>Keywords:</h3>
              <ul>
                {/* keywords : count are shown here */}
                {/* keywords are mapped and the variable i here is used to give them each a unique key */}
                {Object.entries(keywords).map(([kw, count], i) => (
                  <li key={i}>
                    {kw} :{count}
                    {/* insert button for each keyword */}
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
          {/* textarea where the updated text will be shown */}
          <p className="text-preview">{updatedText}</p>
          {/* copy button */}
          <button onClick={() => navigator.clipboard.writeText(updatedText)}>
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
