import { useEffect, useState } from 'react';
import '../style/profile.css'
import { useAuth } from './AuthContext';
import { getReq, baseURL } from '../Api';
import defaultImage from '../images/123.svg';

const Profile = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [imgSrc, setImgSrc] = useState(defaultImage);
    

    const getUserInfo = async () => {
        try {
            if (user != null && userInfo == null) {
                const response = await getReq(`users/${user.user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
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
        </div>
    );
};


export default Profile;