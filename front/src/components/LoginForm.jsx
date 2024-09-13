import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import '../style/general.css'
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { postReq, getReq } from '../Api';
import { useDispatch } from 'react-redux';
import { setActive } from '../redux/activeSlice';

const LoginForm = () => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState({
        email: false,
        password: false,
    });
    const { login } = useAuth()
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleMouseEnter = (field) => {
        setIsHovered(prev => ({ ...prev, [field]: true }));
    };

    const handleMouseLeave = (field) => {
        setIsHovered(prev => ({ ...prev, [field]: false }));
    };

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

    const handleShowReg = () => {
        dispatch(setActive(true))
    }

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
                            <label id='email-label'
                                style={{
                                    color: isHovered.email || credentials.email ? '#985277' : '#F18805',
                                }}

                                className='input-label email-label'>E-мейл</label>
                            <input
                                onMouseEnter={() => handleMouseEnter('email')}
                                onMouseLeave={() => handleMouseLeave('email')}
                                id='email-input'
                                placeholder='E-мейл'
                                required='required'
                                className='form-input'
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-container'>
                            <label
                                style={{
                                    color: isHovered.password || credentials.password ? '#985277' : '#F18805',
                                }}

                                className='input-label password-label'>Пароль</label>
                            <input
                                onMouseEnter={() => handleMouseEnter('password')}
                                onMouseLeave={() => handleMouseLeave('password')}
                                id='password-input'
                                placeholder='Пароль'
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
                <div className='to-register-part-container' onClick={handleShowReg}>
                    <div className='to-register-part'  >
                        <div className='to-register-text'>Или нажмите сюда для <span style={{ color: "#F18805" }}>регистрации</span></div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
