import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

// friendly message for empty pages (empty cart, no search results, no orders ...)
const EmptyState = ({ image, icon, title, message, actionLabel = 'Continue Shopping', actionTo = '/products' }) => {
    return (
        <Box sx={{ textAlign: 'center', py: 6, px: 2, maxWidth: 420, mx: 'auto' }}>
            {image && <img src={image} alt="" style={{ width: 220, maxWidth: '100%', marginBottom: 16 }} />}
            {icon && <Box sx={{ fontSize: 64, color: 'primary.main', mb: 1, lineHeight: 1 }}>{icon}</Box>}
            <Typography variant="h6" fontWeight={700}>{title}</Typography>
            {message && <Typography color="text.secondary" sx={{ mt: 1 }}>{message}</Typography>}
            {actionTo && (
                <Button component={Link} to={actionTo} variant="contained" sx={{ mt: 3, px: 4 }}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    )
}

export default EmptyState
