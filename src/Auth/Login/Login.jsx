import './login.css'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdLockOutline } from 'react-icons/md'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import axios from 'axios';

import CopyRight from '../../Components/CopyRight/CopyRight'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    let auth = localStorage.getItem('Authorization');
    if (auth && !auth.startsWith('mock.')) {
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
        toast.success("Login Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
      } catch (error) {
        toast.error(error.response?.data?.error || "Invalid email or password.", { autoClose: 1500, theme: 'colored' })
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
          <MdLockOutline />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/register" variant="body2" >
                Don't have an account?<span style={{ color: '#1976d2' }}> Sign Up</span>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CopyRight sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}

export default Login
