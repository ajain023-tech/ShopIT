// Checks the main backend routes. Start the backend first, then run: npm test
// Uses a new throw-away user and deletes it at the end.
const BASE = process.env.API_URL || 'http://localhost:5001/api'
const ORIGIN = process.env.TEST_ORIGIN || 'http://localhost:3000'

let failed = 0
let authToken = ''
let productId = ''

const check = (name, ok, detail = '') => {
    if (ok) {
        console.log(`  ✔ ${name}`)
    } else {
        failed++
        console.log(`  ✘ ${name}${detail ? ` (${detail})` : ''}`)
    }
}

// every request sends the Origin header (the API checks it) and the token when we have one
const request = async (method, path, body) => {
    const headers = { Origin: ORIGIN, 'Content-Type': 'application/json' }
    if (authToken) headers.Authorization = authToken
    const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
    const text = await res.text()
    let data = text
    try { data = JSON.parse(text) } catch (error) { /* not JSON */ }
    return { status: res.status, data }
}

const run = async () => {
    const stamp = Date.now()
    const user = {
        firstName: 'Test',
        lastName: 'User',
        email: `apitest${stamp}@example.com`,
        phoneNumber: String(stamp).slice(-10),
        password: 'test12345',
    }
    console.log(`Testing ${BASE}\n`)

    let res = await request('POST', '/auth/register', user)
    check('register a new user', res.status === 200 && res.data.success && res.data.authToken, `status ${res.status}`)

    res = await request('POST', '/auth/login', { email: user.email, password: user.password })
    check('login', res.status === 200 && res.data.success && res.data.authToken, `status ${res.status}`)
    authToken = res.data.authToken || ''

    res = await request('GET', '/auth/getuser')
    check('get logged in user', res.status === 200 && res.data.email === user.email, `status ${res.status}`)

    res = await request('GET', '/product/fetchproduct')
    check('fetch all products', res.status === 200 && Array.isArray(res.data) && res.data.length > 0, `status ${res.status}`)
    productId = Array.isArray(res.data) && res.data[0] ? res.data[0]._id : ''

    res = await request('GET', `/product/fetchproduct/${productId}`)
    check('fetch one product', res.status === 200 && res.data._id === productId, `status ${res.status}`)

    res = await request('GET', '/product/fetchproduct/123')
    check('bad product id returns 400', res.status === 400, `status ${res.status}`)

    res = await request('GET', '/product/fetchproduct/000000000000000000000000')
    check('unknown product id returns 404', res.status === 404, `status ${res.status}`)

    res = await request('PUT', '/auth/updateuser', { userDetails: { budget: 5000 } })
    const after = await request('GET', '/auth/getuser')
    check('update budget', res.status === 200 && after.data.budget === 5000, `status ${res.status}`)

    const savedToken = authToken
    authToken = 'not-a-real-token'
    res = await request('GET', '/auth/getuser')
    check('invalid token returns 401', res.status === 401, `status ${res.status}`)
    authToken = savedToken

    res = await request('DELETE', '/auth/delete/user')
    check('delete the test user', res.status === 200, `status ${res.status}`)

    console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
    process.exit(failed ? 1 : 0)
}

run().catch(error => {
    console.log(`  ✘ could not reach the API: ${error.message}`)
    console.log('    Is the backend running? (cd backend && node index.js)')
    process.exit(1)
})
