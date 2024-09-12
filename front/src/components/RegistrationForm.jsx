import React, { useState } from 'react';
import '../style/registration.css'


const RegistrationForm = () => {
    const [credentials, setCredentials] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    return (
        <div className='registration-form-container'>
            <div className='left-fields'>
                <div className='register-header-text'>Регистрация</div>
                <div className='close-registration'>
                    На страницу <span style={{ color: "#985277" }}>входа</span>
                </div>
            </div>
            <div className='center-fields'><div>
                <label className='input-label registration-form-label'>Имя</label>
                <input
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
                    <label className='input-label registration-form-label'>Фамилия</label>
                    <input
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
                    <label className='input-label registration-form-label'>Отчество</label>
                    <input
                        placeholder='Отчество'
                        className='form-input registration-form-input'
                        type="text"
                        name="middleName"
                        value={credentials.patronymic}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className='input-label registration-form-label'>Номер телефона</label>
                    <input
                        placeholder='Номер телефона'
                        className='form-input registration-form-input'
                        type="text"
                        name="middleName"
                        value={credentials.patronymic}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className='right-fields'><div>
                <label className='input-label'>E-мейл</label>
                <input
                placeholder='E-мейл'
                    className='form-input'
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />
            </div>
                <div>
                    <label className='input-label'>Пароль</label>
                    <input
                        placeholder='Пароль'
                        className='form-input'
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className='input-label'>Повторите пароль</label>
                    <input
                    placeholder='Повторите пароль'
                        className='form-input'
                        type="password"
                        name="confirmPassword"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div></div>

        </div>
    );
};


export default RegistrationForm;