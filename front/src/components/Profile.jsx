import { useEffect, useState } from 'react';
import '../style/profile.css'
import { useAuth } from './AuthContext';
import { getReq } from '../Api';


const Profile = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null)

    const getUserInfo = async () => {
        try {
            if (user != null && userInfo == null) {
                const response = await getReq(`users/${user.user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setUserInfo(response)
            }
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
        }
    };

    const capFrstLttr = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        getUserInfo();
        console.log(userInfo);
        
    }, [user]);


    return (
        <div className='profile'>
            <div className='img-container'></div>
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