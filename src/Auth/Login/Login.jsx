import './login.css'
import { Button, InputAdornment, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import axios from 'axios';

import AuthLayout from '../AuthLayout'
import { ContextFunction } from '../../Context/Context'
import { getCart, getWishList } from '../../Constants/Constant'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate()
  const { setCart, setWishlistData } = useContext(ContextFunction)

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    let auth = localStorage.getItem('Authorization');
    if (auth) {
      navigate("/")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!credentials.email && !credentials.password) {
      toast.error("All fields are required", { autoClose: 500, theme: 'colored' })
    } else if (!emailRegex.test(credentials.email)) {
      toast.error("Please enter a valid email", { autoClose: 500, theme: 'colored' })
    } else if (credentials.password.length < 5) {
      toast.error("Please enter valid password", { autoClose: 500, theme: 'colored' })
    } else {
      try {
        const { data } = await axios.post(process.env.REACT_APP_LOGIN, credentials);
        localStorage.setItem('Authorization', data.authToken);
        localStorage.setItem('shopIt_user', JSON.stringify({
          email: credentials.email,
        }));
        // load this user's cart and wishlist so the header counts are right
        getCart(true, setCart, data.authToken).catch(() => {})
        getWishList(true, setWishlistData, data.authToken).catch(() => {})
        toast.success("Login Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
      } catch (error) {
        toast.error(error.response?.data?.error || "Invalid email or password.", { autoClose: 1500, theme: 'colored' })
      }
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Login to see your cart, wishlist and orders">
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={credentials.email}
            name='email'
            onChange={handleOnChange}
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            value={credentials.password}
            name='password'
            onChange={handleOnChange}
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleClickShowPassword} sx={{cursor:'pointer'}}>
                  {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                </InputAdornment>
              )
            }}
            autoComplete="current-password"
          />
<Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <p className="auth__switch">
            New to ShopIt? <Link to="/register">Create an account</Link>
          </p>
        </Box>
    </AuthLayout>
  )
}

export default Login
