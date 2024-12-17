import React, { useState } from 'react';
import {ReactComponent as NextIcon} from '../assets/Next.svg'

function TranscriptForm(
    {conversations,
    setConversations, 
    setActiveConversationId, 
    startFade,
    setShowPersonaAttrs}) {

    const [file, setFile] = useState(null)
    const [userStarted, setUserStarted] = useState(0)
    const [clientName, setClientName] = useState('Ziad')
    const [separator, setSeparator] = useState(':')
    const [title, setTitle] = useState('SalesTech Solution')
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUserStartedChange = (event) => setUserStarted(event.target.value);
    const handleClientNameChange = (event) => setClientName(event.target.value);
    const handleSeparatorChange = (event) => setSeparator(event.target.value);
    const handleTitleChange = (event) => setTitle(event.target.value);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (conversations && conversations[title]) {
                setErrorMessage('Title already exists. Please choose a different title.');
                return;
            }
    
            // Clear any error messages if validation passed
            setErrorMessage('');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('selection', userStarted);
            formData.append('separator', separator);

            const response = await fetch('http://localhost:8000/predict-persona/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setConversations(prev => ({
                ...prev,
                [title]: {
                    salesperson_text: data.salesperson_text,
                    client_text: data.client_text,
                    userStarted: userStarted,
                    personaAttrs: data.persona_predictions,
                    clientName: clientName || "Client",
                },
            }));
            setActiveConversationId(title);
            setShowPersonaAttrs(true);
            
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('Failed to submit the request. Please try again.');
        }
    };


    return (
        <div className={`popup flex ${startFade ? 'fade-in' : ''}`}>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="file-upload">File Upload</label>
                    <input id="file-upload" type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileChange} required/>
                </div>
                <div className="form-row">
                    <div className="form-group half-width">
                        <label htmlFor="title">Title</label>
                        <input id="title" value={title} onChange={handleTitleChange} type="text" required/>
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="user-started">Conversation Starter</label>
                        <select id="user-started" value={userStarted} onChange={handleUserStartedChange}>
                            <option value={0}>Salesperson</option>
                            <option value={1}>Client</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group half-width">
                        <label htmlFor="client-name">Client Name</label>
                        <input id="client-name" value={clientName} onChange={handleClientNameChange} type="text" required/>
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="separator">Separator</label>
                        <input id="separator" value={separator} onChange={handleSeparatorChange} type="text" required/>
                    </div>
                </div>
                {errorMessage && <p className="flex" style={{color: "var(--err-msg-color)"}}>{errorMessage}</p>}
                <div className="flex">
                    <button type="submit" className='icon-button semibold upload-button'>
                        Submit
                        <NextIcon/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TranscriptForm;