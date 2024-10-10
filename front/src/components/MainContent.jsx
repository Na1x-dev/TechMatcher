import { useEffect, useRef, useState } from 'react';
import '../style/mainContent.css'
import ProductCard from './ProductCard';
import axios from 'axios';


const MainContent = () => {
    const [smartphones, setSmartphones] = useState([]);
    const [filteredSmartphones, setFilteredSmartphones] = useState([]);
    const [allSmartphones, setAllSmartphones] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchItem, setSearchItem] = useState('');


    const scrollableDivRef = useRef(null);

    const scrollToTop = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = 0;
        }
    };

    const fetchSmartphones = async (url) => {
        try {
            const response = await axios.get(url);
            setSmartphones(response.data.results);
            setNextPageUrl(response.data.next);
            setPrevPageUrl(response.data.previous);
            scrollToTop();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllSmartphones = async (url) => {
        if (allSmartphones.length == 0) {
            try {
                const response = await axios.get(url);
                setAllSmartphones(response.data);
                scrollToTop();
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
            console.log(allSmartphones)
        }
    };

    useEffect(() => {
        fetchSmartphones('http://127.0.0.1:8000/api/smartphones/');

    }, []);

    const search = (elem) => {
        fetchAllSmartphones('http://127.0.0.1:8000/api/smartphones/all')
        setSearchItem(elem.target.value)
        setFilteredSmartphones(allSmartphones.filter(smartphone =>
            smartphone.title.toLowerCase().includes(searchItem.toLowerCase())
        ))
    }



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='main-content'>
            <div className='main-filters'></div>
            <div className='center-container'>
                <div className='search-product'>
                    <input
                        className='form-input search-product-input'
                        placeholder='Поиск'
                        type="text"
                        value={searchItem}
                        onChange={(e) => search(e)}
                    />
                </div>

                {searchItem ?
                    (<div ref={scrollableDivRef} className='products-list'>
                        {filteredSmartphones.map(smartphone => (
                            <ProductCard key={smartphone.id} smartphone={smartphone} />
                        ))}
                    </div>) :
                    (<div ref={scrollableDivRef} className='products-list'>
                        {smartphones.map(smartphone => (
                            <ProductCard key={smartphone.id} smartphone={smartphone} />
                        ))}
                        <div className='pagination-buttons'>
                            <button disabled={!prevPageUrl} className='btn prev-button' onClick={() => fetchSmartphones(prevPageUrl)}>Предыдущая страница</button>
                            <button disabled={!nextPageUrl} className='btn next-button' onClick={() => fetchSmartphones(nextPageUrl)}>Следующая страница</button>
                        </div>
                    </div>)}




            </div>
            <div className='right-panel'></div>
        </div>
    );
};


export default MainContent;