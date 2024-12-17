import React from "react";
import Button from "./Button";

function PersonaAttrs({personaAttrs, setShowPersonaAttrs, setIsPopupVisible}){
    console.log(personaAttrs);

    const handleContinue = () => {
        setShowPersonaAttrs(false);
        setIsPopupVisible(false);
    }

    return(
        <div className="flex column">
            <div className="attrs-container">
                <div className="flex column persona-container">
                    <div className="bold">Income Level</div> 
                    <div className="light">{personaAttrs.income_level}</div>
                </div>
                <div className="flex column persona-container">
                    <div className="bold">Decision Making Style</div> 
                    <div className="light">{personaAttrs.decision_making_style}</div>
                </div>
                <div className="flex column persona-container">
                    <div className="bold">Buying Motivation</div> 
                    <div className="light">{personaAttrs.buying_motivation}</div>
                </div>
                <div className="flex column persona-container">
                    <div className="bold">Receptiveness</div> 
                    <div className="light">{personaAttrs.receptiveness}</div>
                </div>
                <div className="flex column persona-container">
                    <div className="bold">Risk Tolerance</div> 
                    <div className="light">{personaAttrs.risk_tolerance}</div>
                </div>
                <div className="flex column persona-container">
                    <div className="bold">Time Sensitivity</div> 
                    <div className="light">{personaAttrs.time_sensitivity}</div>
                </div>
            </div>
            <div className="flex">
                <Button text="Continue" onClick={handleContinue} className="upload-button" />
            </div>
        </div>
    )
}

export default PersonaAttrs;