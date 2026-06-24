import { useState } from React

function App(){
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5001/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: value }),
    });
    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={handleSubmit}>Submit</button>
      {response && <p>{response}</p>}
    </>
  );
}
export default App
 
