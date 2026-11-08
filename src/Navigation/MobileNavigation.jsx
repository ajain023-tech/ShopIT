import './Mobile.css'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineHome, AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle, AiOutlineAppstore } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { FiLogOut } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'
import { Badge, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { ContextFunction } from '../Context/Context'
import { Transition, getCart, getWishList, handleClickOpen, handleClose, handleLogOut } from '../Constants/Constant'

// bottom navigation bar shown on phones
const MobileNavigation = () => {
    const { cart, setCart, wishlistData, setWishlistData, setBudget } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false)
    const navigate = useNavigate()
    const authToken = localStorage.getItem('Authorization')
    const setProceed = authToken !== null

    useEffect(() => {
        getCart(setProceed, setCart, authToken)
        getWishList(setProceed, setWishlistData, authToken)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cartCount = setProceed ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0

    return (
        <div className='showMobile'>
            <nav className='mobile-nav'>
                <NavLink to='/' end className='mobile-nav__link'><AiOutlineHome /><span>Home</span></NavLink>
                <NavLink to='/products' className='mobile-nav__link'><AiOutlineAppstore /><span>Shop</span></NavLink>
                <NavLink to='/cart' className='mobile-nav__link'>
                    <Badge badgeContent={cartCount} color='secondary'><AiOutlineShoppingCart /></Badge>
                    <span>Cart</span>
                </NavLink>
                <NavLink to='/wishlist' className='mobile-nav__link'>
                    <Badge badgeContent={setProceed ? wishlistData.length : 0} color='secondary'><AiOutlineHeart /></Badge>
                    <span>Wishlist</span>
                </NavLink>
                {setProceed ? (
                    <NavLink to='/update' className='mobile-nav__link'><CgProfile /><span>Account</span></NavLink>
                ) : (
                    <NavLink to='/login' className='mobile-nav__link'><CgProfile /><span>Login</span></NavLink>
                )}
                {setProceed && (
                    <button className='mobile-nav__link' onClick={() => handleClickOpen(setOpenAlert)}>
                        <FiLogOut /><span>Logout</span>
                    </button>
                )}
            </nav>

            <Dialog
                open={openAlert}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => handleClose(setOpenAlert)}
            >
                <DialogContent sx={{ width: { xs: 280, md: 350 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h6'>Do you want to logout?</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', pb: 2 }}>
                    <Button variant='contained' endIcon={<FiLogOut />} onClick={() => { handleLogOut(setProceed, toast, navigate, setOpenAlert); setCart([]); setWishlistData([]); setBudget(0) }}>Logout</Button>
                    <Button variant='outlined' color='error' endIcon={<AiFillCloseCircle />} onClick={() => handleClose(setOpenAlert)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MobileNavigation
