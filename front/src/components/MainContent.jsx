import { useEffect, useState } from 'react';
import '../style/mainContent.css'
import ProductCard from './ProductCard';
import axios from 'axios';


const MainContent = () => {
    const [smartphones, setSmartphones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSmartphones = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/smartphones/');
                setSmartphones(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSmartphones();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='main-content'>
            <div className='main-filters'></div>
            <div className='center-container'>
                <div className='search-product'>
                    <input className='form-input search-product-input' placeholder='Поиск' type="text" />
                </div>
                <div className='products-list'>
                    {smartphones.map(smartphone => (
                        <ProductCard key={smartphone.id} smartphone={smartphone} />
                    ))}
                </div>
            </div>
            <div className='right-panel'></div>
        </div>
    );
};


export default MainContent;