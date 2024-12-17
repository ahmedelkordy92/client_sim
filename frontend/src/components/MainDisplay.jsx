import React from 'react';
import { useParams } from 'react-router-dom';
import ConvDisplay from './ConvDisplay';
import {ReactComponent as UploadIcon} from '../assets/Upload.svg'
import {ReactComponent as MenuIcon} from '../assets/Menu.svg'
import Button from './Button';

function MainDisplay({
    conversations,
    setConversations,
    setIsPopupVisible,
    setShowPersonaAttrs,
    isNavBarVisible,
    setIsNavBarVisible
}) {

    const idObj  = useParams();
    const conversationId = idObj.conversationId

    return (
      <div className='border-box flex f-height f-width main-display' style={{
        paddingTop: '50px',
        position: 'relative'
        // paddingBottom: '50px'
      }}>
        {conversationId && conversations[conversationId] ? (
          <ConvDisplay 
            activeConversation={conversations[conversationId]}
            title={conversationId}
            setConversations = {setConversations}
            setIsPopupVisible={setIsPopupVisible}
            setShowPersonaAttrs={setShowPersonaAttrs}
            isNavBarVisible={isNavBarVisible}
            setIsNavBarVisible={setIsNavBarVisible}
          />
        ) : (
          <div>
            { !isNavBarVisible &&
              <MenuIcon className="menu-icon"
                  onClick={()=>setIsNavBarVisible(true)}
                  style={{
                    position: 'absolute',
                    top: '50px',
                    left: '20px'
                  }}
              />
            }
            <div className='flex column'>
              <p className='medium' style={{
                textAlign: 'center',
                fontSize: '20px'
              }}>
                There are currently no active conversations. Create a new one now by uploading a transcript.
              </p>
              <Button
                text="Upload Transcript"
                onClick={()=>setIsPopupVisible(true)}
                icon={<UploadIcon/>}
              />
            </div>
          </div>
        )}
      </div>
    );

}

export default MainDisplay;