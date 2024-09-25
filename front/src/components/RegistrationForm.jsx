import React, { useState } from 'react';
import '../style/registration.css'
import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../redux/activeSlice';
import { useNavigate } from 'react-router-dom';
import { postReq } from '../Api';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';

const RegistrationForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const isActive = useSelector((state) => state.active.isActive)
    const navigate = useNavigate();
    const { login } = useAuth()
    const [credentials, setCredentials] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isHovered, setIsHovered] = useState({
        firstName: false,
        lastName: false,
        patronymic: false,
        phoneNumber: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

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

    const handleHideReg = () => {
        dispatch(setActive(false))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checkIsEmptyFields()) {
            return;
        }
        if (!arePasswordsMatching()) {
            enqueueSnackbar('Пароли не совпадают', { variant: 'error' });
            return;
        }
        try {
            await registerUser();
            const response = await loginUser();
            login(response.access, response.refresh);
            navigate('/');
        } catch (error) {
            handleError(error);
        }
    };

    const arePasswordsMatching = () => {
        return credentials.password === credentials.confirmPassword;
    };

    const registerUser = async () => {
        await postReq('/register/', {
            email: credentials.email,
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            phone_number: credentials.phoneNumber,
            patronymic: credentials.patronymic,
            password: credentials.password,
        });
    };

    const loginUser = async () => {
        return await postReq('/token/', {
            email: credentials.email,
            password: credentials.password,
        });
    };

    const handleError = (error) => {
        console.error('Произошла ошибка!', error);
        enqueueSnackbar('E-мейл уже используется или неверный формат', { variant: 'error' });
    };

    const checkIsEmptyFields = () => {
        let flag = false;
        const form = document.querySelector('.registration-form-container');
        const fields = form.getElementsByClassName('form-input');
        for (let field of fields) {
            if (field.value == '') {
                field.classList.add('error-field');
                flag = true;
            }
            else field.classList.remove('error-field');
        }
        if (flag)
            enqueueSnackbar('Не все поля заполнены', { variant: 'error' });
        return flag;
    }

    return (
        <div className={`registration-form-container ${isActive ? 'active-form' : ''}`}>
            <div className='left-fields'>
                <div className='register-header-text'>Регистрация</div>
                <div className='close-registration' onClick={handleHideReg}>
                    На страницу <span style={{ color: "#985277" }}>входа</span>
                </div>
            </div>
            <div className='center-fields'><div>
                <label className='input-label registration-form-label'
                    style={{
                        color: isHovered.firstName || credentials.firstName ? '#F18805' : '#985277',
                    }}
                >Имя</label>
                <input
                    onMouseEnter={() => handleMouseEnter('firstName')}
                    onMouseLeave={() => handleMouseLeave('firstName')}
                    placeholder='Имя'
                    className='form-input registration-form-input'
                    type="text"
                    name="firstName"
                    value={credentials.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
                <div>
                    <label
                        style={{
                            color: isHovered.lastName || credentials.lastName ? '#F18805' : '#985277',
                        }}
                        className='input-label registration-form-label'>Фамилия</label>
                    <input
                        onMouseEnter={() => handleMouseEnter('lastName')}
                        onMouseLeave={() => handleMouseLeave('lastName')}
                        placeholder='Фамилия'
                        className='form-input registration-form-input '
                        type="text"
                        name="lastName"
                        value={credentials.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{
                        color: isHovered.patronymic || credentials.patronymic ? '#F18805' : '#985277',
                    }} className='input-label registration-form-label'>Отчество</label>
                    <input
                        onMouseEnter={() => handleMouseEnter('patronymic')}
                        onMouseLeave={() => handleMouseLeave('patronymic')}
                        placeholder='Отчество'
                        className='form-input registration-form-input'
                        type="text"
                        name="patronymic"
                        value={credentials.patronymic}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{
                        color: isHovered.phoneNumber || credentials.phoneNumber ? '#F18805' : '#985277',
                    }} className='input-label registration-form-label'>Номер телефона</label>
                    <input
                        onMouseEnter={() => handleMouseEnter('phoneNumber')}
                        onMouseLeave={() => handleMouseLeave('phoneNumber')}
                        placeholder='Номер телефона'
                        className='form-input registration-form-input'
                        type="text"
                        name="phoneNumber"
                        value={credentials.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className='right-fields'>
                <div>
                    <label style={{
                        color: isHovered.email || credentials.email ? '#985277' : '#F18805',
                    }} className='input-label'>E-мейл</label>
                    <input
                        onMouseEnter={() => handleMouseEnter('email')}
                        onMouseLeave={() => handleMouseLeave('email')}
                        placeholder='E-мейл'
                        className='form-input registration-form-right-input'
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{
                        color: isHovered.password || credentials.password ? '#985277' : '#F18805',
                    }} className='input-label'>Пароль</label>
                    <input
                        onMouseEnter={() => handleMouseEnter('password')}
                        onMouseLeave={() => handleMouseLeave('password')}
                        placeholder='Пароль'
                        className='form-input registration-form-right-input'
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{
                        color: isHovered.confirmPassword || credentials.confirmPassword ? '#985277' : '#F18805',
                    }} className='input-label'>Повторите пароль</label>
                    <input
                        onMouseEnter={() => handleMouseEnter('confirmPassword')}
                        onMouseLeave={() => handleMouseLeave('confirmPassword')}
                        placeholder='Повторите пароль'
                        className='form-input registration-form-right-input'
                        type="password"
                        name="confirmPassword"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Button className='btn btn-primary register-button' onClick={handleSubmit} >
                    Зарегистрироваться
                </Button>
            </div>
        </div>
    );
};


export default RegistrationForm;