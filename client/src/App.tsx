import { useState, useEffect } from 'react';
import {
  startPolling,
  stopPolling,
  type PollResult,
} from '../../polling';

import './style.css';

import MainGraph from './ResponseChart';

function App() {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<
    { input: string; result: PollResult }[]
  >([]);
  const [intervalKey, setIntervalKey] = useState('30s');
  const [submittedValue, setSubmittedValue] = useState('');

  useEffect(() => {
    if (!submittedValue) return;

    startPolling(submittedValue, intervalKey, (result) => {
      setResults(prev => [
        ...prev,
        {
          input: submittedValue,
          result,
        },
      ]);
    });

    return () => stopPolling();
  }, [intervalKey, submittedValue]);

  const handleSubmit = () => {
    if (!value.trim()) return;

    setSubmittedValue(value);
    setValue('');
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Poll Forge</h1>
        <h2>API Poller</h2>
        <p>Poll any endpoint and inspect responses.</p>
      </div>

      <div className="controls">
        <select
          value={intervalKey}
          onChange={(e) => setIntervalKey(e.target.value)}
        >
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

        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>

        <button className="btn" onClick={stopPolling}>
          Stop
        </button>

        <button
          className="btn btn-danger"
          onClick={() => {
            stopPolling();
            setResults([]);
            setSubmittedValue('');
          }}
        >
          Clear
        </button>
      </div>

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Input</th>
              <th>Status</th>
              <th>Success</th>
              <th>Speed</th>
              <th>Response</th>
            </tr>
          </thead>

          <tbody>
  {results.map((item, index) => (
    <tr key={index}>
      <td>{item.input}</td>

      <td>
        {item.result.status} {item.result.statusText}
      </td>

      <td>{item.result.success ? '✅' : '❌'}</td>

      <td
        style={{
          color:
            item.result.responseTime < 200
              ? 'green'
              : item.result.responseTime < 1000
              ? 'orange'
              : 'red',
          fontWeight: 'bold',
        }}
      >
        {item.result.responseTime} ms
      </td>

      <td>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(item.result.body, null, 2)}
        </pre>
      </td>
    </tr>
  ))}
  <div className="app">
  {/* Header */}

  {/* Controls */}

  <MainGraph data={results} />

  {results.length > 0 && (
    <table>
      ...
    </table>
  )}
</div>
</tbody>
        </table>
      )}
    </div>
    
  );
}

export default App;