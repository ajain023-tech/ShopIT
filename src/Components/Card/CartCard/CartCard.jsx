import { Link } from 'react-router-dom'
import { AiOutlineDelete, AiOutlineHeart } from 'react-icons/ai'
import { formatPrice, getDiscountPercent, getOriginalPrice } from '../../../Helpers/price'
import styles from './CartCard.module.css'

const MAX_QUANTITY = 10

// one row in the cart: image, name, price, quantity buttons and actions
const CartCard = ({ item, onQuantityChange, onRemove, onMoveToWishlist, updating }) => {
    const product = item.productId
    if (!product) return null

    const discount = getDiscountPercent(product)
    const detailPath = `/Detail/type/${product.type}/${product._id}`

    return (
        <div className={styles.row}>
            <Link to={detailPath} className={styles.imageBox}>
                <img src={product.image} alt={product.name} className={styles.image} loading='lazy' />
            </Link>

            <div className={styles.details}>
                <p className={styles.brand}>{product.brand || product.type}</p>
                <Link to={detailPath} className={styles.name}>{product.name}</Link>

                <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                    {discount > 0 && <span className={styles.mrp}>{formatPrice(getOriginalPrice(product))}</span>}
                    {discount > 0 && <span className={styles.off}>{discount}% off</span>}
                </div>

                <div className={styles.controls}>
                    <div className={styles.qty}>
                        <button onClick={() => onQuantityChange(item, item.quantity - 1)} disabled={updating || item.quantity <= 1} aria-label='Decrease quantity'>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onQuantityChange(item, item.quantity + 1)} disabled={updating || item.quantity >= MAX_QUANTITY} aria-label='Increase quantity'>+</button>
                    </div>
                    {onMoveToWishlist && (
                        <button className={styles.action} onClick={() => onMoveToWishlist(item)} disabled={updating} aria-label={`Move ${product.name} to wishlist`}>
                            <AiOutlineHeart /> Move to Wishlist
                        </button>
                    )}
                    <button className={`${styles.action} ${styles.remove}`} onClick={() => onRemove(item)} disabled={updating} aria-label={`Remove ${product.name} from cart`}>
                        <AiOutlineDelete /> Remove
                    </button>
                </div>
            </div>

            <div className={styles.lineTotal}>{formatPrice(product.price * item.quantity)}</div>
        </div>
    )
}

export default CartCard
