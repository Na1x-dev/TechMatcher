import { useState } from 'react';
import '../style/productCard.css'

const ProductCard = ({ smartphone }) => {
    const [imgSrc, setImgSrc] = useState(smartphone.image_url);

    const handleError = () => {
        setImgSrc('../images/login.jpg');
    };

    return (
        <div className='product-card'>
            <div className='card-image-container'>
                <img
                    src={imgSrc}
                    alt="Описание изображения"
                    onError={handleError}
                    style={{
                        height: '100%',
                    }}
                />
            </div>
            <div className='card-text-container'>
                <h3 className='card-header-text'>{smartphone.title}</h3>
                <div className='card-info-container'>
                    <p className='card-p'>{smartphone.launch_year} -  Диагональ: {smartphone.screen_size} - Камера: {smartphone.main_camera_mp}</p>
                    <p className='card-p'>Стоимость: {smartphone.price}</p>
                </div>
                <div className='card-btn-container'>
                    <button className='btn card-btn'>Подробнее</button>
                    <button className='btn card-btn'>В корзину</button>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;