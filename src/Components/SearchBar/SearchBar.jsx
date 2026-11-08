import { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../Constants/Constant';
import { formatPrice } from '../../Helpers/price';
import './SearchBar.css';

const MAX_SUGGESTIONS = 6;

// fields of a product that the search looks at
const matchesSearch = (product, term) =>
    ['name', 'brand', 'type', 'category', 'author', 'gender'].some(field =>
        product[field] && product[field].toLowerCase().includes(term));

const SearchBar = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const boxRef = useRef(null);

    useEffect(() => {
        getAllProducts(setProducts);
    }, []);

    // close the dropdown when clicking anywhere else
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setShowResults(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const term = searchTerm.trim().toLowerCase();
    const results = term ? products.filter(product => matchesSearch(product, term)) : [];

    const goToResults = (e) => {
        e.preventDefault();
        if (!term) return;
        setShowResults(false);
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setShowResults(false);
    };

    return (
        <div className='search' ref={boxRef}>
            <form className='search__form' onSubmit={goToResults}>
                <input
                    type='search'
                    className='search__input'
                    placeholder='Search for products, brands and more'
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
                />
                <button type='submit' className='search__button' aria-label='Search'>
                    <AiOutlineSearch />
                </button>
            </form>

            {showResults && term && (
                <div className='search__results'>
                    {results.length === 0 ? (
                        <p className='search__empty'>No products found for "{searchTerm}"</p>
                    ) : (
                        <>
                            {results.slice(0, MAX_SUGGESTIONS).map(product => (
                                <Link
                                    key={product._id}
                                    to={`/Detail/type/${product.type}/${product._id}`}
                                    className='search__item'
                                    onClick={clearSearch}
                                >
                                    <img src={product.image} alt={product.name} />
                                    <div>
                                        <p className='search__item-name'>{product.name}</p>
                                        <p className='search__item-price'>{formatPrice(product.price)}</p>
                                    </div>
                                </Link>
                            ))}
                            <button className='search__all' onClick={goToResults}>
                                See all {results.length} results
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
