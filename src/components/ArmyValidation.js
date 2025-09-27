import React from 'react';
import './ArmyValidation.css';

// This component receives a list of validation messages and displays them.
function ArmyValidation({ messages }) {
  if (messages.length === 0) {
    return null; // Don't render anything if there are no messages
  }

  return (
    <div className="validation-container">
      <ul>
        {messages.map((msg, index) => (
          <li key={index} className={`validation-message ${msg.type}`}>
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArmyValidation;