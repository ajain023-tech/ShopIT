import { Container } from '@mui/system'
import CartCard from '../../Components/Card/CartCard/CartCard'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import { useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import { EmptyCart } from '../../Assets/Images/Image';
import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'
import useWishlist from '../../Hooks/useWishlist'
import './Wishlist.css'

const Wishlist = () => {
    const { wishlistData } = useContext(ContextFunction)
    const { refreshWishlist, removeFromWishlist: removeWishlistItem, wishlistLoading } = useWishlist()
    const [openAlert, setOpenAlert] = useState(false);

    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    let navigate = useNavigate()
    useEffect(() => {
        if (setProceed) {
            refreshWishlist().catch((error) => {
                toast.error(error.message, { autoClose: 700, theme: 'colored' })
            })
        }
        else {
            setOpenAlert(true)
        }
    }, [refreshWishlist, setProceed])

    const removeWishlistProduct = async (product) => {
        if (setProceed) {
            try {
                await removeWishlistItem(product)
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                toast.error(error.message, { autoClose: 700, theme: 'colored' })
            }
        }
    }
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };

    return (
        <>
            <Typography variant='h3' sx={{ textAlign: 'center', margin: "10px 0 ", color: '#1976d2', fontWeight: 'bold' }}>Wishlist</Typography>
            {setProceed && wishlistLoading &&
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
                    <CircularProgress />
                </Box>
            }
            {setProceed && !wishlistLoading && (
                wishlistData.length <= 0 ?
                (<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="main-card">
                        <img src={EmptyCart} alt="Empty_cart" className="empty-cart-img" />
                        <Typography variant='h6' sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>No products in wishlist</Typography>
                    </div>
                </Box>)
                : (<Container maxWidth='xl' style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20 }}>
                    {wishlistData.map(product => (
                        <CartCard product={product} removeFromCart={removeWishlistProduct} key={product._id} />
                    ))}
                </Container>)

            )}

            <Dialog open={openAlert}
                keepMounted
                onClose={handleClose}
                TransitionComponent={Transition}

                aria-describedby="alert-dialog-slide-description">
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'> Please Login To Proceed</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' onClick={handleToLogin} endIcon={<AiOutlineLogin />} color='primary'>Login</Button>
                    <Button variant='contained' color='error' endIcon={<AiFillCloseCircle />} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default Wishlist
