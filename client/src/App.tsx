import { useState, useEffect } from 'react';
import {
  fetchTestMessages,
  processMessage,
  TestMessage,
  MessageResponse,
} from './api';

/**
 * Maintenance AI Agent - Debug Console
 * 
 * This is a debug/evaluation UI for testing the AI agent's behavior.
 * It allows selecting test messages, sending them to the agent,
 * and inspecting the results.
 * 
 * This is intentionally basic - it's a tool for evaluation,
 * not a production interface.
 */
function App() {
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MessageResponse | null>(null);
  const [useCustomMessage, setUseCustomMessage] = useState<boolean>(false);

  // Load test messages on mount
  useEffect(() => {
    fetchTestMessages()
      .then((messages) => {
        setTestMessages(messages);
        if (messages.length > 0) {
          setSelectedMessageId(messages[0].id);
        }
      })
      .catch((err) => {
        setError(`Failed to load test messages: ${err.message}`);
      });
  }, []);

  const selectedMessage = testMessages.find((m) => m.id === selectedMessageId);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const messageText = useCustomMessage
        ? customMessage
        : selectedMessage?.body || '';
      
      const messageId = useCustomMessage
        ? 'custom-' + Date.now()
        : selectedMessageId;

      if (!messageText.trim()) {
        throw new Error('Please enter or select a message.');
      }

      const response = await processMessage(messageId, messageText);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Maintenance AI Agent</h1>
        <p className="subtitle">Debug Console • Evaluation Interface</p>
      </header>

      <main className="main">
        {/* Input Section */}
        <section className="panel input-panel">
          <h2>Incoming Message</h2>
          
          <div className="toggle-row">
            <label className="toggle">
              <input
                type="checkbox"
                checked={useCustomMessage}
                onChange={(e) => setUseCustomMessage(e.target.checked)}
              />
              <span>Use custom message</span>
            </label>
          </div>

          {useCustomMessage ? (
            <div className="input-group">
              <label htmlFor="custom-message">Custom Message:</label>
              <textarea
                id="custom-message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your own test message here..."
                rows={6}
              />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label htmlFor="message-select">Select Test Message:</label>
                <select
                  id="message-select"
                  value={selectedMessageId}
                  onChange={(e) => setSelectedMessageId(e.target.value)}
                >
                  {testMessages.map((msg) => (
                    <option key={msg.id} value={msg.id}>
                      {msg.id}: {msg.subject}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMessage && (
                <div className="message-preview">
                  <div className="message-subject">
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </div>
                  <div className="message-body">
                    <strong>Body:</strong>
                    <p>{selectedMessage.body}</p>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Process Message'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </section>

        {/* Results Section */}
        {result && (
          <section className="panel results-panel">
            <h2>Agent Response</h2>
            <div className="result-placeholder">
              <p>Your AI agent results display goes here.</p>
              <p className="hint">
                Implement how you want to visualize the agent's analysis, 
                resolution, and escalation decisions.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Maintenance AI Agent • Take-Home Assessment Scaffold
          <br />
          <small>This is a debug interface for evaluating agent behavior</small>
        </p>
      </footer>
    </div>
  );
}

export default App;

