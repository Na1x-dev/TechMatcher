import { useState } from 'react';
import '../style/productCard.css'
import defaultImage from '../images/defaultImg.jpg';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSmartphone } from '../redux/smartphoneSlice';


const ProductCard = ({ smartphone }) => {
    const [imgSrc, setImgSrc] = useState(smartphone.image_url);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleError = () => {
        setImgSrc(defaultImage);
    };

    const handleDetailsClick = () => {
        dispatch(setSmartphone(smartphone));
        navigate(`/product/${smartphone.id}`);
    };

    return (
        <div className='product-card'>
            <div className='card-image-container'>
                <img
                    src={imgSrc}
                    alt={`Изображение ${smartphone.title}`}
                    onError={handleError}
                    style={{
                        height: '100%',
                        maxWidth: '12vw',
                    }}
                />
            </div>
            <div className='card-text-container'>
                <h3 className='card-header-text'>{smartphone.title}</h3>
                <div className='card-info-container'>
                    <p className='card-p'>{smartphone.launch_year} - Диагональ: {smartphone.screen_size} - Камера: {smartphone.main_camera_mp}</p>
                    <p>Стоимость - {smartphone.price === '-' ? 'нет в наличии' : smartphone.price}</p>
                </div>
                <div className='card-btn-container'>
                    <Button className='btn card-btn' onClick={handleDetailsClick}>
                        Подробнее
                    </Button>
                    <Button className='btn card-btn' >
                        В корзину
                    </Button>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;