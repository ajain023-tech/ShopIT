# ShopIt — Simple Shopping Website

ShopIt is a simple online shopping website built with the MERN stack (MongoDB, Express, React, Node.js).
Users can browse products by category, search, view product details, add items to their cart or wishlist,
place an order and see their previous orders.

## Team

| Member | Module |
|---|---|
| Anushka Jain | Module 1 — App Layout, Navigation & Info Pages |
| Yug Thakral | Module 2 — Product Browsing |
| Krishnika Goyal | Module 3 — User Accounts & Server |
| Naina | Module 4 — Cart, Wishlist & Orders |

## Features

- Home page with banner, carousel and product categories
- Category pages with sorting / filtering, and a search bar
- Product detail page with similar products
- Register, login, update profile, change password and delete account
- Add to cart, remove from cart, wishlist
- Checkout with shipping address, order confirmation and previous orders
- Responsive layout (desktop + mobile navigation) and dark mode

## Modules

### Module 1 — App Layout, Navigation & Info Pages (Anushka)
Frontend only.
- `src/App.js` (page routing), `src/index.js`, global styles
- `src/Navigation/` — desktop and mobile navigation bars
- `src/Components/Footer`, `CopyRight`, `loading`
- `src/Pages/About`, `src/Pages/Contact`
- `src/Assets/`, `public/`

### Module 2 — Product Browsing (Yug)
Frontend only.
- `src/Pages/Home/` — home page
- `src/Components/Carousel`, `Category_Card`, `Card/Product Card`, `src/Helpers/`
- `src/SingleCategory/` — category page with filters
- `src/Components/SearchBar/`
- `src/Pages/Detail/` — product detail page

### Module 3 — User Accounts & Server (Krishnika)
- Backend: `backend/index.js`, `backend/config.js`, `backend/middleware/`, `backend/models/User.js`,
  `backend/routes/auth.js`, `backend/controller/deleteUser.js`, product API (`backend/models/Product.js`,
  `backend/routes/product.js`, `backend/seed.js`)
- Frontend: `src/Auth/Login`, `src/Auth/Register`, `src/Pages/Update_User`

### Module 4 — Cart, Wishlist & Orders (Naina)
- Backend: `backend/models/Cart.js`, `Wishlist.js`, `Order.js`, `backend/routes/cart.js`, `wishlist.js`, `order.js`
- Frontend: `src/Pages/Cart`, `src/Components/Card/CartCard`, `src/Pages/WhisList`, `src/Hooks/`,
  `src/Services/`, `src/Components/Checkout`, `src/Pages/Payment`, `src/Context/`, `src/Constants/`

See [USER_STORIES.md](USER_STORIES.md) for the user stories of each module.

## Tech Stack

- **Frontend:** React 18, React Router, Material UI, Axios, React Toastify
- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt
- **Database:** MongoDB

## Running the project locally

You need **Node.js** (v18 or newer) and **MongoDB** running on `localhost:27017`.

```bash
# 1. clone
git clone https://github.com/ajain023-tech/E-Commerce-Storefront.git
cd E-Commerce-Storefront

# 2. backend
cd backend
cp .env.example .env        # then set JWT_SECRET to any long random text
npm install
node seed.js                # loads the sample products into MongoDB
node index.js               # API runs on http://localhost:5001

# 3. frontend (in a new terminal, from the project root)
cp .env.example .env
npm install
npm start                   # website opens on http://localhost:3000
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a token |
| GET | `/api/auth/getuser` | Logged in user's details |
| PUT | `/api/auth/updateuser` | Update profile / address |
| POST | `/api/auth/changepassword` | Change password |
| DELETE | `/api/auth/delete/user` | Delete account and its data |
| GET | `/api/product/fetchproduct` | All products |
| GET | `/api/product/fetchproduct/:id` | One product |
| POST | `/api/product/fetchproduct/type` | Products of a category |
| POST | `/api/product/fetchproduct/category` | Category products with a filter |
| GET / POST / DELETE | `/api/cart/...` | Fetch, add, remove cart items |
| GET / POST / DELETE | `/api/wishlist/...` | Fetch, add, remove wishlist items |
| POST | `/api/order/placeorder` | Place an order from the cart |
| GET | `/api/order/getPreviousOrders` | User's previous orders |
