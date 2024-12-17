import {ReactComponent as MenuIcon} from '../assets/Menu.svg'

function Documentation({isNavBarVisible, setIsNavBarVisible}){
    return (
        <div className="flex column f-width f-height main-display" style={{justifyContent: 'flex-start', backgroundColor: 'var(--main-body-bkg-color)'}}>
            <div className="flex f-width main-padding border-box" style={{justifyContent: 'space-between', paddingTop: '50px'}}>
                {!isNavBarVisible ? (
                    <MenuIcon className="menu-icon"
                        onClick={()=>setIsNavBarVisible(true)}
                    /> 
                ) : (
                    <div className='menu-placeholder'></div>
                )}
                <div className="semibold" style={{fontSize: '26px'}}>Documentation</div>
                <div className='menu-placeholder'></div>
            </div>
        </div>
    );
}

export default Documentation;