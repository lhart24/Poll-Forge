import { useState, useEffect } from 'react';
import { startPolling, stopPolling, handleInput } from '../../polling';
import './style.css';

function App() {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [intervalKey, setIntervalKey] = useState('30s');
  const [submittedValue, setSubmittedValue] = useState('');

  useEffect(() => {
    if (!submittedValue) return;

    startPolling(submittedValue, intervalKey, (message) => {
      setResults(prev => [...prev, { input: submittedValue, message }]);
    });

    return () => stopPolling();
  }, [intervalKey, submittedValue]);

  const handleSubmit = async () => {
    setSubmittedValue(value);
    setValue('');
  };

  return (
    <div className="app">
      <div className="header">
        <h1>API poller</h1>
        <p>Poll any JSON endpoint and inspect responses.</p>
      </div>

      <div className="controls">
        <select value={intervalKey} onChange={(e) => setIntervalKey(e.target.value)}>
          <option value="30s">30s</option>
          <option value="1m">1m</option>
          <option value="2m">2m</option>
          <option value="5m">5m</option>
        </select>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="https://randomuser.me/api/"
        />

        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        <button className="btn" onClick={stopPolling}>Stop</button>
        <button className="btn btn-danger" onClick={() => {
          stopPolling();
          setResults([]);
          setSubmittedValue('');
        }}>Clear</button>
      </div>

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Input</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.input}</td>
                <td>{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;