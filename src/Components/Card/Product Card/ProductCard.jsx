import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart, AiFillStar } from 'react-icons/ai';
import { MdAddShoppingCart } from 'react-icons/md';
import { toast } from 'react-toastify';
import useWishlist from '../../../Hooks/useWishlist';
import { ContextFunction } from '../../../Context/Context';
import { addToCart } from '../../../Constants/Constant';
import useCompare from '../../../Hooks/useCompare';
import { formatPrice, getDiscountPercent, getOriginalPrice } from '../../../Helpers/price';
import { getLoginPath } from '../../../Helpers/redirect';
import styles from './ProductCard.module.css';

export default function ProductCard({ prod, showWishlistAction = true, showCartAction = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCart } = useContext(ContextFunction);
    const [adding, setAdding] = useState(false);
    const { isInCompare, toggleCompare } = useCompare();
    const {
        addToWishlist,
        removeFromWishlist,
        getWishlistItemByProductId,
        isAuthenticated,
        isInWishlist,
        wishlistLoading,
        authToken
    } = useWishlist();

    if (!prod) return null;

    const productInWishlist = isInWishlist(prod._id);
    const detailPath = `/Detail/type/${prod.type}/${prod._id}`;
    const discount = getDiscountPercent(prod);
    const originalPrice = getOriginalPrice(prod);

    const askToLogin = (message) => {
        toast.info(message, { autoClose: 900, theme: 'colored' });
        navigate(getLoginPath(location));
    };

    const handleWishlistClick = async () => {
        if (!isAuthenticated) return askToLogin('Please login to use your wishlist');
        try {
            if (productInWishlist) {
                await removeFromWishlist(getWishlistItemByProductId(prod._id));
                toast.success('Removed from wishlist', { autoClose: 500, theme: 'colored' });
                return;
            }
            const result = await addToWishlist(prod);
            toast[result.duplicate ? 'info' : 'success'](
                result.duplicate ? 'Already in wishlist' : 'Added to wishlist',
                { autoClose: 500, theme: 'colored' });
        } catch (error) {
            toast.error(error.message, { autoClose: 700, theme: 'colored' });
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) return askToLogin('Please login to add items to your cart');
        try {
            setAdding(true);
            await addToCart(prod._id, 1, authToken, setCart);
            toast.success('Added to cart', { autoClose: 500, theme: 'colored' });
        } catch (error) {
            toast.info(error.response?.data?.msg || 'Could not add to cart', { autoClose: 800, theme: 'colored' });
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageBox}>
                <Link to={detailPath}>
                    <img
                        alt={prod.name}
                        src={prod.image}
                        loading="lazy"
                        className={styles.image}
                        // if the picture fails to load, show the grey box instead of a broken image
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                    />
                </Link>

                {discount > 0 && <span className={styles.badge}>{discount}% OFF</span>}

                {showWishlistAction && (
                    <button
                        className={`${styles.wishlist} ${productInWishlist ? styles.wishlistActive : ''}`}
                        onClick={handleWishlistClick}
                        disabled={wishlistLoading}
                        aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {productInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                )}

                {showCartAction && (
                    <button className={styles.addToCart} onClick={handleAddToCart} disabled={adding}>
                        <MdAddShoppingCart /> {adding ? 'Adding...' : 'Add to Cart'}
                    </button>
                )}
            </div>

            <Link to={detailPath} className={styles.info}>
                <p className={styles.brand}>{prod.brand || prod.author || prod.type}</p>
                <p className={styles.name}>{prod.name}</p>
                <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(prod.price)}</span>
                    {discount > 0 && <span className={styles.mrp}>{formatPrice(originalPrice)}</span>}
                    {discount > 0 && <span className={styles.off}>{discount}% off</span>}
                </div>
                {prod.rating > 0 && (
                    <span className={styles.rating}>
                        {prod.rating.toFixed(1)} <AiFillStar />
                    </span>
                )}
            </Link>

            {showCartAction && (
                <label className={styles.compare}>
                    <input type="checkbox" checked={isInCompare(prod._id)} onChange={() => toggleCompare(prod)} />
                    Compare
                </label>
            )}
        </div>
    );
}
