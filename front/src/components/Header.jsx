import '../style/header.css'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getReq } from '../Api';
import { useEffect } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth()

    const toHome = () => {
        navigate("/");
    }

    const toLoginForm = () => {
        navigate("/login");
    }

    const logoutFunction = () => {
        logout();
        navigate('/login');
    }

    const capFrstLttr = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const showUser = async () => {
        try {
            if (user != null) {
                const response = await getReq(`users/${user.user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (response.first_name != "" && response.last_name != "" && response.patronymic != "")
                    document.querySelector('.header-user-name').textContent = 
                capFrstLttr(response.last_name) + " " + 
                capFrstLttr(response.first_name[0]) + ". " + 
                capFrstLttr(response.patronymic[0]) + ".";
            }
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
        }
    };

    useEffect(() => {
        showUser();
      }, [user, isAuthenticated]);

    return (
        <header className='header'>

            <div className='header-logo' onClick={toHome} >
                <div className='left-logo'>Tech</div>
                <div className='right-logo'>Matcher</div>
            </div>
            <div className='header-chapters'>
                <div className='header-chapter-button active-chapter-button' >Смартфоны</div>
                <div className='header-chapter-button' onClick={toLoginForm}>Наушники</div>
                <div className='header-chapter-button'>Фитнес браслеты</div>
                <div className='header-chapter-button'>Зарядные устройства</div>
            </div>
            <div className='header-profile'>
                {user ?
                    (
                        <button className='header-user-name btn' onClick={logoutFunction}>admin a.a.</button>
             
                    ) :
                    (
                        // (!hideLoginButtonRoutes.includes(location.pathname) && (
                        <button className='to-login-button btn btn-primary' onClick={toLoginForm}>Вход</button>
                    )}
            </div>
        </header>
    );
};


export default Header;