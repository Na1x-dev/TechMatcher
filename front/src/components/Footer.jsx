import { useState } from 'react';
import '../style/footer.css'

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleFooter = () => {
        setIsVisible(!isVisible);
    };

    return (
        <footer className={`footer ${isVisible ? 'footer-visible' : ''}`} >
            <div onClick={toggleFooter} className='footer-button'>
                <p>Footer</p>
            </div>
            <div 
            onClick={toggleFooter}
             className={`footer-curtains ${isVisible ? 'curtains-visible' : ''}`} ></div>
        </footer>
    );
};


export default Footer;