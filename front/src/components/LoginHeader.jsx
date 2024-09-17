import '../style/loginHeader.css'
import { useSelector } from 'react-redux';

const LoginHeader = () => {
    const isVisible = useSelector((state) => state.loginForm.isVisible);

    return (
        <header className={`login-header ${isVisible ? 'login-header-active' : ''}`}>
            <div className='header-logo'>
                <div className='left-logo'>Tech</div>
                <div className='right-logo'>Matcher</div>
            </div>
        </header>
    );
};


export default LoginHeader;