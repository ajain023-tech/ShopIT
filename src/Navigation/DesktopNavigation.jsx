import './Desktop.css'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { FiLogOut, FiPackage } from 'react-icons/fi'
import { FaShoppingBag } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Badge, Button, Dialog, DialogActions, DialogContent, Tooltip, Typography } from '@mui/material'
import { ContextFunction } from '../Context/Context'
import { toast } from 'react-toastify'
import { getCart, getWishList, handleLogOut, handleClickOpen, handleClose, Transition } from '../Constants/Constant'
import OfferStrip from './OfferStrip'
import SearchBar from '../Components/SearchBar/SearchBar'
import NotificationBell from '../Components/Notifications/NotificationBell'

export const categoryLinks = [
  { label: 'All Products', to: '/products' },
  { label: 'Clothing', to: '/product/type/cloths' },
  { label: 'Shoes', to: '/product/type/shoe' },
  { label: 'Electronics', to: '/product/type/electronics' },
  { label: 'Books', to: '/product/type/book' },
  { label: 'Jewellery', to: '/product/type/jewelry' },
]

const DesktopNavigation = () => {
  const { cart, setCart, wishlistData, setWishlistData, darkMode, setDarkMode, compareList, setBudget } = useContext(ContextFunction)
  const [openAlert, setOpenAlert] = useState(false)
  const navigate = useNavigate()
  const authToken = localStorage.getItem('Authorization')
  const setProceed = authToken !== null

  useEffect(() => {
    getCart(setProceed, setCart, authToken)
    getWishList(setProceed, setWishlistData, authToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDarkModeToggle = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', next)
  }

  const cartCount = setProceed ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0

  return (
    <>
      <header className='header'>
        <OfferStrip />

        <nav className='nav' aria-label='Main'>
          <Link to='/' className='logo' aria-label='ShopIt home'>
            <FaShoppingBag className='logo__icon' aria-hidden='true' />
            <span>ShopIt</span>
          </Link>

          <div className='nav__search'>
            <SearchBar />
          </div>

          <div className='nav__actions'>
            <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
              <button className='nav__action nav__theme' onClick={handleDarkModeToggle} aria-label='Toggle dark mode'>
                {darkMode ? <MdLightMode /> : <MdDarkMode />}
              </button>
            </Tooltip>

            <NotificationBell />

            {setProceed ? (
              <>
                <NavLink to='/update' className='nav__action'>
                  <CgProfile />
                  <span>Profile</span>
                </NavLink>
                <NavLink to='/orders' className='nav__action'>
                  <FiPackage />
                  <span>Orders</span>
                </NavLink>
              </>
            ) : (
              <NavLink to='/login' className='nav__action'>
                <CgProfile />
                <span>Login</span>
              </NavLink>
            )}

            <NavLink to='/wishlist' className='nav__action' aria-label={`Wishlist, ${setProceed ? wishlistData.length : 0} items`}>
              <Badge badgeContent={setProceed ? wishlistData.length : 0} color='secondary' aria-hidden='true'>
                <AiOutlineHeart />
              </Badge>
              <span>Wishlist</span>
            </NavLink>

            <NavLink to='/cart' className='nav__action' aria-label={`Cart, ${cartCount} items`}>
              <Badge badgeContent={cartCount} color='secondary' aria-hidden='true'>
                <AiOutlineShoppingCart />
              </Badge>
              <span>Cart</span>
            </NavLink>

            {setProceed && (
              <button className='nav__action' onClick={() => handleClickOpen(setOpenAlert)}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            )}
          </div>
        </nav>

        <nav className='category-bar' aria-label='Categories'>
          {categoryLinks.map(link => (
            <NavLink key={link.to} to={link.to} end className='category-bar__link'>
              {link.label}
            </NavLink>
          ))}
          <NavLink to='/compare' className='category-bar__link category-bar__compare'>
            Compare{compareList.length > 0 ? ` (${compareList.length})` : ''}
          </NavLink>
        </nav>
      </header>

      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(setOpenAlert)}
      >
        <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
          <Typography variant='h6'>Do you want to logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', pb: 2 }}>
          <Button variant='contained' endIcon={<FiLogOut />} onClick={() => { handleLogOut(setProceed, toast, navigate, setOpenAlert); setCart([]); setWishlistData([]); setBudget(0) }}>Logout</Button>
          <Button variant='outlined' color='error' endIcon={<AiFillCloseCircle />} onClick={() => handleClose(setOpenAlert)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DesktopNavigation
