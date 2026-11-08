import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, InputAdornment, Tab, Tabs, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage } from 'react-icons/fi'
import styles from './Update.module.css'
import { toast } from 'react-toastify'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

import { Transition } from '../../Constants/Constant'


const UpdateDetails = () => {
    const [userData, setUserData] = useState([])
    const [openAlert, setOpenAlert] = useState(false);
    const [tab, setTab] = useState(0);
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        zipCode: '',
        city: '',
        userState: '',
    })
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    let navigate = useNavigate()
    useEffect(() => {
        setProceed ? getUserData() : navigate('/')
    }, [])
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_USER_DETAILS}`, {
                headers: {
                    'Authorization': authToken
                }
            })
            userDetails.firstName = data.firstName
            userDetails.lastName = data.lastName
            userDetails.email = data.email
            userDetails.phoneNumber = data.phoneNumber
            userDetails.address = data.address
            userDetails.zipCode = data.zipCode
            userDetails.city = data.city
            userDetails.userState = data.userState
            setUserData(data);

        } catch (error) {
            toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })

        }
    }
    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    let phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // let zipRegex = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/;

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!userDetails.email && !userDetails.firstName && !userDetails.phoneNumber && !userDetails.lastName && !userDetails.address && !userDetails.city && !userDetails.userState && !userDetails.zipCode) {
                toast.error("Please Fill the all Fields", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.firstName.trim() || !userDetails.lastName.trim()) {
                toast.error("Please enter your first and last name", { autoClose: 500, theme: 'colored' })
            }
            else if (!emailRegex.test(userDetails.email)) {
                toast.error("Please enter valid email", { autoClose: 500, theme: 'colored' })
            }
            else if (!phoneRegex.test(userDetails.phoneNumber)) {
                toast.error("Please enter a valid phone number", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.address) {
                toast.error("Please add address", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.city) {
                toast.error("Please add city", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.zipCode) {
                toast.error("Please enter valid Zip code", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.userState) {
                toast.error("Please add state", { autoClose: 500, theme: 'colored' })
            }
            else {
                const { data } = await axios.put(`${process.env.REACT_APP_UPDATE_USER_DETAILS}`, {
                    userDetails: JSON.stringify(userDetails)
                },
                    {
                        headers: {
                            'Authorization': authToken
                        }
                    })
                if (data.success === true) {
                    toast.success("Updated Successfully", { autoClose: 500, theme: 'colored' })
                    getUserData()
                    
                }
                else {
                    toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })
                }
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response?.data || 'Something went wrong', { autoClose: 800, theme: 'colored' })

        }
    }
    const handleResetPassword = async (e) => {
        e.preventDefault()
        try {
            if (!password.currentPassword && !password.newPassword) {
                toast.error("Please Fill the all Fields", { autoClose: 500, theme: 'colored' })
            }
            else if (password.currentPassword.length < 5) {
                toast.error("Please enter valid password", { autoClose: 500, theme: 'colored' })
            }
            else if (password.newPassword.length < 5) {
                toast.error("Please enter password with more than 5 characters", { autoClose: 500, theme: 'colored' })
            }
            else {
                const { data } = await axios.post(`${process.env.REACT_APP_CHANGE_PASSWORD}`, {
                    currentPassword: password.currentPassword,
                    newPassword: password.newPassword,
                }, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                toast.success(data, { autoClose: 500, theme: 'colored' })
                setPassword({ currentPassword: '', newPassword: '' })
            }
        } catch (error) {
            toast.error(error.response?.data || 'Something went wrong', { autoClose: 800, theme: 'colored' })
        }

    }
    const deleteAccount = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_DELETE_USER_DETAILS}`, {
                headers: {
                    'Authorization': authToken
                }
            });
            toast.success("Account deleted successfully", { autoClose: 500, theme: 'colored' })
            localStorage.removeItem('Authorization');
            localStorage.removeItem('shopIt_user');
            sessionStorage.removeItem('totalAmount');
            navigate("/login")
        } catch (error) {
            toast.error(error.response?.data || 'Something went wrong', { autoClose: 800, theme: 'colored' })

        }
    }
    const passwordField = (name, label, visible, toggleVisible) => (
        <TextField
            label={label}
            name={name}
            type={visible ? "text" : "password"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" onClick={toggleVisible} sx={{ cursor: 'pointer' }}>
                        {visible ? <RiEyeFill /> : <RiEyeOffFill />}
                    </InputAdornment>
                )
            }}
            value={password[name] || ''}
            onChange={(e) => setPassword({ ...password, [e.target.name]: e.target.value })}
            fullWidth />
    )

    const profileFields = [
        { name: 'firstName', label: 'First Name', half: true },
        { name: 'lastName', label: 'Last Name', half: true },
        { name: 'phoneNumber', label: 'Phone Number', half: true },
        { name: 'email', label: 'Email', half: true },
        { name: 'address', label: 'Address' },
        { name: 'city', label: 'City', half: true },
        { name: 'zipCode', label: 'PIN Code', half: true },
        { name: 'userState', label: 'State' },
    ]

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <div className={styles.avatar}>{(userDetails.firstName || '?')[0].toUpperCase()}</div>
                <p className={styles.name}>{userDetails.firstName} {userDetails.lastName}</p>
                <p className={styles.email}>{userDetails.email}</p>
                <Tabs
                    orientation='vertical'
                    value={tab}
                    onChange={(e, value) => setTab(value)}
                    sx={{ width: '100%', mt: 2, '& .MuiTab-root': { alignItems: 'flex-start', minHeight: 44 } }}
                >
                    <Tab label='Profile & Address' />
                    <Tab label='Change Password' />
                    <Tab label='Account' />
                </Tabs>
                <Button component={Link} to='/orders' startIcon={<FiPackage />} sx={{ mt: 1, alignSelf: 'flex-start' }}>
                    My Orders
                </Button>
            </aside>

            <section className={styles.panel}>
                {tab === 0 && (
                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <h2 className={styles.heading}>Profile & Address</h2>
                        <p className={styles.hint}>This address is used for delivery at checkout.</p>
                        <Grid container spacing={2}>
                            {profileFields.map(field => (
                                <Grid item xs={12} sm={field.half ? 6 : 12} key={field.name}>
                                    <TextField label={field.label} name={field.name} value={userDetails[field.name] || ''} onChange={handleOnchange} fullWidth />
                                </Grid>
                            ))}
                        </Grid>
                        <div className={styles.actions}>
                            <Button variant='contained' size='large' endIcon={<AiOutlineFileDone />} type='submit'>Save Changes</Button>
                        </div>
                    </form>
                )}

                {tab === 1 && (
                    <form onSubmit={handleResetPassword}>
                        <h2 className={styles.heading}>Change Password</h2>
                        <p className={styles.hint}>Use at least 5 characters.</p>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>{passwordField('currentPassword', 'Current Password', showPassword, handleClickShowPassword)}</Grid>
                            <Grid item xs={12}>{passwordField('newPassword', 'New Password', showNewPassword, () => setShowNewPassword(!showNewPassword))}</Grid>
                        </Grid>
                        <div className={styles.actions}>
                            <Button variant='contained' size='large' endIcon={<RiLockPasswordLine />} type='submit'>Update Password</Button>
                        </div>
                    </form>
                )}

                {tab === 2 && (
                    <div>
                        <h2 className={styles.heading}>Delete Account</h2>
                        <p className={styles.hint}>
                            This permanently deletes your account along with your cart, wishlist and orders. This cannot be undone.
                        </p>
                        <div className={styles.actions}>
                            <Button variant='outlined' color='error' size='large' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete My Account</Button>
                        </div>
                    </div>
                )}
            </section>

            <Dialog
                open={openAlert}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenAlert(false)}
            >
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                    <DialogContentText style={{ textAlign: 'center' }}>
                        Are you sure? All your data will be erased.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', pb: 2 }}>
                    <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteAccount}>Delete</Button>
                    <Button variant='outlined' onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UpdateDetails
