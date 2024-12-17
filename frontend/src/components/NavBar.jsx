import { Link, useNavigate } from 'react-router-dom';
import Button from "./Button";
import TranscriptForm from "./TranscriptForm";
import PersonaAttrs from "./PersonaAttrs";
import React, { useState, useEffect, useCallback  } from 'react';
import {ReactComponent as UploadIcon} from '../assets/Upload.svg'
import {ReactComponent as MenuIcon} from '../assets/Menu.svg'
import {ReactComponent as LightIcon} from '../assets/Light.svg'
import {ReactComponent as DarkIcon} from '../assets/Dark.svg'
import ThemeSwitcher from "./ThemeSwitcher";


function NavBar(
  {
    conversations, 
    setConversations, 
    activeConversationId, 
    setActiveConversationId,
    isPopupVisible,
    setIsPopupVisible,
    showPersonaAttrs,
    setShowPersonaAttrs,
    isNavBarVisible,
    setIsNavBarVisible
  }) {
    const [startFade, setStartFade] = useState(false);
    const [showRemoveConv, setShowRemoveConv] = useState(false);
    const [convToRemove, setConvToRemove] = useState('');

    const navigate = useNavigate();

    const handleUpload = () => {
      setIsPopupVisible(true);
    };

    const removeConversation = (id) => {
      setConversations((prev) => {
        const { [id]: _, ...rest } = prev;

        if (activeConversationId === id) {
          const remainingConversations = Object.keys(rest);
          setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0] : '');
        }

        exitPopup();

        return rest;
      });
    }

    const exitPopup = useCallback(() => {
      setIsPopupVisible(false);
      setShowPersonaAttrs(false);
      setShowRemoveConv(false);
    }, [setIsPopupVisible, setShowPersonaAttrs, setShowRemoveConv]);

    useEffect(() => {
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          exitPopup();
        }
      };
  
      // Add the event listener
      window.addEventListener('keydown', handleEscapeKey);
  
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('keydown', handleEscapeKey);
      };
    }, [exitPopup]);

    useEffect(() => {
        setStartFade(isPopupVisible);
    }, [isPopupVisible]);

    const handleConversationClick = (id) => {
      console.log('Conversation ID: ' + id);
      setActiveConversationId(id);
      navigate(`/${id}`)
    };
  

    return (
      <>
        <div className={`nav-bar ${isNavBarVisible ? '' : 'nav-invisible'}`}>
          <div className="flex column f-height f-width border-box" style=
          {{ 
            backgroundColor: 'var(--primary-gr)', 
            padding: '20px',
            paddingTop: '50px',
            paddingBottom: '50px',
            justifyContent: 'space-between',
          }}>
            <div className="f-width flex column" style={{gap:'30px'}}>
              <div className="f-width flex" style={{justifyContent: 'space-between'}}>
                <MenuIcon className="menu-icon"
                  onClick={()=>setIsNavBarVisible(false)}
                />
                <Button
                  text="Upload Transcript"
                  onClick={handleUpload}
                  icon={<UploadIcon/>}
                />
              </div>
              <div className="f-width flex column">
                <div className="nav-text bold">Conversations</div>
                <div className="f-width">
                  {Object.keys(conversations).map(id => {
                      return (
                        <div className={`flex nav-link f-width border-box ${id === activeConversationId ? 'nav-active' : ''}`}
                          onClick={() => handleConversationClick(id)}>
                          <svg className="nav-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                          </svg>
                          <div className="regular">{id}</div>
                          <svg 
                            className={`close-conv-icon`}  
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 -960 960 960"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConvToRemove(id);
                              setIsPopupVisible(true);
                              setShowRemoveConv(true);
                            }}>
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                          </svg>
                        </div>
                  )})}
                </div>
              </div>
            </div>
            <div className="f-width">
              <Link to="/about" className="flex nav-link f-width border-box">
                <svg className="nav-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                  <path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/>
                </svg>
                <div className="page-text">About</div>
                <div class="spacer-box"></div> 
              </Link>
              <Link to="/documentation" className="flex nav-link f-width border-box">
                <svg className="nav-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" >
                  <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
                </svg>
                <div className="page-text">Documentation</div>
                <div class="spacer-box"></div> 
              </Link>
              <div className="flex f-width border-box" style={{
                  justifyContent: 'space-between',
                  padding: '17px'
                }}>
                <LightIcon className="nav-svg" />
                <ThemeSwitcher />
                <DarkIcon className="nav-svg" />
              </div>
            </div>
          </div>
        </div>

        {isPopupVisible && (
          <>
            <div className={`overlay ${startFade ? 'fade-in' : ''}`} />
            {showPersonaAttrs ? (
              <div className="popup flex fade-in">
                <PersonaAttrs
                  personaAttrs={conversations[activeConversationId].personaAttrs}
                  setShowPersonaAttrs={setShowPersonaAttrs}
                  setIsPopupVisible={setIsPopupVisible}
                />
              </div>
            ) : showRemoveConv ? (
              <div className="popup flex fade-in">
                <div className="flex column" style={{gap: '25px'}}>
                  <div style={{color: 'var(--remove-text-color)'}}>
                    Are you sure you want to remove this conversation? This action cannot be undone.
                  </div>
                  <div className="flex" style={{gap: '15px'}}>
                    <button 
                      onClick={() => removeConversation(convToRemove)}
                      id="remove-btn">
                      <span className="text">Remove</span>
                    </button>
                    <Button 
                      text="Cancel"
                      onClick={() => exitPopup()}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <TranscriptForm
                conversations={conversations}
                setConversations={setConversations}
                setActiveConversationId={setActiveConversationId}
                startFade={startFade}
                setShowPersonaAttrs={setShowPersonaAttrs}
              />
            )}
          </>
        )}
      </>
    );


    //Button
    // Conversationss Text
    // convo component
    //Pages
        // How To Use/Help
        // Documentation
        // Settings
    // Alpha V0.1
}

export default NavBar;