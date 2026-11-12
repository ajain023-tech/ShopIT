import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Grid, InputAdornment, LinearProgress, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { toast } from 'react-toastify'
import AuthLayout from '../AuthLayout'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import axios from 'axios';

// 0-4: +1 for length >= 8, a number, an uppercase letter and a symbol
const getStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return strength
}

const getStrengthInfo = (strength) => {
  if (strength <= 1) return { label: 'Weak', color: 'error' }
  if (strength === 2) return { label: 'Medium', color: 'warning' }
  return { label: 'Strong', color: 'success' }
}

const Register = () => {

  const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" })
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
    if (auth) {
      navigate("/")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!credentials.email && !credentials.firstName && !credentials.password && !credentials.phoneNumber && !credentials.lastName) {
      toast.error("All fields are required", { autoClose: 500, theme: 'colored' })
    } else if (credentials.firstName.length < 1 || credentials.lastName.length < 1) {
      toast.error("Please enter valid name", { autoClose: 500, theme: 'colored' })
    } else if (emailRegex.test(credentials.email) === false) {
      toast.error("Please enter valid email", { autoClose: 500, theme: 'colored' })
    } else if (phoneRegex.test(credentials.phoneNumber) === false) {
      toast.error("Please enter a valid phone number", { autoClose: 500, theme: 'colored' })
    } else if (credentials.password.length < 5) {
      toast.error("Please enter password with more than 5 characters", { autoClose: 500, theme: 'colored' })
    } else {
      try {
        const { data } = await axios.post(process.env.REACT_APP_REGISTER, credentials);
        localStorage.setItem('Authorization', data.authToken);
        localStorage.setItem('shopIt_user', JSON.stringify(credentials));
        toast.success("Registered Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
      } catch (error) {
        toast.error(error.response?.data?.error || "Unable to register. Please try again.", { autoClose: 1500, theme: 'colored' })
      }
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="It only takes a minute">
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={credentials.firstName}
                  onChange={handleOnChange}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={credentials.lastName}
                  onChange={handleOnChange}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={credentials.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  value={credentials.phoneNumber}
                  onChange={handleOnChange}
                  inputMode='numeric'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                      </InputAdornment>
                    )
                  }}
                  value={credentials.password}
                  onChange={handleOnChange}
                  autoComplete="new-password"
                />
                {credentials.password && (() => {
                  const strength = getStrength(credentials.password)
                  const { label, color } = getStrengthInfo(strength)
                  return (
                    <div className="password-strength">
                      <LinearProgress variant="determinate" value={strength * 25} color={color} className="password-strength__bar" />
                      <span className={`password-strength__label password-strength__label--${color}`}>
                        Password strength: {label}
                      </span>
                    </div>
                  )
                })()}
              </Grid>
</Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Create Account
            </Button>
            <p className="auth__switch">
              Already have an account? <Link to='/login'>Login</Link>
            </p>
          </Box>
    </AuthLayout>
  )
}

export default Register
