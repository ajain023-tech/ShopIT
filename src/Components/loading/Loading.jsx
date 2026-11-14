import { Skeleton } from '@mui/material'
import { Stack } from '@mui/system'

// grey placeholder with the same shape as a product card, shown while products load
const Loading = () => {
    return (
        <Stack spacing={1} sx={{ width: '100%', p: 1.5, bgcolor: 'background.paper', borderRadius: 3 }}>
            <Skeleton variant="rounded" width="100%" height={220} />
            <Skeleton variant="text" width="40%" height={18} />
            <Skeleton variant="text" width="90%" height={22} />
            <Skeleton variant="text" width="60%" height={26} />
        </Stack>
    )
}

export default Loading
