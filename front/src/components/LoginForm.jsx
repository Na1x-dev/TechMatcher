import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import '../style/general.css'
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { postReq, getReq } from '../Api';


const LoginForm = () => {
    const { login } = useAuth()
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const toRegistrationForm = () => {
        navigate("/register");
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkIsEmptyFields()) {
            const credentialsData = {
                email: credentials.email,
                password: credentials.password,
            };

            try {
                const response = await postReq('/token/', credentialsData);
                login(response.access, response.refresh);
                navigate('/');
            } catch (error) {
                console.error('Ошибка входа:', error);
                alert("Не верные логин и(или) пароль");
            }
        }
    };

    const checkIsEmptyFields = () => {
        let flag = false;
        const fields = document.getElementsByClassName('form-input');
        for (let field of fields) {
            if (field.value == '') {
                field.classList.add('error-field');
                flag = true;
            }
            else field.classList.remove('error-field');
        }
        if (flag)
            alert("Не все поля заполенены");
        return flag;
    }

    return (
        <div className='component-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='login-part-container'>
                    <h2 className='main-login-text'>Welcome!</h2>
                    <div className='login-form-inputs'>
                        <div className='input-container'>
                            <label for="email-input" className='input-label email-label'>e-мейл</label>
                            <input
                                id='email-input'
                                placeholder='e-мейл'
                                required='required'
                                className='form-input'
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-container'>
                            <label for="password-input" className='input-label password-label'>пароль</label>
                            <input
                                id='password-input'
                                placeholder='пароль'
                                className='form-input'
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required='required'
                            />
                        </div>
                    </div>
                    <button className='btn btn-primary login-button' onClick={handleSubmit} type="button">Войти</button>
                </div>
                <div className='to-register-part-container'>
                    <div className='to-register-part'>
                        <div className='to-register-text'>Или нажмите сюда для <span style={{color: "#F18805"}}>регистрации</span></div>
                        {/* <div onClick={toRegistrationForm} className='to-register'>register</div> */}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
