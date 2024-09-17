import '../style/loginHeader.css'
import { useDispatch, useSelector } from 'react-redux';

import { showLoginForm } from '../redux/store';

const LoginHeader = () => {
    const dispatch = useDispatch();
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