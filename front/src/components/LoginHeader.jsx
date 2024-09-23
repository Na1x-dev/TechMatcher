import '../style/loginHeader.css'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { showLoginForm, hideLoginForm } from '../redux/store';

const LoginHeader = () => {
    let isVisible = useSelector((state) => state.loginForm.isVisible);
    const navigate = useNavigate();

    const toHome = () => {
        navigate("/");
    }

    return (
        <header className={`login-header ${isVisible ? 'login-header-active' : ''}`}>
            <div className='header-logo' onClick={toHome}>
                <div className='left-logo'>Tech</div>
                <div className='right-logo'>Matcher</div>
            </div>
        </header>
    );
};


export default LoginHeader;