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
                    <svg xmlns="http://www.w3.org/2000/svg" width="250" height="500" viewBox="0 0 250 500" fill="none">
                        <rect x="3.5" y="3.5" width="243" height="493" rx="26.5" stroke="black" stroke-width="7" stroke-linejoin="round" />
                        <circle cx="125" cy="23" r="8.5" stroke="black" stroke-width="3" />
                        <line x1="239.676" y1="12.3257" x2="10.6756" y2="487.326" stroke="black" stroke-width="1.5" />
                        <circle cx="125.25" cy="249.75" r="1.375" stroke="black" stroke-width="2.75" />
                        <line x1="239.25" y1="22" x2="239.25" y2="15" stroke="black" stroke-width="1.5" />
                        <line x1="231.584" y1="18.376" x2="237.584" y2="14.376" stroke="black" stroke-width="1.5" />
                        <line x1="12.584" y1="485.376" x2="18.584" y2="481.376" stroke="black" stroke-width="1.5" />
                        <line x1="11.25" y1="485" x2="11.25" y2="477" stroke="black" stroke-width="1.5" />
                    </svg>
                </div>
            </section>

            <section className='camera-sc dt-section'>
                <div className='image-part'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="350" viewBox="0 0 400 350" fill="none">
                        <path d="M50 2.5H350C376.234 2.5 397.5 23.7665 397.5 50V347.5H2.5V50C2.5 23.7665 23.7665 2.5 50 2.5Z" stroke="black" stroke-width="5" />
                        <circle cx="72" cy="72" r="42.5" stroke="black" stroke-width="5" />
                        <circle cx="71.5" cy="72.5" r="19" stroke="black" stroke-width="5" />
                        <circle cx="160.5" cy="72.5" r="10" stroke="black" stroke-width="5" />
                        <line x1="28.5303" y1="27.4697" x2="177.53" y2="176.47" stroke="black" stroke-width="1.5" />
                        <line x1="177" y1="176.25" x2="250" y2="176.25" stroke="black" stroke-width="1.5" />
                        <circle cx="250.75" cy="176.25" r="1.375" stroke="black" stroke-width="2.75" />
                        <line x1="41" y1="39.75" x2="34" y2="39.75" stroke="black" stroke-width="1.5" />
                        <line x1="40.75" y1="33" x2="40.75" y2="40" stroke="black" stroke-width="1.5" />
                        <line x1="104" y1="103.25" x2="111" y2="103.25" stroke="black" stroke-width="1.5" />
                        <line x1="104.25" y1="110" x2="104.25" y2="103" stroke="black" stroke-width="1.5" />
                    </svg>
                </div>

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none">
                        <rect x="22.5" y="22.5" width="195" height="195" rx="7.5" stroke="black" stroke-width="5" />
                        <path d="M85.0909 102.091C84.8182 99.7879 83.7121 98 81.7727 96.7273C79.8333 95.4545 77.4545 94.8182 74.6364 94.8182C72.5758 94.8182 70.7727 95.1515 69.2273 95.8182C67.697 96.4848 66.5 97.4015 65.6364 98.5682C64.7879 99.7348 64.3636 101.061 64.3636 102.545C64.3636 103.788 64.6591 104.856 65.25 105.75C65.8561 106.629 66.6288 107.364 67.5682 107.955C68.5076 108.53 69.4924 109.008 70.5227 109.386C71.553 109.75 72.5 110.045 73.3636 110.273L78.0909 111.545C79.303 111.864 80.6515 112.303 82.1364 112.864C83.6364 113.424 85.0682 114.189 86.4318 115.159C87.8106 116.114 88.947 117.341 89.8409 118.841C90.7349 120.341 91.1818 122.182 91.1818 124.364C91.1818 126.879 90.5227 129.152 89.2045 131.182C87.9015 133.212 85.9924 134.826 83.4773 136.023C80.9773 137.22 77.9394 137.818 74.3636 137.818C71.0303 137.818 68.1439 137.28 65.7045 136.205C63.2803 135.129 61.3712 133.629 59.9773 131.705C58.5985 129.78 57.8182 127.545 57.6364 125H63.4545C63.6061 126.758 64.197 128.212 65.2273 129.364C66.2727 130.5 67.5909 131.348 69.1818 131.909C70.7879 132.455 72.5152 132.727 74.3636 132.727C76.5152 132.727 78.447 132.379 80.1591 131.682C81.8712 130.97 83.2273 129.985 84.2273 128.727C85.2273 127.455 85.7273 125.97 85.7273 124.273C85.7273 122.727 85.2955 121.47 84.4318 120.5C83.5682 119.53 82.4318 118.742 81.0227 118.136C79.6136 117.53 78.0909 117 76.4545 116.545L70.7273 114.909C67.0909 113.864 64.2121 112.371 62.0909 110.432C59.9697 108.492 58.9091 105.955 58.9091 102.818C58.9091 100.212 59.6136 97.9394 61.0227 96C62.447 94.0455 64.3561 92.5303 66.75 91.4545C69.1591 90.3636 71.8485 89.8182 74.8182 89.8182C77.8182 89.8182 80.4848 90.3561 82.8182 91.4318C85.1515 92.4924 87 93.947 88.3636 95.7955C89.7424 97.6439 90.4697 99.7424 90.5455 102.091H85.0909ZM139.722 113.727C139.722 118.636 138.835 122.879 137.062 126.455C135.29 130.03 132.858 132.788 129.767 134.727C126.676 136.667 123.146 137.636 119.176 137.636C115.206 137.636 111.676 136.667 108.585 134.727C105.494 132.788 103.063 130.03 101.29 126.455C99.517 122.879 98.6307 118.636 98.6307 113.727C98.6307 108.818 99.517 104.576 101.29 101C103.063 97.4242 105.494 94.6667 108.585 92.7273C111.676 90.7879 115.206 89.8182 119.176 89.8182C123.146 89.8182 126.676 90.7879 129.767 92.7273C132.858 94.6667 135.29 97.4242 137.062 101C138.835 104.576 139.722 108.818 139.722 113.727ZM134.267 113.727C134.267 109.697 133.593 106.295 132.244 103.523C130.911 100.75 129.1 98.6515 126.812 97.2273C124.54 95.803 121.994 95.0909 119.176 95.0909C116.358 95.0909 113.805 95.803 111.517 97.2273C109.244 98.6515 107.434 100.75 106.085 103.523C104.752 106.295 104.085 109.697 104.085 113.727C104.085 117.758 104.752 121.159 106.085 123.932C107.434 126.705 109.244 128.803 111.517 130.227C113.805 131.652 116.358 132.364 119.176 132.364C121.994 132.364 124.54 131.652 126.812 130.227C129.1 128.803 130.911 126.705 132.244 123.932C133.593 121.159 134.267 117.758 134.267 113.727ZM186.653 105H181.017C180.684 103.379 180.1 101.955 179.267 100.727C178.449 99.5 177.449 98.4697 176.267 97.6364C175.1 96.7879 173.805 96.1515 172.381 95.7273C170.956 95.303 169.472 95.0909 167.926 95.0909C165.108 95.0909 162.555 95.803 160.267 97.2273C157.994 98.6515 156.184 100.75 154.835 103.523C153.502 106.295 152.835 109.697 152.835 113.727C152.835 117.758 153.502 121.159 154.835 123.932C156.184 126.705 157.994 128.803 160.267 130.227C162.555 131.652 165.108 132.364 167.926 132.364C169.472 132.364 170.956 132.152 172.381 131.727C173.805 131.303 175.1 130.674 176.267 129.841C177.449 128.992 178.449 127.955 179.267 126.727C180.1 125.485 180.684 124.061 181.017 122.455H186.653C186.229 124.833 185.456 126.962 184.335 128.841C183.214 130.72 181.82 132.318 180.153 133.636C178.487 134.939 176.616 135.932 174.54 136.614C172.479 137.295 170.275 137.636 167.926 137.636C163.956 137.636 160.426 136.667 157.335 134.727C154.244 132.788 151.813 130.03 150.04 126.455C148.267 122.879 147.381 118.636 147.381 113.727C147.381 108.818 148.267 104.576 150.04 101C151.813 97.4242 154.244 94.6667 157.335 92.7273C160.426 90.7879 163.956 89.8182 167.926 89.8182C170.275 89.8182 172.479 90.1591 174.54 90.8409C176.616 91.5227 178.487 92.5227 180.153 93.8409C181.82 95.1439 183.214 96.7348 184.335 98.6136C185.456 100.477 186.229 102.606 186.653 105Z" fill="black" />
                        <line x1="58.5" y1="20" x2="58.5" stroke="black" stroke-width="3" />
                        <line x1="43.5" y1="20" x2="43.5" stroke="black" stroke-width="3" />
                        <line x1="73.5" y1="20" x2="73.5" stroke="black" stroke-width="3" />
                        <line x1="88.5" y1="20" x2="88.5" stroke="black" stroke-width="3" />
                        <line x1="103.5" y1="20" x2="103.5" stroke="black" stroke-width="3" />
                        <line x1="148.5" y1="20" x2="148.5" stroke="black" stroke-width="3" />
                        <line x1="133.5" y1="20" x2="133.5" stroke="black" stroke-width="3" />
                        <line x1="163.5" y1="20" x2="163.5" stroke="black" stroke-width="3" />
                        <line x1="178.5" y1="20" x2="178.5" stroke="black" stroke-width="3" />
                        <line x1="193.5" y1="20" x2="193.5" stroke="black" stroke-width="3" />
                        <line x1="118.5" y1="20" x2="118.5" stroke="black" stroke-width="3" />
                        <line x1="58.5" y1="240" x2="58.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="43.5" y1="240" x2="43.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="73.5" y1="240" x2="73.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="88.5" y1="240" x2="88.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="103.5" y1="240" x2="103.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="148.5" y1="240" x2="148.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="133.5" y1="240" x2="133.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="163.5" y1="240" x2="163.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="178.5" y1="240" x2="178.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="193.5" y1="240" x2="193.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="118.5" y1="240" x2="118.5" y2="220" stroke="black" stroke-width="3" />
                        <line x1="220" y1="193.5" x2="240" y2="193.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="178.5" x2="240" y2="178.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="163.5" x2="240" y2="163.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="148.5" x2="240" y2="148.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="133.5" x2="240" y2="133.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="118.5" x2="240" y2="118.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="103.5" x2="240" y2="103.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="88.5" x2="240" y2="88.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="73.5" x2="240" y2="73.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="58.5" x2="240" y2="58.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="43.5" x2="240" y2="43.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="193.5" x2="240" y2="193.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="178.5" x2="240" y2="178.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="163.5" x2="240" y2="163.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="148.5" x2="240" y2="148.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="133.5" x2="240" y2="133.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="118.5" x2="240" y2="118.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="103.5" x2="240" y2="103.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="88.5" x2="240" y2="88.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="73.5" x2="240" y2="73.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="58.5" x2="240" y2="58.5" stroke="black" stroke-width="3" />
                        <line x1="220" y1="43.5" x2="240" y2="43.5" stroke="black" stroke-width="3" />
                        <line y1="193.5" x2="20" y2="193.5" stroke="black" stroke-width="3" />
                        <line y1="178.5" x2="20" y2="178.5" stroke="black" stroke-width="3" />
                        <line y1="163.5" x2="20" y2="163.5" stroke="black" stroke-width="3" />
                        <line y1="148.5" x2="20" y2="148.5" stroke="black" stroke-width="3" />
                        <line y1="133.5" x2="20" y2="133.5" stroke="black" stroke-width="3" />
                        <line y1="118.5" x2="20" y2="118.5" stroke="black" stroke-width="3" />
                        <line y1="103.5" x2="20" y2="103.5" stroke="black" stroke-width="3" />
                        <line y1="88.5" x2="20" y2="88.5" stroke="black" stroke-width="3" />
                        <line y1="73.5" x2="20" y2="73.5" stroke="black" stroke-width="3" />
                        <line y1="58.5" x2="20" y2="58.5" stroke="black" stroke-width="3" />
                        <line y1="43.5" x2="20" y2="43.5" stroke="black" stroke-width="3" />
                    </svg>
                </div>
            </section>
            <section className='body-sc dt-section'>
                <div className='image-part'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="415" height="550" viewBox="0 0 415 550" fill="none">
                        <rect x="26.5" y="27.5" width="245" height="495" rx="27.5" stroke="black" stroke-width="5" stroke-linejoin="round" />
                        <line x1="27" y1="152.5" x2="270" y2="152.5" stroke="black" stroke-width="3" />
                        <path d="M87 117L147 117" stroke="black" stroke-width="50" stroke-linecap="round" />
                        <line x1="24" y1="82.5" x2="270" y2="82.5" stroke="black" stroke-width="3" />
                        <line x1="300" y1="25.75" y2="25.75" stroke="black" stroke-width="1.5" />
                        <line y1="524.25" x2="300" y2="524.25" stroke="black" stroke-width="1.5" />
                        <line x1="273.25" y1="550" x2="273.25" y2="-3.27835e-08" stroke="black" stroke-width="1.5" />
                        <line x1="340.75" x2="340.75" y2="550" stroke="black" stroke-width="1.5" />
                        <line x1="373.25" y1="550" x2="373.25" y2="-3.27835e-08" stroke="black" stroke-width="1.5" />
                        <line x1="24.75" y1="3.27835e-08" x2="24.75" y2="550" stroke="black" stroke-width="1.5" />
                        <path d="M355 26.5H347C343.962 26.5 341.5 28.9624 341.5 32V518C341.5 521.038 343.962 523.5 347 523.5H355C365.217 523.5 373.5 515.217 373.5 505V45C373.5 34.7827 365.217 26.5 355 26.5Z" stroke="black" stroke-width="3" />
                        <line x1="392.5" y1="81" x2="392.5" y2="154" stroke="black" stroke-width="3" />
                        <line x1="393" y1="82.5" x2="374" y2="82.5" stroke="black" stroke-width="3" />
                        <line x1="393" y1="152.5" x2="374" y2="152.5" stroke="black" stroke-width="3" />
                        <path d="M357 132L357 177" stroke="black" stroke-width="10" stroke-linecap="round" />
                        <path d="M357 212L357 307" stroke="black" stroke-width="10" stroke-linecap="round" />
                        <line x1="415" y1="25.75" x2="310" y2="25.75" stroke="black" stroke-width="1.5" />
                        <line x1="310" y1="524.25" x2="415" y2="524.25" stroke="black" stroke-width="1.5" />
                        <line x1="394" y1="153.25" x2="414" y2="153.25" stroke="black" stroke-width="1.5" />
                        <line x1="414" y1="81.75" x2="394" y2="81.75" stroke="black" stroke-width="1.5" />
                        <line x1="393.25" y1="81" x2="393.25" y2="61" stroke="black" stroke-width="1.5" />
                        <line x1="393.25" y1="174" x2="393.25" y2="154" stroke="black" stroke-width="1.5" />
                    </svg>
                </div>
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

