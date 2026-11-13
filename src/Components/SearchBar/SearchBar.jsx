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
    // index of the suggestion picked with the arrow keys (-1 = none)
    const [activeIndex, setActiveIndex] = useState(-1);
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
    const suggestions = results.slice(0, MAX_SUGGESTIONS);

    const openProduct = (product) => {
        setSearchTerm('');
        setShowResults(false);
        setActiveIndex(-1);
        navigate(`/Detail/type/${product.type}/${product._id}`);
    };

    const goToResults = (e) => {
        e.preventDefault();
        if (!term) return;
        if (showResults && activeIndex >= 0 && suggestions[activeIndex]) {
            return openProduct(suggestions[activeIndex]);
        }
        setShowResults(false);
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setShowResults(false);
        setActiveIndex(-1);
    };

    // arrow keys move through the suggestions, Escape closes the dropdown
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowResults(false);
            setActiveIndex(-1);
            return;
        }
        if (!suggestions.length || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
        e.preventDefault();
        setShowResults(true);
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(prev => (prev + step + suggestions.length) % suggestions.length);
    };

    return (
        <div className='search' ref={boxRef}>
            <form className='search__form' onSubmit={goToResults}>
                <input
                    type='search'
                    className='search__input'
                    placeholder='Search for products, brands and more'
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); setActiveIndex(-1); }}
                    onFocus={() => setShowResults(true)}
                    onKeyDown={handleKeyDown}
                    role='combobox'
                    aria-expanded={Boolean(showResults && term)}
                    aria-controls='search-suggestions'
                    aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
                />
                <button type='submit' className='search__button' aria-label='Search'>
                    <AiOutlineSearch />
                </button>
            </form>

            {showResults && term && (
                <div className='search__results' id='search-suggestions' role='listbox'>
                    {results.length === 0 ? (
                        <p className='search__empty'>No products found for "{searchTerm}"</p>
                    ) : (
                        <>
                            {suggestions.map((product, index) => (
                                <Link
                                    key={product._id}
                                    id={`search-option-${index}`}
                                    role='option'
                                    aria-selected={index === activeIndex}
                                    to={`/Detail/type/${product.type}/${product._id}`}
                                    className={`search__item ${index === activeIndex ? 'search__item--active' : ''}`}
                                    onClick={clearSearch}
                                    onMouseEnter={() => setActiveIndex(index)}
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
