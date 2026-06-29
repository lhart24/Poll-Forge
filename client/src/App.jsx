import { useState } from 'react';

function App() {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [interval, setInterval] = useState('30s');

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5001/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: value }),
    });

    const data = await res.json();

    setResults(prev => [
      ...prev,
      {
        input: value,
        message: data.message
      }
    ]);

    setValue('');
  };

  return (
    <>
      <select value={interval} onChange={(e) => setInterval(e.target.value)}>
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