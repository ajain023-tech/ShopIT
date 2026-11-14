# ShopIt — Simple Shopping Website

ShopIt is a simple online shopping website built with the MERN stack (MongoDB, Express, React, Node.js).
Users can browse products by category, search, view product details, add items to their cart or wishlist,
place an order and see their previous orders.

## Team

| Member | Module |
|---|---|
| Anushka Jain | Module 1 — App Layout, Navigation & Info Pages |
| Yug Thakral | Module 2 — Product Browsing |
| Krishnika Goyal | Module 3 — User Accounts, Server & Price Comparison |
| Naina | Module 4 — Cart, Wishlist, Orders & Smart Budget |

## Features

### Highlight features
- **Price Comparison** — tick "Compare" on up to 4 products (or use "Compare price with similar products" on a product page). The comparison page puts them side by side and highlights the lowest price, the top rated product and the biggest discount, and shows value for money (rating per ₹1,000).
- **Smart Budget** — set a shopping budget in your cart. A progress bar shows how much of it your cart uses, warns you when you go over, and *Smart Savings* suggests cheaper well-rated (4★+) alternatives you can swap in with one click. Product pages show whether an item fits your budget and the product list has a "Within my budget" filter.

### Everything else
- Store-style header with offer strip, search with live suggestions and category bar
- Home page with banner slider, Shop by Category, Trending Now and Best Deals
- Product listing with filter sidebar (category, type, price, brand, rating), sorting and pagination
- Product page with image zoom, MRP / discount, quantity, Add to Cart, Buy Now and delivery info
- Register / login (split-screen), profile with tabs, change password, delete account
- Cart with quantity controls and price details, wishlist, move to wishlist
- 3-step checkout (Address → Review → Place Order, Cash on Delivery) and My Orders page
- Free delivery on orders of ₹999 or more, otherwise ₹99
- Responsive layout (desktop + mobile navigation) and dark mode

## Modules

### Module 1 — App Layout, Navigation & Info Pages (Anushka)
Frontend only.
- `src/App.js` (page routing), `src/index.js` (theme and font), global styles
- `src/Navigation/` — offer strip, desktop header with category bar, mobile bottom bar
- `src/Components/Footer`, `loading` (skeletons), `EmptyState`
- `src/Pages/About`, `src/Pages/Contact`
- `src/Assets/`, `public/`

### Module 2 — Product Browsing (Yug)
Frontend only.
- `src/Pages/Home/` — home page
- `src/Components/Carousel` (banner slider), `Category_Card`, `Card/Product Card`
- `src/Helpers/` — banner/category data and price helpers
- `src/SingleCategory/` — product listing page with filter sidebar
- `src/Components/SearchBar/` — header search
- `src/Pages/Detail/` — product detail page

### Module 3 — User Accounts, Server & Price Comparison (Krishnika)
- Backend: `backend/index.js`, `backend/config.js`, `backend/middleware/`, `backend/models/User.js`,
  `backend/routes/auth.js`, `backend/controller/deleteUser.js`, product API (`backend/models/Product.js`,
  `backend/routes/product.js`, `backend/seed.js`)
- Frontend: `src/Auth/` (login, register, split-screen layout), `src/Pages/Update_User` (profile tabs)
- Price Comparison: `src/Hooks/useCompare.js`, `src/Components/Compare/` (compare bar), `src/Pages/Compare/` (comparison page)

### Module 4 — Cart, Wishlist, Orders & Smart Budget (Naina)
- Backend: `backend/models/Cart.js`, `Wishlist.js`, `Order.js`, `backend/routes/cart.js`, `wishlist.js`, `order.js`
- Frontend: `src/Pages/Cart`, `src/Components/Card/CartCard`, `src/Pages/WhisList`, `src/Hooks/`,
  `src/Services/`, `src/Components/Checkout`, `src/Pages/Payment`, `src/Pages/Orders`, `src/Context/`, `src/Constants/`
- Smart Budget: `src/Hooks/useBudget.js`, `src/Components/Budget/` (budget card, smart savings), `budget` field on the user

See [USER_STORIES.md](USER_STORIES.md) for the user stories of each module.

## Tech Stack

- **Frontend:** React 18, React Router, Material UI, Axios, React Toastify
- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt
- **Database:** MongoDB

## Running the project locally

You need **Node.js** (v18 or newer) and **MongoDB** running on `localhost:27017`.

```bash
# 1. clone
git clone https://github.com/ajain023-tech/ShopIT.git
cd ShopIT

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
| PUT | `/api/auth/updateuser` | Update profile / address / budget |
| POST | `/api/auth/changepassword` | Change password |
| DELETE | `/api/auth/delete/user` | Delete account and its data |
| GET | `/api/product/fetchproduct` | All products |
| GET | `/api/product/fetchproduct/:id` | One product |
| POST | `/api/product/fetchproduct/type` | Products of a category |
| POST | `/api/product/fetchproduct/category` | Category products with a filter |
| GET / POST / DELETE | `/api/cart/...` | Fetch, add, remove cart items |
| PUT | `/api/cart/updatecart/:id` | Change quantity of a cart item |
| GET / POST / DELETE | `/api/wishlist/...` | Fetch, add, remove wishlist items |
| POST | `/api/order/placeorder` | Place an order from the cart |
| GET | `/api/order/getPreviousOrders` | User's previous orders |
