import { useState, useEffect } from 'react';
import {
  startPolling,
  stopPolling,
  type MonitoredEndpoint,
  type PollResult,
} from '../services/polling';

import './style.css';
import MainGraph from './ResponseChart';

interface EndpointCardProps {
  endpoint: MonitoredEndpoint;
  onStop: (id: string) => void;
  onResume: (id: string) => void;
  onRemove: (id: string) => void;
}

function EndpointCard({ endpoint, onStop, onResume, onRemove }: EndpointCardProps) {
  const { id, url, intervalKey, results, isActive } = endpoint;
  const [showResponses, setShowResponses] = useState(false);

  const latest = results[results.length - 1];
  const successCount = results.filter(r => r.success).length;
  const uptime = results.length > 0
    ? Math.round((successCount / results.length) * 100)
    : null;

  const avgResponseTime = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
    : null;

  return (
    <div className="endpoint-card">
      <div className="endpoint-card-header">
        <div className="endpoint-status">
          <span
            className={`status-dot ${latest ? (latest.success ? 'status-up' : 'status-down') : 'status-pending'}`}
          />
          <span className="endpoint-url" title={url}>{url}</span>
        </div>
        <div className="endpoint-actions">
          {isActive ? (
            <button className="btn btn-sm" onClick={() => onStop(id)}>Pause</button>
          ) : (
            <button className="btn btn-sm" onClick={() => onResume(id)}>Resume</button>
          )}
          <button className="btn btn-sm btn-danger" onClick={() => onRemove(id)}>Remove</button>
        </div>
      </div>

      <div className="endpoint-stats">
        <div className="stat">
          <span className="stat-label">Uptime</span>
          <span className="stat-value">{uptime !== null ? `${uptime}%` : '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg speed</span>
          <span className="stat-value">{avgResponseTime !== null ? `${avgResponseTime} ms` : '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Interval</span>
          <span className="stat-value">{intervalKey}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Checks</span>
          <span className="stat-value">{results.length}</span>
        </div>
      </div>

      <div className="endpoint-graph">
        {results.length === 0 ? (
          <div className="empty-state-mini">Waiting for first check…</div>
        ) : (
          <MainGraph data={results.map(r => ({ input: url, result: r }))} />
        )}
      </div>

      {results.length > 0 && (
        <div className="responses-section">
          <button
            className="responses-toggle"
            onClick={() => setShowResponses(prev => !prev)}
            aria-expanded={showResponses}
          >
            {showResponses ? '▲' : '▼'} View responses ({results.length})
          </button>

          {showResponses && (
            <div className="responses-table-wrap">
              <table className="responses-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Speed</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice().reverse().map((r, i) => (
                    <tr key={results.length - i}>
                      <td>{results.length - i}</td>
                      <td>
                        <span className={r.success ? 'pill pill-up' : 'pill pill-down'}>
                          {r.status} {r.statusText}
                        </span>
                      </td>
                      <td>{r.responseTime} ms</td>
                      <td>
                        <pre className="response-body">
                          {JSON.stringify(r.body, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



function App() {
  const [value, setValue] = useState('');
  const [intervalKey, setIntervalKey] = useState('30s');
  const [endpoints, setEndpoints] = useState<MonitoredEndpoint[]>(() => {
    try{
      const stored = localStorage.getItem('endpoints');
      return stored ? JSON.parse(stored) : [];
    } catch{
      return [];
    }
  });
  useEffect(() => {
    endpoints.forEach(ep => {
      if (ep.isActive) {
        startPolling(ep.id, ep.url, ep.intervalKey, (result: PollResult) => {
          setEndpoints(prev =>
            prev.map(e => (e.id === ep.id ? { ...e, results: [...e.results, result].slice(-100) } : e))
          );
        });
      }
    });
    
  }, []);
  useEffect(() => {
    localStorage.setItem('endpoints', JSON.stringify(endpoints));
  }, [endpoints]);

  const handleSubmit = () => {
    if (!value.trim()) return;

    const newEndpoint: MonitoredEndpoint = {
      id: crypto.randomUUID(),
      url: value,
      intervalKey,
      results: [],
      isActive: true,
    };

    setEndpoints(prev => [...prev, newEndpoint]);

    startPolling(newEndpoint.id, newEndpoint.url, newEndpoint.intervalKey, (result: PollResult) => {
      setEndpoints(prev =>
        prev.map(ep =>
          ep.id === newEndpoint.id
            ? { ...ep, results: [...ep.results, result].slice(-100) }
            : ep
        )
      );
    });

    setValue('');
  };

  const handleStop = (id: string) => {
    stopPolling(id);
    setEndpoints(prev =>
      prev.map(ep => (ep.id === id ? { ...ep, isActive: false } : ep))
    );
  };

  const handleResume = (id: string) => {
    const ep = endpoints.find(e => e.id === id);
    if (!ep) return;

    setEndpoints(prev =>
      prev.map(e => (e.id === id ? { ...e, isActive: true } : e))
    );

    startPolling(id, ep.url, ep.intervalKey, (result: PollResult) => {
      setEndpoints(prev =>
        prev.map(e =>
          e.id === id ? { ...e, results: [...e.results, result].slice(-100) } : e
        )
      );
    });
  };

  const handleRemove = (id: string) => {
    stopPolling(id);
    setEndpoints(prev => prev.filter(ep => ep.id !== id));
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Poll Forge</h1>
        <h2>API Poller</h2>
        <p>Poll any endpoint and inspect responses.</p>
      </div>

      <div className="controls">

        <label htmlFor="interval-select" className="sr-only">Poll interval</label>
        <select
          id="interval-select"
          value={intervalKey}
          onChange={(e) => setIntervalKey(e.target.value)}
        >
          <option value="30s">30s</option>
          <option value="1m">1m</option>
          <option value="2m">2m</option>
          <option value="5m">5m</option>
        </select>

        <label htmlFor="url-input" className="sr-only">Endpoint URL</label>
        <input
          id="url-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="https://randomuser.me/api/"
        />

        <button className="btn btn-primary" onClick={handleSubmit} disabled={!value.trim()}>
          Add endpoint
        </button>
      </div>

      {endpoints.length === 0 ? (
        <div className="empty-state">
          <p>No endpoints yet</p>
          <span>Add a URL above to start monitoring it</span>
        </div>
      ) : (
        <div className="endpoint-grid">
          {endpoints.map(ep => (
            <EndpointCard
              key={ep.id}
              endpoint={ep}
              onStop={handleStop}
              onResume={handleResume}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;