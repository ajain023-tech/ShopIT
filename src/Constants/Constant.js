import { Slide } from "@mui/material";
import axios from "axios";
import { forwardRef } from "react";
import { fetchWishlist } from "../Services/WishlistService";
const getCart = async (setProceed, setCart, authToken) => {
    if (setProceed) {
        const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`,
            {
                headers: {
                    'Authorization': authToken
                }
            })
        setCart(data);
    }
}
const getWishList = async (setProceed, setWishlistData, authToken) => {
    if (setProceed) {
        const data = await fetchWishlist(authToken);
        setWishlistData(data)
    }
}
// free delivery on orders of ₹999 or more, otherwise ₹99 (same rule as the backend)
const FREE_SHIPPING_ABOVE = 999
const SHIPPING_CHARGE = 99
const getShippingCharge = (itemsTotal) => (itemsTotal === 0 || itemsTotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE)

// coupon SAVE10: 10% off the items, at most ₹500 (same rule as the backend)
const COUPON_CODE = 'SAVE10'
const COUPON_PERCENT = 10
const COUPON_MAX_DISCOUNT = 500
const isValidCoupon = (code) => String(code || '').trim().toUpperCase() === COUPON_CODE
const getCouponDiscount = (itemsTotal, coupon) =>
    isValidCoupon(coupon) ? Math.min(Math.round(itemsTotal * COUPON_PERCENT / 100), COUPON_MAX_DISCOUNT) : 0

// totals for a list of cart items
const getCartTotals = (cartItems, coupon = '') => {
    const items = cartItems.filter(item => item.productId)
    const itemsTotal = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
    const mrpTotal = items.reduce((sum, item) =>
        sum + Math.max(item.productId.originalPrice || 0, item.productId.price) * item.quantity, 0)
    const shipping = getShippingCharge(itemsTotal)
    const couponDiscount = getCouponDiscount(itemsTotal, coupon)
    return {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        itemsTotal,
        mrpTotal,
        savings: mrpTotal - itemsTotal,
        shipping,
        couponDiscount,
        total: itemsTotal + shipping - couponDiscount,
    }
}

// add a product to the cart and refresh the cart in context
const addToCart = async (productId, quantity, authToken, setCart) => {
    await axios.post(`${process.env.REACT_APP_ADD_CART}`, { _id: productId, quantity }, {
        headers: { 'Authorization': authToken }
    })
    const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
        headers: { 'Authorization': authToken }
    })
    setCart(data)
}

const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
    if (setProceed) {
        localStorage.removeItem('Authorization')
        localStorage.removeItem('shopIt_user')
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
        setOpenAlert(false)
    }
    else {
        toast.error("User is already logged of", { autoClose: 500, theme: 'colored' })
    }
}

const handleClickOpen = (setOpenAlert) => {
    setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
    setOpenAlert(false);
};
const getAllProducts = async (setData) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_FETCH_PRODUCT);
        setData(data)


    } catch (error) {
        console.log(error);
    }
}

const getSingleProduct = async (setProduct, id, setLoading) => {

    const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`)
    setProduct(data)
    setLoading(false);

}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});





export {
    getCart, getWishList, handleClickOpen, handleClose, handleLogOut, getAllProducts, getSingleProduct, Transition,
    FREE_SHIPPING_ABOVE, getShippingCharge, getCartTotals, addToCart,
    COUPON_CODE, isValidCoupon
}
