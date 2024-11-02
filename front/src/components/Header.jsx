import '../style/header.css'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getReq } from '../Api';
import { useEffect, useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth()
    const [anchorEl, setAnchorEl] = useState(null);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (action) => {
        setAnchorEl(null);
        if (action) {
        }
    };

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
                        capFrstLttr(response.first_name)
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
                {/*  active-chapter-button */}
                <NavLink to='/' className={({ isActive }) => "header-chapter-button" + (isActive ? " active-chapter-button" : "")}>Смартфоны</NavLink>
                <NavLink to='/headphones' className={({ isActive }) => "header-chapter-button" + (isActive ? " active-chapter-button" : "")}>Наушники</NavLink>
                <NavLink to='/fitness-bracelets' className={({ isActive }) => "header-chapter-button" + (isActive ? " active-chapter-button" : "")}>Фитнес браслеты</NavLink>
                <NavLink to='/chargers' className={({ isActive }) => "header-chapter-button" + (isActive ? " active-chapter-button" : "")}>Зарядные устройства</NavLink>
            </div>
            <div className='header-profile'>
                {user ?
                    (

                        // <button className='header-user-name btn' onClick={logoutFunction}>admin a.a.</button>
                        <div className='header-profile-btn-container'>
                            <Button aria-controls="simple-menu" aria-haspopup="true" className='header-user-name btn' onClick={handleClick}>
                                admin a.a
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={() => handleClose()}
                                TransitionProps={{ timeout: 300 }} // Задаем время анимации
                            >
                                <MenuItem onClick={() => navigate('/profile')}>Профиль</MenuItem>
                                <MenuItem onClick={() => navigate('/basket')}>Корзина</MenuItem>
                                <MenuItem onClick={logoutFunction}>Выход</MenuItem>
                            </Menu>
                        </div>
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