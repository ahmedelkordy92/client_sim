import {ReactComponent as MenuIcon} from '../assets/Menu.svg'

function About({isNavBarVisible, setIsNavBarVisible}){
    return (
        <div className="flex column f-width f-height main-display" style={{justifyContent: 'flex-start',  backgroundColor: 'var(--main-body-bkg-color)'}}>
            <div className="flex f-width main-padding border-box" style={{justifyContent: 'space-between', paddingTop: '50px'}}>
                {!isNavBarVisible ? (
                    <MenuIcon className="menu-icon"
                        onClick={()=>setIsNavBarVisible(true)}
                    /> 
                ) : (
                    <div className='menu-placeholder'></div>
                )}
                <div className="semibold" style={{fontSize: '26px'}}>About</div>
                <div className='menu-placeholder'></div>
            </div>
            <div className='flex f-height f-width'>
                <div className='conv-container flex column' style={{gap: '50px', justifyContent: 'center'}}>
                    <div>
                        Welcome to (No Name Yet)! The purpose of this project is to allow a salesperson to continue an existing conversation with a client.
                        To get started, you can upload your existing conversation transcript. Afterwards, it will parsed and the fed into a classification AI
                        model that will use the client's tone throughout the conversation to identify their personality traits. Here are the trait categories and
                        their possible values:
                    </div>

                    <div className='grid-3-2 f-width'>
                        <div className='trait-item'>
                            <div className='semibold'>Income Level</div>
                            <ul>
                                <li>Low Income</li>
                                <li>Middle Income</li>
                                <li>High Income</li>
                            </ul>
                        </div>

                        <div className='trait-item'>
                            <div className='semibold'>Decision Making Style</div>
                            <ul>
                                <li>Intuitive</li>
                                <li>Impulsive</li>
                                <li>Consensus-Seeking</li>
                                <li>Analytical</li>
                                <li>Decisive</li>
                            </ul>
                        </div>

                        <div className='trait-item'>
                            <div className='semibold'>Risk Tolerance</div>
                            <ul>
                                <li>Low</li>
                                <li>Moderate</li>
                                <li>High</li>
                            </ul>
                        </div>

                        <div className='trait-item'>
                            <div className='semibold'>Buying Motivation</div>
                            <ul>
                                <li>Innovation-Driven</li>
                                <li>Value-Driven</li>
                                <li>Price-Driven</li>
                                <li>Brand-Driven</li>
                                <li>Quality-Driven</li>
                            </ul>
                        </div>

                        <div className='trait-item'>
                            <div className='semibold'>Time Sensitivity</div>
                            <ul>
                                <li>Casual Browser</li>
                                <li>Urgent Buyer</li>
                                <li>Flexible</li>
                                <li>Methodical Researcher</li>
                            </ul>
                        </div>

                        <div className='trait-item'>
                            <div className='semibold'>Receptiveness</div>
                            <ul>
                                <li>Open</li>
                                <li>Excited</li>
                                <li>Hostile</li>
                                <li>Reluctant</li>
                                <li>Skeptical</li>
                            </ul>
                        </div>

                    </div>

                    <div>
                        After personality trait's have been identified, you can now continue the conversation from where you left off!
                        Whenever you enter a new message, a Large Language Model specifically fine-tuned for this task will respond to
                        your message, simulating the client's behavior. It takes into account the current conversation history and the client's
                        traits to generate a realistic response.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;