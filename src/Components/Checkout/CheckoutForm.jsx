import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material'
import styles from './Chekout.module.css'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { MdUpdate } from 'react-icons/md'
import axios from 'axios'
import { ContextFunction } from '../../Context/Context'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CopyRight from '../CopyRight/CopyRight'
import { Transition, handleClose } from '../../Constants/Constant'
import { AiFillCloseCircle, AiOutlineSave } from 'react-icons/ai'

const CheckoutForm = () => {
    const { setCart } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userEmail: '',
        address: '',
        zipCode: '',
        city: '',
        userState: '',
    })

    const navigate = useNavigate()
    const authToken = localStorage.getItem('Authorization')
    const setProceed = Boolean(authToken)

    useEffect(() => {
        window.scroll(0, 0)
        if (setProceed) {
            getUserData()
        } else {
            navigate('/')
        }
    }, [])

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_USER_DETAILS}`, {
                headers: { 'Authorization': authToken }
            })
            if (!data) return
            setUserDetails({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                userEmail: data.email || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                zipCode: data.zipCode || '',
                city: data.city || '',
                userState: data.userState || '',
            })
            if (!data.address || !data.city || !data.zipCode || !data.userState) {
                setOpenAlert(true)
            }
        } catch (error) {
            console.log('getUserData error:', error)
        }
    }

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const checkOutHandler = async (e) => {
        e.preventDefault()
        const { firstName, lastName, userEmail, phoneNumber, address, zipCode, city, userState } = userDetails
        if (!firstName || !lastName || !userEmail || !phoneNumber || !address || !zipCode || !city || !userState) {
            toast.error("Please fill all fields", { autoClose: 1500, theme: "colored" })
            return
        }
        try {
            setPlacingOrder(true)
            const { data } = await axios.post(`${process.env.REACT_APP_PLACE_ORDER}`, { userDetails }, {
                headers: { 'Authorization': authToken }
            })
            setCart([])
            sessionStorage.removeItem('totalAmount')
            navigate(`/ordersuccess?order=${data._id}`)
        } catch (error) {
            toast.error(error.response?.data || "Could not place order", { autoClose: 1500, theme: "colored" })
        } finally {
            setPlacingOrder(false)
        }
    }

    return (
        <>
            <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 10 }}>
                <Typography variant='h6' sx={{ margin: '20px 0' }}>Checkout</Typography>

                <form noValidate autoComplete="off" className={styles.checkout_form} onSubmit={checkOutHandler}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="First Name" name='firstName' value={userDetails.firstName} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Last Name" name='lastName' value={userDetails.lastName} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Contact Number" type='tel' name='phoneNumber' value={userDetails.phoneNumber} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Email" name='userEmail' value={userDetails.userEmail} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" name='address' value={userDetails.address} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="City" name='city' value={userDetails.city} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField type='tel' label="Postal/Zip Code" name='zipCode' value={userDetails.zipCode} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Province/State" name='userState' value={userDetails.userState} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 5 }}>
                        <Link to='/update'>
                            <Button variant='contained' endIcon={<MdUpdate />}>Update</Button>
                        </Link>
                        <Button variant='contained' endIcon={<BsFillCartCheckFill />} type='submit' disabled={placingOrder}>
                            {placingOrder ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </Container>
                </form>

                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => handleClose(setOpenAlert)}
                    aria-describedby="checkout-alert-dialog"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h6'>Please add your address details before checkout.</Typography>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Link to='/update'>
                            <Button variant='contained' endIcon={<AiOutlineSave />} color='primary'>Add Address</Button>
                        </Link>
                        <Button variant='contained' color='error' endIcon={<AiFillCloseCircle />} onClick={() => handleClose(setOpenAlert)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default CheckoutForm