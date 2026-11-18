import axios from 'axios'
import { toast } from 'react-toastify'

const EXPIRED_KEY = 'shopIt_sessionExpired'

// the server answers 401 when the login token is missing, invalid or older than 7 days:
// log the user out and send them to the login page (once, even if several requests fail)
let redirecting = false

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const hadToken = Boolean(localStorage.getItem('Authorization'))
        if (error.response?.status === 401 && hadToken && !redirecting) {
            redirecting = true
            localStorage.removeItem('Authorization')
            localStorage.removeItem('shopIt_user')
            try {
                sessionStorage.setItem(EXPIRED_KEY, 'true')
            } catch (storageError) {
                // storage not available, the message just won't show
            }
            toast.info('Your session has expired, please login again', { autoClose: 1500, theme: 'colored' })
            const { pathname, search } = window.location
            const redirect = pathname.startsWith('/login') ? '' : `?redirect=${encodeURIComponent(pathname + search)}`
            window.location.assign(`/login${redirect}`)
        }
        return Promise.reject(error)
    }
)

// after the reload, show the message on the login page
try {
    if (sessionStorage.getItem(EXPIRED_KEY)) {
        sessionStorage.removeItem(EXPIRED_KEY)
        setTimeout(() => toast.info('Your session has expired, please login again', { autoClose: 2000, theme: 'colored' }), 300)
    }
} catch (error) {
    // storage not available
}
