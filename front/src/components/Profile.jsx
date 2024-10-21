import React, { useEffect, useState } from 'react';
import '../style/profile.css'
import { useAuth } from './AuthContext';
import { getReq, baseURL, putReq } from '../Api';
import defaultImage from '../images/123.svg';
import { useSnackbar } from 'notistack';

const Profile = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [imgSrc, setImgSrc] = useState(defaultImage);
    const { enqueueSnackbar } = useSnackbar();

    const fileInputRef = React.createRef();


    const getUserInfo = async () => {
        try {
            if (user != null && userInfo == null) {
                const response = await getReq(`users/${user.user_id}/`);
                setUserInfo(response);
            }
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
        }
    };

    const capFrstLttr = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleError = () => {
        setImgSrc(defaultImage);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file);
        if (file) {
            const validFormats = ['image/jpeg', 'image/png', 'image/svg+xml'];
            if (validFormats.includes(file.type)) {
                setUserInfo((prev) => {
                    console.log('Previous userInfo:', prev);
                    return {
                        ...prev,
                        imageFile: file,
                    };
                });
                const imageUrl = URL.createObjectURL(file);
                setUserInfo((prev) => ({
                    ...prev,
                    image: imageUrl,
                }));
            } else {
                enqueueSnackbar('Пожалуйста, выберите файл в формате JPG, PNG или SVG.', { variant: 'error' });
            }
        }
    };

    const handleInfoChange = async () => {
        try {
            const formData = new FormData();
            formData.append('image', userInfo.imageFile);
            for (const key in userInfo) {
                if (key !== 'image' && key !== 'imageFile') {
                    formData.append(key, userInfo[key]);
                }
            }
            const response = await putReq(`users/${user.user_id}/`, formData);
            console.log('Profile updated:', response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };



    useEffect(() => {
        getUserInfo();
    }, [user]);

    useEffect(() => {
        if (userInfo) {
            setImgSrc(baseURL + userInfo.image);
        }
        console.log(imgSrc);
    }, [userInfo]);

    return (
        <div className='profile'>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className='img-container'>
                <img
                    src={imgSrc}
                    alt={`Изображение ${capFrstLttr(userInfo?.first_name)}`}
                    onError={handleError}
                    style={{
                        height: '100%',
                        maxWidth: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>

            <div className='user-info-container'>
                <h2>Профиль</h2>
                <div className='user-info'>
                    <div className='user-info-question'>Имя</div>
                    <div className='user-info-answer'>{capFrstLttr(userInfo?.first_name)}</div>
                </div>
                <div className='user-info'>
                    <div className='user-info-question'>Фамилия</div>
                    <div className='user-info-answer'>{capFrstLttr(userInfo?.last_name)}</div>
                </div>
                <div className='user-info'>
                    <div className='user-info-question'>Отчество</div>
                    <div className='user-info-answer'>{capFrstLttr(userInfo?.patronymic)}</div>
                </div>
                <div className='user-info'>
                    <div className='user-info-question'>Е-мейл</div>
                    <div className='user-info-answer'>{userInfo?.email}</div>
                </div>
                <div className='user-info'>
                    <div className='user-info-question'>Номер телефона</div>
                    <div className='user-info-answer'>{userInfo?.phone_number}</div>
                </div>
                <div className='profile-controls'>
                    <div>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.svg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <button onClick={handleButtonClick} className='btn'>Выбрать файл</button>
                    </div>
                    <button className='btn' onClick={handleInfoChange}>Сохранить</button>
                </div>
            </div>
        </div>
    );
};


export default Profile;