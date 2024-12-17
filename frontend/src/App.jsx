import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import MainDisplay from './components/MainDisplay';
import About from './components/About';
import Documentation from './components/Documentation';
import './styles.css'

function App() {
  const [conversations, setConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showPersonaAttrs, setShowPersonaAttrs] = useState(false);
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);
  
  return (
    <Router>
      <div className='flex f-height' style={{justifyContent: 'flex-start'}}>
        <NavBar 
          conversations={conversations} 
          setConversations={setConversations}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          showPersonaAttrs={showPersonaAttrs}
          setShowPersonaAttrs={setShowPersonaAttrs}
          isNavBarVisible={isNavBarVisible}
          setIsNavBarVisible={setIsNavBarVisible}
        />
        <Routes>
          <Route path="/" element={
            <MainDisplay
              conversations={conversations}
              setConversations={setConversations}
              setIsPopupVisible={setIsPopupVisible}
              setShowPersonaAttrs={setShowPersonaAttrs}
              isNavBarVisible={isNavBarVisible}
              setIsNavBarVisible={setIsNavBarVisible}
            />
          } />
          <Route 
            path="/:conversationId" 
            element={
              <MainDisplay 
                conversations={conversations}
                activeConversationId={activeConversationId}
                setConversations={setConversations}
                setIsPopupVisible={setIsPopupVisible}
                setShowPersonaAttrs={setShowPersonaAttrs}
                isNavBarVisible={isNavBarVisible}
                setIsNavBarVisible={setIsNavBarVisible}
              />
            }
          />
          <Route path="/about" element={
            <About 
              isNavBarVisible={isNavBarVisible}
              setIsNavBarVisible={setIsNavBarVisible}
            />} 
          />
          <Route path="/documentation" element={<Documentation 
            isNavBarVisible={isNavBarVisible}
            setIsNavBarVisible={setIsNavBarVisible}
            />} 
          />
        </Routes>
      </div>
    </Router>
  );
  

}

export default App;