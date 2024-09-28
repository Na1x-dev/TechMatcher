import { useDispatch, useSelector } from 'react-redux';
import '../style/productDetails.css'
import { useEffect, useState } from 'react';
import defaultImage from '../images/defaultImg.jpg';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getReq } from '../Api';
import { setSmartphone } from '../redux/smartphoneSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const { smartphone } = useSelector((state) => state.smartphone);
    const [imgSrc, setImgSrc] = useState(defaultImage);;
    const dispatch = useDispatch();

    const handleError = () => {
        setImgSrc(defaultImage);
    };

    useEffect(() => {
        const getSmartponeById = async () => {
            try {
                const response = await getReq('/smartphones/' + id);
                if (response && response.id) {
                    dispatch(setSmartphone(response))
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if (!smartphone) {
            getSmartponeById()
        } else if (smartphone.image_url) {
            setImgSrc(smartphone.image_url);

        }

    }, [dispatch, smartphone, id]);

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
                    <p>Тип стекла дисплея - {smartphone.screen_protector === '-' ? '?' : smartphone.screen_protector}</p>
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
                    <p>Процессор - {smartphone.cpu}</p>
                    <p>Техпроцесс - {smartphone.tech_process}</p>
                    <p>Графический ускоритель - {smartphone.gpu === '-' ? '?' : smartphone.gpu}</p>
                </div>
                <div className='image-part'>
                </div>
            </section>
            <section className='body-sc dt-section'>
                <div className='image-part'></div>
                <div className='text-part'>

                    <h2 className='section-name'>Корпус</h2>
                    <p>Длина - {smartphone.length}</p>
                    <p>Ширина - {smartphone.width}</p>
                    <p>Толщина - {smartphone.thickness}</p>
                    <p>Вес - {smartphone.weight}</p>
                    <p>Материал задней панели - {smartphone.back_material}</p>
                    <p>Цвет задней панели - {smartphone.back_color}</p>
                    <p>Материал граней - {smartphone.edges_material}</p>
                    <p>Стандарт защиты - {smartphone.protection === '-' ? '?' : smartphone.protection}</p>
                </div>
            </section>
            <section className='accum-sc dt-section'>
                <div className='text-part'>
                    <h2 className='section-name'>Аккумулятор</h2>
                    <p>Объем аккумулятора - {smartphone.accum_volume}</p>
                    <p>Тип аккумулятора - {smartphone.accum_type}</p>
                    <p>Мощность зарадки - {smartphone.charging_power === '-' ? '?' : smartphone.charging_power}</p>
                    <p>Беспроводная зарядка - {smartphone.wireless_charging === '-' ? 'X' : smartphone.wireless_charging}</p>
                </div>
                <div className='image-part'>
                </div>
            </section>
            <section className='interfaces-sc dt-section'>
            <div className='image-part'>
            </div>
                <div className='text-part'>
                    <h2 className='section-name'>Интерфейсы</h2>
                    <p>Bluetooth - {smartphone.bluetooth}</p>
                    <p>Аудио раъем - {smartphone.audio_port}</p>
                    <p>Разъем подключения - {smartphone.charge_port}</p>
                    <p>Wi-Fi - {smartphone.wireless_charging}</p>
                    <p>NFC - {smartphone.nfc ? 'Есть' : 'Нет'}</p>
                    <p>5G - {smartphone._5g ? 'Есть' : 'Нет'}</p>
                </div>
                
            </section>
            {/* bluetooth = models.TextField()
    audio_port = models.TextField()
    charge_port = models.TextField()
    wifi = models.TextField()
    nfc = models.BooleanField()
    _5g = models.BooleanField() 
    sim_count = models.TextField()
    sim_type = models.TextField()
     */}
        </div>
    );
};


export default ProductDetails;

