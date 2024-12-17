import React, {useState, useRef, useEffect, useCallback } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styling
import Button from "./Button";
import {ReactComponent as TraitsIcon} from '../assets/Traits.svg'
import {ReactComponent as MenuIcon} from '../assets/Menu.svg'
import {ReactComponent as SendIcon} from "../assets/Send.svg"
import { throttle } from 'lodash';

function ConvDisplay(
    {
        activeConversation, 
        title,
        setConversations,
        setIsPopupVisible,
        setShowPersonaAttrs,
        isNavBarVisible,
        setIsNavBarVisible
    }){
    // eslint-disable-next-line
    const { salesperson_text, client_text, userStarted, personaAttrs, clientName} = activeConversation;
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const quillRef = useRef(null);
    const scrollableRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollableRef.current) {
        //   scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
            scrollableRef.current.scrollTo({
               top: scrollableRef.current.scrollHeight + 5,
               behavior: 'smooth', 
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    });

    const constructConversation = () => {
        let conversationOutput = [];
        const maxLen = Math.max(salesperson_text.length, client_text.length);
        const displayClientName = clientName || "Client"; // Use clientName if available, otherwise "Client"
        for (let i = 0; i < maxLen; i++) {
        if (userStarted === 0) { // Salesperson starts
            if (i < salesperson_text.length) {
                conversationOutput.push(`You: ${salesperson_text[i]}`);
            }
            if (i < client_text.length) {
                conversationOutput.push(`${displayClientName}: ${client_text[i]}`);
            }
        } 
        else if (userStarted === 1) { // Client starts
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

    const handleMsgSubmit = async(salesperson_message) => {

        console.log("handleMsgSubmit Entered!")
        const conversationHist = constructConversation();

        const modelPrompt = 
        "You are a client interacting with a salesperson. " +
        "Here is the conversation so far:\n" +
        conversationHist + "\n" +
        "Client's traits:\n" +
        "Income Level: " + personaAttrs.income_level + "\n" +
        "Decision Making Style: " + personaAttrs.decision_making_style + "\n" +
        "Risk Tolerance: " + personaAttrs.risk_tolerance + "\n" + 
        "Buying Motivation: " + personaAttrs.buying_motivation + "\n" + 
        "Time Sensitivity: " + personaAttrs.time_sensitivity + "\n" +
        "Receptiveness: " + personaAttrs.receptiveness + "\n\n" +
        "Salesperson: " + salesperson_message + "\n" +
        "Client Response:";

        console.log(modelPrompt)

        try{
            const response = await fetch('http://localhost:8000/predict-response/', { // Replace with your backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({modelPrompt}),
            });

            const data = await response.json();
            salesperson_text.push(salesperson_message);
            console.log(salesperson_message);
            client_text.push(data.client_response);
            console.log(data.client_response);
            setConversations(prev => ({
                ...prev,
                [title]: {
                    salesperson_text: salesperson_text,
                    client_text: client_text,
                    userStarted: userStarted,
                    personaAttrs: personaAttrs,
                    clientName: clientName
                },
            }));

        }catch(error) {
            console.error('Error sending message:', error);
            alert('Failed to submit message. Please try again.');
        }
    }

    const OnShowAttrClick = () => {
        setIsPopupVisible(true);
        setShowPersonaAttrs(true);
    }

    const combinedMessages = [];

    salesperson_text.forEach((message, index) => {
        combinedMessages.push({
            sender: "You",
            text: message,
            order: userStarted === 0 ? (index * 2) : (index * 2 + 1)
        });
    });
    
    client_text.forEach((message, index) => {
        combinedMessages.push({
            sender: clientName,
            text: message,
            order: userStarted === 1 ? (index * 2) : (index * 2 + 1)
        });
    });

    combinedMessages.sort((a, b) => a.order - b.order);

    const handleMsgChange = (value) => {
        setMessage(value);
    };

    const handleKeyDown = useCallback(
        throttle((e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMsg();
            }
        }, 100), // Adjust the throttle interval as needed
        []
    );


    const handleSendMsg =  () => {
        const quillInstance = quillRef.current.getEditor();
        const rawText = quillInstance.getText();
        console.log("Message: " + rawText);
        if(rawText != ''){
            const quillInstance = quillRef.current.getEditor();
            const rawText = quillInstance.getText();
            handleMsgSubmit(rawText.trim());
            setMessage('');
        }
    };

    const handleFocus = () => {
        const quillEditor = quillRef.current?.getEditor();
        if (quillEditor) {
            const editorElement = quillEditor.container.querySelector('.ql-editor');
            editorElement.addEventListener('keydown', handleKeyDown);
        }
        setIsFocused(true);
    };
    
    const handleBlur = () => {
        const quillEditor = quillRef.current?.getEditor();
        if (quillEditor) {
            const editorElement = quillEditor.container.querySelector('.ql-editor');
            editorElement.removeEventListener('keydown', handleKeyDown);
        }
        setIsFocused(false);
    };

    return (
        <div className="flex column f-width f-height" style={{justifyContent: 'flex-start'}}>
            <div className="flex f-width main-padding border-box" style={{justifyContent: 'space-between'}}>
                <div className="flex" style={{gap: "20px"}}>
                    { !isNavBarVisible &&
                        <MenuIcon className="menu-icon"
                            onClick={()=>setIsNavBarVisible(true)}
                        />  
                    }
                    <div className="semibold" style={{fontSize: '24px'}}>{title}</div>
                </div>
                <Button
                    text={`${clientName}'s Traits`}
                    onClick={OnShowAttrClick}
                    icon={<TraitsIcon />}
                />
            </div>
            
            <div className="f-height f-width" style={{
                position: "relative",
            }}>
                <div ref={scrollableRef} className="scrollable-conv-container flex column f-width border-box">
                    <div className="conv-container flex column" style={{
                        justifyContent: 'flex-start'
                        }}>
                        {combinedMessages.map((message, index) => (
                        <div key={index} className="flex column f-width" style={{ 
                            alignSelf: message.sender === "You" ? "flex-end" : "flex-start",
                            maxWidth: "60%" }}>
                            <div className="message-sender semibold" style={{ 
                                alignSelf: message.sender === "You" ? "flex-end" : "flex-start"}}>
                                {message.sender}
                            </div>
                            <div
                                className={`${message.sender === "You" ? 'message-salesperson' : 'message-client'}`}
                                style={{
                                    padding: "10px",
                                    borderRadius: "8px",
                                }}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className={`flex message-send ${isFocused ? 'focused' : ''}`}>
                    <ReactQuill
                        ref={quillRef}
                        value={message}
                        onChange={handleMsgChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Enter Message..."
                        modules={{
                            toolbar: false,
                        }}
                    />
                    <SendIcon className="send-svg"
                        onClick={()=>handleSendMsg()}/>
                </div>
            </div>
        </div>
    )


}

export default ConvDisplay;