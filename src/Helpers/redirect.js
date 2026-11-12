// link to the login page that brings the user back to the current page afterwards
export const getLoginPath = (location) =>
    `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`

// only allow paths inside this website (never redirect to another website)
export const getSafeRedirect = (value) => {
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/'
    return value
}
