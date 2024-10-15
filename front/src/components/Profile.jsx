import { useEffect, useState } from 'react';
import '../style/profile.css'
import { useAuth } from './AuthContext';
import { getReq, baseURL, putReq } from '../Api';
import defaultImage from '../images/123.svg';

const Profile = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [imgSrc, setImgSrc] = useState(defaultImage);
    

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

    const handleImageChange = (event) => {
        // const file = event.target.files[0];
        // if (file) {
            // const formData = new FormData();
            // formData.append('image', file);
            
            try {
                if (user != null && userInfo == null) {
                    const response = putReq(`users/${user.user_id}/`, userInfo);
                }
            } catch (error) {
                console.error('Ошибка при получении пользователя:', error);
            }
        //     postReq(users/${user.user_id}/upload-image/, formData, {
        //         headers: {
        //             'Authorization': Bearer ${localStorage.getItem('accessToken')},
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     })
        //     .then(response => {
        //         // Обновите состояние с новым изображением
        //         setImgSrc(baseURL + response.data.image);
        //         setUserInfo(prev => ({ ...prev, image: response.data.image }));
        //     })
        //     .catch(error => {
        //         console.error('Ошибка при загрузке изображения:', error);
        //     });
        // }
    };

    useEffect(() => {
        getUserInfo();
    }, [user]);
  
    useEffect(() => {
        if (userInfo) {
            setImgSrc(baseURL + userInfo.image);
        }
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
            </div>

            <input className='btn' onClick={handleImageChange}>Сохранить</input>
        </div>
    );
};


export default Profile;