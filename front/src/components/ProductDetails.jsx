import { useSelector } from 'react-redux';
import '../style/productDetails.css'


const ProductDetails = () => {
    const { smartphone } = useSelector((state) => state.smartphone);

    console.log(smartphone);
    

    if (!smartphone) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className='pd-container'>
            <div>
                <h2>{smartphone.title}</h2>
                <p>Launch Year: {smartphone.launch_year}</p>
                <p>Screen Size: {smartphone.screen_size}</p>
                <p>Main Camera: {smartphone.main_camera_mp}</p>
                <p>Price: {smartphone.price}</p>
                {/* Add more product details as needed */}
            </div>
        </div>
    );
};


export default ProductDetails;

