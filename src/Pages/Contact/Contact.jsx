import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';
import usePageTitle from '../../Hooks/usePageTitle';

// ─── Contact Info Data ────────────────────────────────────────────────────────

const contactInfo = [
  {
    icon: <MdEmail size={28} color='#1976d2' />,
    label: 'Email',
    value: 'support@shopit.com',
    href: 'mailto:support@shopit.com',
  },
  {
    icon: <MdPhone size={28} color='#1976d2' />,
    label: 'Phone',
    value: '+91 12345 67890',
    href: 'tel:+911234567890',
  },
  {
    icon: <MdLocationOn size={28} color='#1976d2' />,
    label: 'Location',
    value: 'Noida, Uttar Pradesh, India',
    href: null,
  },
  {
    icon: <FaGithub size={28} color='#1976d2' />,
    label: 'GitHub',
    value: 'github.com/ajain023-tech/ShopIT',
    href: 'https://github.com/ajain023-tech/ShopIT',
  },
];

// ─── Validation ──────────────────────────────────────────────────────────────

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// returns an object with an error message for every invalid field
const validate = (form) => {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(form.email.trim())) errors.email = 'Please enter a valid email';
  if (form.subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters';
  if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
};

// ─── Component ───────────────────────────────────────────────────────────────

const Contact = () => {
  usePageTitle('Contact Us')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear the error of this field while the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in the form.', { autoClose: 1000, theme: 'colored' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent! We will get back to you soon.', { autoClose: 4000 });
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 1000);
  };

  // shared text field style
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': { borderColor: '#1976d2' },
      '&.Mui-focused fieldset': { borderColor: '#1976d2' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa', pb: 6 }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #312e81 100%)',
          py: { xs: 8, md: 11 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-40%',
            right: '-8%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-35%',
            left: '-6%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h2"
            fontWeight={800}
            color="#fff"
            sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' }, letterSpacing: '-0.5px' }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h6"
            color="rgba(255,255,255,0.8)"
            sx={{ mt: 2, maxWidth: 500, mx: 'auto', fontWeight: 400, lineHeight: 1.7 }}
          >
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </Typography>
        </Container>
      </Box>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ mt: { xs: 5, md: 7 } }}>
        <Grid container spacing={4} alignItems="flex-start">

          {/* ── Left: Contact Info Cards ─────────────────────────────────── */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: '#1a1a2e' }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactInfo.map((info) => (
                <Paper
                  key={info.label}
                  elevation={2}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.22s ease',
                    border: '1px solid transparent',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      borderColor: '#1976d2',
                      boxShadow: '0 6px 24px rgba(25,118,210,0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #e3f0ff, #f0e7ff)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {info.label}
                    </Typography>
                    {info.href ? (
                      <Typography
                        component="a"
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {info.value}
                      </Typography>
                    ) : (
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {info.value}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Decorative gradient block */}
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #312e81 100%)',
                color: '#fff',
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Response Time
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.7 }}>
                We typically respond within 24 hours on business days. Thanks for your patience!
              </Typography>
            </Paper>
          </Grid>

          {/* ── Right: Contact Form ──────────────────────────────────────── */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: '#fff',
                border: '1px solid #e0e7ff',
              }}
            >
              <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: '#1a1a2e' }}>
                Send a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
                Fill in the form below and we'll get back to you as soon as possible.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      error={Boolean(errors.subject)}
                      helperText={errors.subject}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      error={Boolean(errors.message)}
                      helperText={errors.message}
                      sx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      endIcon={<MdSend />}
                      sx={{
                        py: 1.6,
                        borderRadius: 2.5,
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #1976d2 0%, #312e81 100%)',
                        boxShadow: '0 6px 20px rgba(25,118,210,0.35)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #283593 100%)',
                          boxShadow: '0 8px 28px rgba(25,118,210,0.45)',
                        },
                      }}
                    >
                      {loading ? 'Sending…' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
