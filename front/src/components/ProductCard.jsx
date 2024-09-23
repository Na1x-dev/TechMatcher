import '../style/productCard.css'

const ProductCard = ({smartphone}) => {

    return (
        <div className='product-card'>
            <h3>{smartphone.title}</h3>
            <p>{smartphone.description}</p>
            <p>{smartphone.price}</p>
        </div>
    );
};


export default ProductCard;