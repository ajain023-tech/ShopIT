import { Card, CardActions, IconButton, Rating, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'react-toastify';
import useWishlist from '../../../Hooks/useWishlist';
import styles from './ProductCard.module.css';

export default function ProductCard({ prod, showWishlistAction = true }) {
    const navigate = useNavigate();
    const {
        addToWishlist,
        removeFromWishlist,
        getWishlistItemByProductId,
        isAuthenticated,
        isInWishlist,
        wishlistLoading
    } = useWishlist();

    const productInWishlist = isInWishlist(prod?._id);
    const detailPath = `/Detail/type/${prod?.type}/${prod?._id}`;

    // Deterministic discount: same product always shows same %
    const discount = (prod.price % 4 + 1) * 10; // 10, 20, 30, or 40
    const originalPrice = Math.round(prod.price / (1 - discount / 100));
    const discountedPrice = prod.price;

    const handleWishlistClick = async () => {
        if (!isAuthenticated) {
            toast.info("Please login to manage wishlist", { autoClose: 700, theme: 'colored' });
            navigate('/login');
            return;
        }

        try {
            if (productInWishlist) {
                const wishlistItem = getWishlistItemByProductId(prod._id);
                await removeFromWishlist(wishlistItem);
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' });
                return;
            }

            const result = await addToWishlist(prod);
            if (result.duplicate) {
                toast.info("Already in Wishlist", { autoClose: 500, theme: 'colored' });
            } else {
                toast.success("Added To Wishlist", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            toast.error(error.message, { autoClose: 700, theme: 'colored' });
        }
    };

    return (
        <Card className={styles.main_card}>
            {/* Image section with overlay & badge */}
            <Link to={detailPath} className={styles.image_link}>
                <Box className={styles.cart_box}>
                    {/* SALE badge */}
                    <span className={styles.sale_badge}>{discount}% OFF</span>

                    <img
                        alt={prod.name}
                        src={prod.image}
                        loading="lazy"
                        className={styles.cart_img}
                    />

                    {/* Hover overlay */}
                    <div className={styles.img_overlay}>
                        <span className={styles.overlay_text}>View Details</span>
                    </div>
                </Box>
            </Link>

            {/* Product name */}
            <Box className={styles.card_content}>
                <Typography
                    variant="h6"
                    sx={{ textAlign: 'center', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 }}
                >
                    {prod.name.length > 22 ? prod.name.slice(0, 22) + '…' : prod.name}
                </Typography>
            </Box>

            {/* Price + Rating + Wishlist */}
            <CardActions className={styles.card_actions}>
                {/* Price block */}
                <Box className={styles.price_block}>
                    <Typography variant="body2" className={styles.original_price}>
                        ₹{originalPrice}
                    </Typography>
                    <Typography variant="h6" className={styles.discounted_price}>
                        ₹{discountedPrice}
                    </Typography>
                </Box>

                {/* Rating */}
                <Rating
                    precision={0.5}
                    name="read-only"
                    value={prod.rating}
                    readOnly
                    size="small"
                />

                {/* Wishlist */}
                {showWishlistAction && (
                    <Tooltip title={productInWishlist ? 'Remove From Wishlist' : 'Add To Wishlist'}>
                        <span>
                            <IconButton
                                aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                color={productInWishlist ? 'error' : 'primary'}
                                disabled={wishlistLoading}
                                onClick={handleWishlistClick}
                                className={styles.wishlist_btn}
                            >
                                {productInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
            </CardActions>
        </Card>
    );
}
