import { useState, useEffect } from 'react';
import { startPolling, stopPolling, handleInput } from '../../polling';

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
    <>
      <select value={intervalKey} onChange={(e) => setIntervalKey(e.target.value)}>
        <option value="30s">30s</option>
        <option value="1m">1m</option>
        <option value="2m">2m</option>
        <option value="5m">5m</option>
      </select>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />

      <button onClick={handleSubmit}>Submit</button>

      {results.length > 0 && (
        <table border="1" style={{ marginTop: '20px' }}>
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
    </>
  );
}

export default App;