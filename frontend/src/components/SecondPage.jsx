// src/components/SecondPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SecondPage.css';

function SecondPage() {
  const [states, setStates] = useState([]);
  const [electoralCount, setElectoralCount] = useState({ Harris: 0, Trump: 0 });
  const [error, setError] = useState(null);

  // Define the list of swing states
  const SWING_STATES = [
    'Arizona',
    'Florida',
    'Michigan',
    'North Carolina',
    'Pennsylvania',
    'Wisconsin',
    // Add more swing states as needed
  ];

  useEffect(() => {
    fetchStates();
    fetchElectoralCount();
  }, []);

  // Fetch all states from the backend
  const fetchStates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/states/`);
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setError("Failed to fetch states. Please try again later.");
    }
  };

  // Fetch electoral counts from the backend
  const fetchElectoralCount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/electoral-count/`);
      setElectoralCount(response.data);
    } catch (error) {
      console.error("Error fetching electoral count:", error);
      setError("Failed to fetch electoral counts. Please try again later.");
    }
  };

  // Update the expected_vote for a state
  const updateExpectedVote = async (stateId, newVote) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/states/${stateId}/`, { expected_vote: newVote });
      fetchStates();
      fetchElectoralCount();
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error updating state vote:", error);
      setError("Failed to update state vote. Please try again.");
    }
  };

  return (
    <div className="second-page">
      {/* Display error messages if any */}
      {error && <div className="error-message">{error}</div>}

      {/* Swing States Section */}
      <h2>Swing States</h2>
      <div className="swing-states">
        {states.filter(state => SWING_STATES.includes(state.name)).map(state => (
          <div key={state.id} className="state">
            <span>{state.name}</span>
            <div className="toggle-switch">
              <button
                className={state.expected_vote === 'Harris' ? 'active left' : ''}
                onClick={() => updateExpectedVote(state.id, 'Harris')}
              >
                Blue
              </button>
              <button
                className={state.expected_vote === 'Neutral' ? 'active neutral' : ''}
                onClick={() => updateExpectedVote(state.id, 'Neutral')}
              >
                Purple
              </button>
              <button
                className={state.expected_vote === 'Trump' ? 'active right' : ''}
                onClick={() => updateExpectedVote(state.id, 'Trump')}
              >
                Red
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Other States Section */}
      <h2>Other States</h2>
      <div className="other-states">
        {states.filter(state => !SWING_STATES.includes(state.name)).map(state => (
          <div key={state.id} className="state">
            <span>{state.name}</span>
            <select
              value={state.expected_vote}
              onChange={(e) => updateExpectedVote(state.id, e.target.value)}
            >
              <option value="Harris">Harris (Blue)</option>
              <option value="Neutral">Neutral (Purple)</option>
              <option value="Trump">Trump (Red)</option>
            </select>
          </div>
        ))}
      </div>

      {/* Electoral Votes Counter Section */}
      <h2>Electoral Votes Counter</h2>
      <div className="electoral-count">
        <div className={`candidate harris ${electoralCount.Harris > 270 ? 'winner' : ''}`}>
          Harris: {electoralCount.Harris}
        </div>
        <div className={`candidate trump ${electoralCount.Trump > 270 ? 'winner' : ''}`}>
          Trump: {electoralCount.Trump}
        </div>
      </div>
    </div>
  );
}

export default SecondPage;
