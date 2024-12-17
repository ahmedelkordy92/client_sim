import React, { useState } from 'react';
// import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [selection, setSelection] = useState(0);
  const [clientName, setClientName] = useState('');
  const [personaAttrs, setPersonaAttrs] = useState({});
  const [userInput, setUserInput] = useState('');
  const [conversations, setConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  const handleClientNameChange = (event) => {
    setClientName(event.target.value);
  };

  const constructConversation = (salesperson_text, client_text) => {
    let conversationOutput = [];
      const maxLen = Math.max(salesperson_text.length, client_text.length);
      const displayClientName = clientName || "Client"; // Use clientName if available, otherwise "Client"
      for (let i = 0; i < maxLen; i++) {
        if (selection === 0) { // Salesperson starts
          if (i < salesperson_text.length) {
              conversationOutput.push(`You: ${salesperson_text[i]}`);
          }
          if (i < client_text.length) {
              conversationOutput.push(`${displayClientName}: ${client_text[i]}`);
          }
        } 
        else if (selection === 1) { // Client starts
          if (i < client_text.length) {
              conversationOutput.push(`${displayClientName}: ${client_text[i]}`);
          }
          if (i < salesperson_text.length) {
              conversationOutput.push(`You: ${salesperson_text[i]}`);
          }
        }
      }

      const conversationString = conversationOutput.join('\n\n');

      return conversationString;
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('selection', selection);

      const response = await fetch('http://localhost:8000/predict-persona/', {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const conversationString = constructConversation(data.salesperson_text, data.client_text);
      
      const conversationId = `conversation-${Date.now()}`;
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          conversation: conversationString,
          personaAttrs: data.persona_predictions,
          clientName: clientName || "Client", // Store the client name
        },
      }));
      setActiveConversationId(conversationId)
      setPersonaAttrs(data.persona_predictions);

    } catch (error) {
        console.error('Error during fetch:', error);
        alert('Failed to submit the request. Please try again.');
    }

  };

  const handleChatSubmit  = async(message) => {
    if (!activeConversationId) return;

    const modelPrompt = 
    "You are a client interacting with a salesperson. " +
    "Here is the conversation so far:\n" +
    conversations[activeConversationId].conversation + "\n" +
    "Client's traits:\n" +
    "Income Level: " + personaAttrs.income_level + "\n" +
    "Decision Making Style: " + personaAttrs.decision_making_style + "\n" +
    "Risk Tolerance: " + personaAttrs.risk_tolerance + "\n" + 
    "Buying Motivation: " + personaAttrs.buying_motivation + "\n" + 
    "Time Sensitivity: " + personaAttrs.time_sensitivity + "\n" +
    "Receptiveness: " + personaAttrs.receptiveness + "\n\n" +
    "Salesperson: " + message + "\n" +
    "Client Response:"

    try{
      const response = await fetch('http://localhost:8000/predict-response/', { // Replace with your backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelPrompt, message }),
      });

      const data = await response.json();
      console.log(data.salesperson_text)
      console.log(data.client_text)

      const conversationString = constructConversation(data.salesperson_text, data.client_text);
      const updatedConversation = { 
        ...conversations[activeConversationId], 
        conversation: conversationString 
      };

      setConversations(prev => ({ ...prev, [activeConversationId]: updatedConversation }));
    }catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to submit message. Please try again.');
        }
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && userInput.trim()) {
        handleChatSubmit(userInput); // Call the parent function to handle submission
        setUserInput(''); // Clear the textbox
    }
  };

  const handleConversationSelect = (id) => {
    setActiveConversationId(id);
  };

  return (
    <div>
      <h1>Upload Text File for Prediction</h1>
      <input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileChange} />
      <select value={selection} onChange={handleSelectionChange}>
        <option value={0}>Salesperson</option>
        <option value={1}>Client</option>
      </select>
      <input
        type="text"
        placeholder="Client Name (optional)"
        value={clientName}
        onChange={handleClientNameChange}
      />
      <button onClick={handleSubmit}>Submit</button>

      <h2>Conversations</h2>
      <ul>
        {Object.keys(conversations).map(id => (
          <li key={id} onClick={() => handleConversationSelect(id)}>
            {conversations[id].clientName}: Conversation {id}
          </li>
        ))}
      </ul>

      {activeConversationId && conversations[activeConversationId] && (
        <div>
          <div style={{ whiteSpace: 'pre-line' }}>
            {conversations[activeConversationId].conversation}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
          />
        </div>
      )}
    </div>
  );
  

}

export default App;