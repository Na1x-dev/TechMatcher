import { useSelector } from 'react-redux';
import '../style/productDetails.css'
import { useState } from 'react';
import defaultImage from '../images/defaultImg.jpg';
import { Button } from '@mui/material';

const ProductDetails = () => {
    const { smartphone } = useSelector((state) => state.smartphone);
    const [imgSrc, setImgSrc] = useState(smartphone.image_url);

    const handleError = () => {
        setImgSrc(defaultImage);
    };


    if (!smartphone) {
        return <div>Loading...</div>;
    }

    return (
        <div className='pd-container'>
            <section className='main-info dt-section'>
                <div className='image-part'>
                    <img
                        src={imgSrc}
                        alt={`Изображение ${smartphone.title}`}
                        onError={handleError}
                        style={{
                            height: '100%',
                            maxWidth: '27vw',
                        }}
                    />
                </div>
                <div className='text-part'>
                    <h2>{smartphone.title}</h2>
                    <div className='main-info-text-cont'>
                        <h4 className='section-name'>Основная информация</h4>
                        <div className='main-info-parts'>
                            <div className='left-info'><p>Год Выхода - {smartphone.launch_year}</p>
                                <p>Диагональ дисплея - {smartphone.screen_size}</p>
                                <p>Разрешение главной камеры - {smartphone.main_camera_mp}</p>
                                <p>Аккумулятор - {smartphone.accum_volume}</p>
                                <p>Стоимость - {smartphone.price === '-' ? 'нет в наличии' : smartphone.price}</p></div>
                            <div className='right-info'>
                                <p>Версия ОС - {smartphone.os_version}</p>
                                <p>Процессор - {smartphone.cpu}</p>
                                
                            </div>
                        </div>
                    </div>
                    <Button className='btn main-sec-btn' >
                        В корзину
                    </Button>
                </div>

            </section>
            <section className='display-sc dt-section'>
                <div className='text-part'>
                    <h2 className='section-name'>Дисплей</h2>
                    <p>Диагональ дисплея - {smartphone.screen_size}</p>
                    <p>Количество точек на дюйм - {smartphone.ppi}</p>
                    <p>Разрешение дисплея - {smartphone.screen_res}</p>
                    <p>Тип матрицы - {smartphone.screen_type}</p>
                    <p>Частота обновления экрана - {smartphone.screen_fps}</p>
                    <p>Тип стекла дисплея - {smartphone.screen_protector=== '-' ? '?' : smartphone.screen_protector}</p>
                    <p>Соотношение сторон экрана - {smartphone.screen_ratio}</p>
                    <p>Количество цветов - {smartphone.color_count}</p>
                </div>
                <div className='image-part'>
                </div>
            </section>

            <section className='camera-sc dt-section'>
                <div className='image-part'></div>
         
                <div className='text-part'>
                    <h2 className='section-name'>Камера</h2>
                    <p>Разрешение главного модуля - {smartphone.main_camera_mp}</p>
                    <p>Количество модулей камеры - {smartphone.camera_count}</p>
                    <p>Типы модулей камеры - {smartphone.camera_type}</p>
                    <p>Максимальное разрешение видео - {smartphone.max_video_resolution}</p>
                    <p>Разрешение фронтальной камеры - {smartphone.front_camera_mp}</p>
                    <p>Апертура фронтальной камеры - {smartphone.front_camera_aperture}</p>
                    <p></p>
                    <p></p>
                    <p>Полная информация о модулях: {smartphone.camera_block}</p>
                </div>

            </section>
            <section className='soc-sc dt-section'>
                <div className='text-part'>
                <h2 className='section-name'>Процессор</h2>
                </div>
                <div className='image-part'>
                </div>
            </section>
        </div>
    );
};


export default ProductDetails;

