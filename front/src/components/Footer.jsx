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

            <div className='footer-container'>
                <div className='footer-left-col'>
                    <div>
                        <h1>TechMatcher</h1>
                        <a href='mailto:na1x.1024@gmail.com'>na1x.1024@gmail.com</a>
                        <a href='#'>Что нового?</a>
                        <a href='#'>О нас</a>
                    </div>
                    <p className='footer-end'>Na1x-dev 2024</p>
                </div>
                <div className='footer-right-col'>
                    <div>
                        <h1>Мы в соц. сетях</h1>
                        <a href='http://www.vk.com'>VKontakte</a>
                        <a href='#'>Instagram</a>
                        <a href='#'>Discord</a>
                        <a href='#'>Youtube</a>
                        <a href='#'>Twitter</a>
                    </div>
                    <p className='footer-end'>TechMatcher</p>
                </div>
            </div>
            <div className='footer-margin'></div>
        </footer>
    );
};


export default Footer;