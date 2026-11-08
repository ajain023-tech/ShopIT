# ShopIt — Daily Tasks (9 Nov – 15 Nov 2026)

28 small tasks: **one task per person per day** for 7 days.
Each task is new work. None of these features exist in the project yet.

| Person | Module | Area |
|---|---|---|
| Anushka Jain | Module 1 | Layout, navigation, info pages (frontend only) |
| Yug Thakral | Module 2 | Product browsing: home, listing, search, product page (frontend only) |
| Krishnika Goyal | Module 3 | Accounts, server, Price Comparison |
| Naina | Module 4 | Cart, wishlist, checkout, orders, Smart Budget |

---

## Part A — Read this first (context for you or your AI tool)

### Tech stack
- **Frontend:** React 18 (Create React App), React Router v6, Material UI v5, axios, react-toastify, react-icons. Runs on `http://localhost:3000`.
- **Backend:** Node.js + Express + Mongoose (MongoDB). Runs on `http://localhost:5001`. All routes start with `/api`.
- **Database:** MongoDB on `mongodb://127.0.0.1:27017/shopit`. Sample products come from `backend/seed.js`.

### Running the project
```bash
# terminal 1 – backend
cd backend
node index.js

# terminal 2 – frontend (project root)
npm start
```
If MongoDB is not running, start it first (see README).
**After changing any `.env` file you must stop and restart `npm start`.**

### Daily routine for every task
```bash
git pull                      # get everyone's latest work
# ... do the task ...
# test it in the browser (open DevTools → Console: there must be no red errors)
git add <only the files of your task>
git commit -m "<message given in the task>"
git push
```

### Project conventions (follow these so the code matches the rest of the project)
- **API URLs** are never hard-coded in components. Add a `REACT_APP_...` line to **both** `.env` and `.env.example` in the project root, then use `process.env.REACT_APP_...`.
- **Logged-in requests** send the token like this:
  ```js
  const authToken = localStorage.getItem('Authorization')
  axios.get(url, { headers: { 'Authorization': authToken } })
  ```
- **Backend auth:** protected routes use the middleware `authUser` (`backend/middleware/authUser.js`), which puts the user id in `req.user.id`. Always filter by `req.user.id` so users can only touch their own data.
- **Messages to the user:** `toast.success('...', { autoClose: 800, theme: 'colored' })` / `toast.error(...)` / `toast.info(...)` from `react-toastify`.
- **Prices:** use `formatPrice(amount)` from `src/Helpers/price.js` (gives `₹1,299`). Also there: `getOriginalPrice(product)` (MRP) and `getDiscountPercent(product)`.
- **Shared state:** `ContextFunction` in `src/Context/Context.js` holds `cart, setCart, wishlistData, setWishlistData, darkMode, compareList, setCompareList, budget, setBudget`. Use it with `const { cart } = useContext(ContextFunction)`.
- **Helpers in `src/Constants/Constant.js`:** `getAllProducts(setData)`, `addToCart(productId, quantity, authToken, setCart)`, `getCartTotals(cartItems)`, `getShippingCharge(amount)`, `FREE_SHIPPING_ABOVE`.
- **Hooks:** `useWishlist()` (`src/Hooks/useWishlist.js`), `useCompare()` (`src/Hooks/useCompare.js`), `useBudget()` (`src/Hooks/useBudget.js`).
- **Reusable components:** `ProductCard` (`src/Components/Card/Product Card/ProductCard.jsx`, prop `prod`), `EmptyState` (`src/Components/EmptyState/EmptyState.jsx`), `Loading` skeleton (`src/Components/loading/Loading.jsx`).
- **Styling:** plain CSS files next to the component. Colours: primary `#1976d2`, accent `#ff6f00`, green `#2e7d32`, card background `#fff` with `border-radius: 14px` and `box-shadow: 0 1px 4px rgba(0,0,0,0.05)`. Font is Poppins (already loaded).
- **Dark mode:** when dark mode is on, `<body>` has the class `dark-mode`. Add dark styles like:
  ```css
  body.dark-mode .my-box { background: #1e293b; color: #e2e8f0; }
  ```
  In CSS modules use `:global(body.dark-mode) .myBox { ... }`.
- **Responsive:** check every change at desktop width and at ~500px (phone). Under 900px the bottom mobile bar is shown.

### Useful existing routes
| Page | Path |
|---|---|
| Home | `/` |
| All products / search | `/products`, `/products?search=nike&sort=rating` |
| Category | `/product/type/:cat` (`cloths`, `shoe`, `electronics`, `book`, `jewelry`) |
| Product page | `/Detail/type/:cat/:id` |
| Cart / Checkout / Order placed | `/cart`, `/checkout`, `/ordersuccess?order=<id>` |
| My Orders / Profile | `/orders`, `/update` |
| Wishlist / Compare | `/wishlist`, `/compare` |
| Login / Register | `/login`, `/register` |

Test login: `test@example.com` / `test1234`.

---

## Part B — Tasks

Format of every task: **Goal → Where → Steps → Done when → Commit message**.

---

## Day 1 — Monday, 9 Nov

### 1. Anushka — "Page not found" (404) page
**Goal:** Any unknown URL shows a friendly 404 page instead of an empty page.
**Where:** new `src/Pages/NotFound/NotFound.jsx` + `NotFound.css`; `src/App.js`.
**Steps:**
1. Create `NotFound.jsx`: big "404", heading "Page not found", short text, and two buttons: "Go to Home" (`/`) and "Browse Products" (`/products`). Use MUI `Button` with `component={Link}`.
2. Style it centred in a white card like other pages; add dark-mode styles.
3. In `src/App.js` import it and add as the **last** route inside `<Routes>`: `<Route path='*' element={<NotFound />} />`.
**Done when:** `http://localhost:3000/abc` shows the 404 page; both buttons work; real pages still work.
**Commit:** `Add 404 page for unknown URLs`

### 2. Yug — "Recently viewed" row on Home
**Goal:** Home shows the products the user opened most recently.
**Where:** `src/Pages/Detail/ProductDetail.jsx`, `src/Pages/Home/HomePage.jsx`.
**Steps:**
1. In `ProductDetail.jsx`, after the product loads successfully (inside `loadProduct`, after `setProduct(data)`), save its id to `localStorage` key `shopIt_recent`: newest first, no duplicates, max 8 ids. Wrap localStorage in `try/catch`.
2. In `HomePage.jsx`, read `shopIt_recent`, and from the already-loaded `products` list pick those ids in the same order.
3. If there is at least 1 product, show a section "Recently Viewed" (use the existing `SectionHeader` and `ProductRow` in that file) between "Shop by Category" and "Trending Now". Hide it when empty.
**Done when:** open 3 products, go Home → they appear newest first; a new browser profile shows no section.
**Commit:** `Add recently viewed products on home page`

### 3. Krishnika — Password strength meter on Register
**Goal:** Show how strong the password is while the user types.
**Where:** `src/Auth/Register/Register.jsx` (+ small CSS in `src/Auth/Login/login.css`).
**Steps:**
1. Write a function `getStrength(password)` returning 0–4: +1 for length ≥ 8, +1 for a number, +1 for an uppercase letter, +1 for a symbol.
2. Below the password field show a bar (MUI `LinearProgress` with `variant='determinate'`, value = strength × 25) and a label: 0–1 "Weak" (red), 2 "Medium" (orange), 3–4 "Strong" (green).
3. Only show it when the password field is not empty.
**Done when:** typing `abc` shows Weak, `abc12345` Medium, `Abc@12345` Strong. Registration still works.
**Commit:** `Add password strength meter on register page`

### 4. Naina — Cancel an order
**Goal:** Users can cancel an order that is still "Placed".
**Where:** `backend/routes/order.js`, `src/Pages/Orders/Orders.jsx`, `.env`, `.env.example`.
**Steps:**
1. Backend: add `PUT /cancel/:id` with `authUser`. Find the order with `{ _id: id, user: req.user.id }`. If not found → 404. If `status !== 'Placed'` → 400 "This order can no longer be cancelled". Else set `status = 'Cancelled'`, save, return the order.
2. Add `REACT_APP_CANCEL_ORDER=http://localhost:5001/api/order/cancel` to `.env` and `.env.example`; restart `npm start`.
3. `Orders.jsx`: show a "Cancel Order" button (outlined, red) on orders with status Placed. Ask for confirmation (MUI `Dialog`), call the API, update that order in state, toast success.
4. Status chip: green for Placed, red (`color='error'`) for Cancelled.
**Done when:** placing an order then cancelling it turns the chip red and hides the button; cancelling someone else's order is impossible (404).
**Commit:** `Add cancel order option on My Orders`

---

## Day 2 — Tuesday, 10 Nov

### 5. Anushka — Back-to-top button
**Goal:** A round button appears after scrolling and takes the user back to the top.
**Where:** new `src/Components/ScrollTop/ScrollTop.jsx` + `ScrollTop.css`; `src/App.js`.
**Steps:**
1. Listen to `window` scroll in a `useEffect` (remove the listener on cleanup). Show the button when `window.scrollY > 400`.
2. On click: `window.scrollTo({ top: 0, behavior: 'smooth' })`.
3. Position: fixed, bottom-right (`right: 24px; bottom: 24px`), above the mobile bar on phones (`bottom: 76px` under 900px). Icon `MdKeyboardArrowUp`. `aria-label="Back to top"`.
4. Add `<ScrollTop />` in `App.js` next to `<CompareBar />`.
**Done when:** button hidden at top, visible after scrolling, scrolls up smoothly; doesn't cover the compare bar.
**Commit:** `Add back to top button`

### 6. Yug — Active filter chips on the product list
**Goal:** Show the filters currently applied as chips that can be removed one by one.
**Where:** `src/SingleCategory/SingleCategory.jsx` (+ `singlecategory.css`).
**Steps:**
1. Build a list of active filters from the existing state: `selectedTypes`, `selectedSubCategories`, `selectedBrands`, `priceRange` (only if not null), `minRating` (if > 0), `withinBudget`.
2. Render them above the grid (below the toolbar) as MUI `Chip`s with `onDelete` that removes just that filter (use the existing `toggle`, `setPriceRange(null)`, `setMinRating(0)`, `setWithinBudget(false)`).
3. Add a "Clear all" text button at the end (use existing `clearFilters`). Hide the row when nothing is active.
**Done when:** ticking Nike + 4★ shows two chips; deleting a chip updates the products.
**Commit:** `Show active filters as removable chips`

### 7. Krishnika — Share a comparison
**Goal:** A "Share" button copies a link that opens the same comparison.
**Where:** `src/Pages/Compare/Compare.jsx`.
**Steps:**
1. Add a "Share" button in the page header. On click build `${window.location.origin}/compare?ids=<id1>,<id2>,...` from `compareList`, copy it with `navigator.clipboard.writeText`, toast "Link copied".
2. On page load, read `ids` with `useSearchParams`. If present: call `getAllProducts`, keep the products whose `_id` is in the list (max 4, same order) and call `compareProducts(products)` from `useCompare()`. Then remove `ids` from the URL.
3. Note: hooks must stay at the top of the component (before the early `return` for the empty state).
**Done when:** copy the link, clear the compare list, paste the link → the same products are compared.
**Commit:** `Add shareable comparison link`

### 8. Naina — Budget alert at 80%
**Goal:** Warn the user once when the cart reaches 80% of the budget.
**Where:** `src/Components/Budget/BudgetCard.jsx`.
**Steps:**
1. In a `useEffect` watching `percentUsed` and `hasBudget`: when `hasBudget` and `percentUsed >= 80` and the alert has not been shown for this budget, show `toast.warning('You have used 80% of your budget', ...)`.
2. Remember it in `sessionStorage` key `shopIt_budgetAlert` = the budget value, so it shows only once per budget. When the budget changes, the alert can show again.
3. Also show a small orange line in the card "Almost there — only ₹X left" between 80% and 100%.
**Done when:** set a ₹1,000 budget, add items until > ₹800 → one toast; changing quantity again doesn't repeat it.
**Commit:** `Add 80 percent budget alert`

---

## Day 3 — Wednesday, 11 Nov

### 9. Anushka — Page titles
**Goal:** The browser tab shows the page name, e.g. "Cart | ShopIt".
**Where:** new `src/Hooks/usePageTitle.js` + every page component.
**Steps:**
1. Create `usePageTitle(title)` that sets `document.title = title ? \`${title} | ShopIt\` : 'ShopIt - Online Shopping'` in a `useEffect`.
2. Call it in: Home (no title), Products/Category (the page title, e.g. "Shoes"), Product page (product name once loaded), Cart, Checkout, Wishlist, My Orders, Compare, Profile ("My Account"), Login, Register, About, Contact, Order placed, 404.
**Done when:** every page shows a matching tab title.
**Commit:** `Set browser tab title on every page`

### 10. Yug — Keep the sort choice in the URL
**Goal:** Sorting survives a page refresh and can be shared.
**Where:** `src/SingleCategory/SingleCategory.jsx`.
**Steps:**
1. Use `const [searchParams, setSearchParams] = useSearchParams()` (already imported).
2. When the sort changes, update the URL: keep other params (like `search`) and set `sort`; remove it when the value is `relevance`. Use `setSearchParams(params, { replace: true })`.
3. The page already reads `searchParams.get('sort')` on load — check that it still works.
**Done when:** choose "Price: Low to High", refresh → still sorted; URL contains `?sort=priceLow`.
**Commit:** `Keep product sort in the URL`

### 11. Krishnika — Go back to the previous page after login
**Goal:** After logging in, the user returns to where they were (e.g. the cart) instead of Home.
**Where:** `src/Auth/Login/Login.jsx` + the places that send users to login: `ProductCard.jsx`, `ProductDetail.jsx`, `Compare.jsx`, `CheckoutForm.jsx`, `Cart.jsx`, `Wishlist.jsx`, `Orders.jsx`.
**Steps:**
1. In those places, change the login link to `/login?redirect=<current path>` (use `useLocation()` → `location.pathname + location.search`, wrapped in `encodeURIComponent`).
2. In `Login.jsx`, read `redirect` with `useSearchParams`. After a successful login `navigate(redirect || '/')`. Only allow values that start with `/` (security: never redirect to another website).
3. Also pass the redirect on to the "Create an account" link so it works after registering (update `Register.jsx` the same way).
**Done when:** logged out → open /cart → Login → you land on /cart.
**Commit:** `Redirect back to previous page after login`

### 12. Naina — Coupon code SAVE10
**Goal:** Users can apply the coupon `SAVE10` for 10% off the items (max ₹500).
**Where:** `src/Context/Context.js`, `src/Constants/Constant.js`, `src/Pages/Cart/OrderSummary.jsx`, `src/Components/Checkout/CheckoutForm.jsx`, `backend/routes/order.js`, `backend/models/Order.js`.
**Steps:**
1. Context: add `coupon` / `setCoupon` (string, default `''`).
2. `getCartTotals(cartItems, coupon)`: if coupon is `SAVE10`, `couponDiscount = Math.min(Math.round(itemsTotal * 0.1), 500)`; subtract it from `total` (shipping still based on `itemsTotal`). Return `couponDiscount` too. Update the calls in Cart and Checkout to pass `coupon`.
3. `OrderSummary.jsx`: input + "Apply" button. Wrong code → toast error. Applied → green line "Coupon SAVE10 − ₹X" and a "Remove" link.
4. Checkout: send `couponCode: coupon` in the place-order request; after success `setCoupon('')`.
5. Backend: in `/placeorder` re-calculate the discount on the server (never trust the frontend amount), save `couponCode` and `couponDiscount` on the order (add both fields to the Order model), and subtract from `totalAmount`.
**Done when:** cart ₹3,000 + SAVE10 → ₹300 off in cart, checkout and in My Orders total; `BADCODE` shows an error.
**Commit:** `Add SAVE10 coupon code`

---

## Day 4 — Thursday, 12 Nov

### 13. Anushka — Better Contact form validation
**Goal:** Field-by-field errors on the Contact form.
**Where:** `src/Pages/Contact/Contact.jsx`.
**Steps:**
1. Today `handleSubmit` only checks that all fields are filled. Add an `errors` state object.
2. Rules: name ≥ 2 characters, valid email (same regex as Login), subject ≥ 3 characters, message ≥ 10 characters.
3. Show the error under each field with MUI `TextField` props `error` and `helperText`. Clear a field's error when the user types in it.
4. On success keep the existing toast and reset the form.
**Done when:** submitting `a` / `abc` / empty shows the right message under each field; a valid form shows the success toast.
**Commit:** `Add field validation to contact form`

### 14. Yug — "New Arrivals" row on Home
**Goal:** Show the newest products on the home page.
**Where:** `src/Pages/Home/HomePage.jsx`.
**Steps:**
1. From `products`, sort by `_id` descending (MongoDB ids grow over time) and take 8.
2. Add a section "New Arrivals" (subtitle "Just added to the store") after "Best Deals", with a "View all →" link to `/products`.
3. Use the existing `SectionHeader` and `ProductRow` so loading skeletons work automatically.
**Done when:** Home shows 4 product rows/sections in total and the new one has 8 products.
**Commit:** `Add new arrivals section on home page`

### 15. Krishnika — Proper errors for bad product links
**Goal:** The product API returns clean 400/404 errors instead of crashing with 500.
**Where:** `backend/routes/product.js`.
**Steps:**
1. In `GET /fetchproduct/:id`: if `!mongoose.Types.ObjectId.isValid(id)` → `res.status(400).json({ msg: 'Invalid product id' })`. If `findById` returns `null` → `res.status(404).json({ msg: 'Product not found' })`.
2. In `POST /fetchproduct/type` and `/fetchproduct/category`: if `userType` is missing → 400 with a message.
3. The product page already shows "Product not found" when the request fails — check it.
**Done when:** `curl -H "Origin: http://localhost:3000" http://localhost:5001/api/product/fetchproduct/123` returns 400; a valid-looking but unknown id returns 404; `/Detail/type/shoe/123` shows "Product not found".
**Commit:** `Return 400/404 for invalid or missing products`

### 16. Naina — "Move all to cart" on the wishlist
**Goal:** One button moves every wishlist product to the cart.
**Where:** `src/Pages/WhisList/Wishlist.jsx`.
**Steps:**
1. Add a "Move all to cart" button next to the title (only when the wishlist has items).
2. For each product call `addToCart(product._id, 1, authToken, setCart)` from `Constant.js` **one after another** (`for...of` with `await`). If one fails because it's already in the cart, skip it and continue.
3. Then toast "X items added to cart" (and how many were already there). Disable the button while working.
**Done when:** wishlist with 3 items (1 already in cart) → 2 added, 1 skipped, cart badge updates.
**Commit:** `Add move all to cart on wishlist`

---

## Day 5 — Friday, 13 Nov

### 17. Anushka — Dark mode check
**Goal:** Every page looks correct in dark mode.
**Where:** CSS files of any page with problems.
**Steps:**
1. Turn on dark mode (moon icon in the header). Visit every page: Home, Products, Product, Cart, Checkout (all steps), Orders, Wishlist, Compare, Profile (all tabs), Login, Register, About, Contact, 404.
2. Fix any white boxes, dark text on dark background, invisible borders or icons by adding `body.dark-mode ...` rules in that page's CSS file.
3. Write down in the commit description which pages you fixed.
**Done when:** no page has unreadable text or bright white boxes in dark mode.
**Commit:** `Fix dark mode styles across pages`

### 18. Yug — Use the search with the keyboard
**Goal:** Arrow keys move through search suggestions; Enter opens one; Escape closes.
**Where:** `src/Components/SearchBar/SearchBar.jsx` (+ `SearchBar.css`).
**Steps:**
1. Add `activeIndex` state (-1 = none). On `onKeyDown` of the input: ArrowDown → next, ArrowUp → previous (wrap around), Escape → close the dropdown.
2. Enter: if `activeIndex >= 0` → `navigate` to that product and clear the search; otherwise keep the current behaviour (results page).
3. Highlight the active row with a class (same look as hover). Reset `activeIndex` when the text changes.
**Done when:** type "nike", press ↓ ↓ Enter → opens the 2nd suggestion.
**Commit:** `Add keyboard navigation to search suggestions`

### 19. Krishnika — Comparison on phones
**Goal:** The comparison is easy to read on small screens.
**Where:** `src/Pages/Compare/Compare.jsx`, `src/Components/Compare/Compare.css`.
**Steps:**
1. Under 700px hide the table and show one card per product instead: image, name, then every row as "Label: value" (reuse the existing `rows` array and its `render` functions).
2. Keep the "Lowest price" / "Top rated" badges and the Add to Cart / remove buttons on each card.
3. Desktop stays as it is.
**Done when:** at 500px width the compare page has no sideways scrolling and all information is visible.
**Commit:** `Add mobile layout for price comparison`

### 20. Naina — Printable invoice
**Goal:** Each order can be printed as an invoice.
**Where:** `src/Pages/Orders/Orders.jsx` (+ `Orders.css`), or a new `src/Pages/Orders/Invoice.jsx` with route `/orders/:id/invoice`.
**Steps:**
1. Add an "Invoice" button on each order.
2. Show a clean invoice: ShopIt name, order ID, date, customer name + address, table of items (name, qty, price, line total), item total, delivery, coupon (if any), grand total, "Payment: Cash on Delivery".
3. A "Print" button calls `window.print()`. Add `@media print` CSS that hides the header, footer, mobile bar and buttons.
**Done when:** print preview shows only the invoice on one clean page.
**Commit:** `Add printable invoice for orders`

---

## Day 6 — Saturday, 14 Nov

### 21. Anushka — Accessibility check
**Goal:** The site can be used with a keyboard and screen readers.
**Where:** header, footer, mobile bar, product card, other components as needed.
**Steps:**
1. Every `<img>` has a meaningful `alt` (product name, or `alt=""` for decoration).
2. Every icon-only button has an `aria-label` (theme toggle, wishlist heart, remove buttons, arrows).
3. Press Tab through Home: focus must be visible on every link/button. Add `:focus-visible { outline: 2px solid #1976d2; outline-offset: 2px; }` in `src/index.css` if needed.
4. Add a "Skip to content" link at the top of the page that jumps to the main content.
**Done when:** you can reach the search, categories, a product and the cart using only the keyboard.
**Commit:** `Improve accessibility: alt text, labels and focus styles`

### 22. Yug — Sticky buy bar on phones
**Goal:** On phones, the price and buy buttons stay visible while scrolling a product page.
**Where:** `src/Pages/Detail/ProductDetail.jsx`, `Productsimilar.css`.
**Steps:**
1. Add a bar at the bottom of the product page with the price, "Add to Cart" and "Buy Now" (reuse `handleAddToCart(false)` / `handleAddToCart(true)`).
2. CSS: hidden on desktop; under 900px `position: fixed; bottom: 60px` (just above the mobile bottom bar), full width, white, shadow.
3. Add bottom padding to the page so the bar doesn't cover content.
**Done when:** at 500px width, scrolling the product page keeps the bar visible and both buttons work.
**Commit:** `Add sticky buy bar on mobile product page`

### 23. Krishnika — Log out automatically when the session expires
**Goal:** Logins expire after 7 days; expired users are sent to login with a message.
**Where:** `backend/routes/auth.js`, `backend/middleware/authUser.js`, new `src/Helpers/session.js`, `src/index.js`.
**Steps:**
1. Backend: in both `jwt.sign(data, process.env.JWT_SECRET)` calls add `{ expiresIn: '7d' }`.
2. `authUser.js`: return status **401** (not 400) when the token is missing or invalid.
3. Frontend: in `session.js` add an axios response interceptor: on 401, remove `Authorization` and `shopIt_user` from localStorage, toast "Your session has expired, please login again", and go to `/login` (`window.location.assign('/login')`). Import the file once in `src/index.js`.
**Done when:** put a fake token in localStorage (`localStorage.setItem('Authorization','abc')`), open /cart → you are sent to login with the message.
**Commit:** `Expire sessions after 7 days and handle logout on 401`

### 24. Naina — "Total saved" banner on My Orders
**Goal:** Show how much the user saved across all orders.
**Where:** `src/Pages/Orders/Orders.jsx` (+ `Orders.css`).
**Steps:**
1. For every order and every item: saving = `(item.productId.originalPrice - item.productId.price) * item.quantity` (only when `originalPrice > price`). Add coupon discounts if Task 12 is done. Skip cancelled orders.
2. Show a green banner above the list: "You have saved ₹X on N orders with ShopIt 🎉". Hide it if the saving is 0.
**Done when:** with 2 orders the banner shows the correct sum (check by hand).
**Commit:** `Show total savings on My Orders`

---

## Day 7 — Sunday, 15 Nov

### 25. Anushka — Screenshots in the README
**Goal:** The GitHub page shows what the site looks like.
**Where:** new folder `screenshots/`, `README.md`.
**Steps:**
1. Take screenshots (1400px wide): Home, Product list with filters, Product page, Cart with Smart Budget, Price Comparison, Checkout review, My Orders.
2. Save as `screenshots/home.png` etc. (keep each under ~500 KB).
3. Add a "Screenshots" section to `README.md` with the images, and re-read the whole README for mistakes.
**Done when:** the images show on the GitHub repo page.
**Commit:** `Add screenshots to README`

### 26. Yug — Final test of browsing (Module 2)
**Goal:** Everything in product browsing works with no errors.
**Where:** Module 2 files.
**Steps:**
1. With DevTools Console open, test on desktop and at 500px: Home (all rows, banner arrows/dots), search (dropdown, Enter, keyboard), every category, every filter and sort, pagination, product page (zoom, quantity, add to cart, buy now, wishlist, share, similar products), Recently Viewed, New Arrivals.
2. Fix every bug or console error found. List them in the commit description.
**Done when:** a full pass with zero red console errors.
**Commit:** `Final testing and fixes for product browsing`

### 27. Krishnika — API test script
**Goal:** One command checks that the main backend routes work.
**Where:** new `backend/tests/api.test.js`, `backend/package.json`.
**Steps:**
1. Write a Node script (Node 18+ has `fetch` built in) that, with the backend running: registers a new user, logs in, calls `/api/auth/getuser`, fetches products, fetches one product, calls a bad id (expects 400), updates the budget, deletes the user.
2. Send the header `Origin: http://localhost:3000` on every request (the API checks it).
3. Print ✔ / ✘ per check; `process.exit(1)` if any fail.
4. In `backend/package.json` set `"test": "node tests/api.test.js"`.
**Done when:** `cd backend && npm test` prints all ✔.
**Commit:** `Add API test script`

### 28. Naina — Final test of shopping (Module 4)
**Goal:** The complete shopping flow works with no errors.
**Where:** Module 4 files.
**Steps:**
1. With DevTools Console open, test: add to cart, change quantity, move to wishlist, remove, set budget, 80% alert, over-budget warning, Smart Savings swap, coupon, checkout (all steps, wrong PIN code), place order, order success, My Orders (cancel, invoice, total saved), wishlist "Move all to cart".
2. Fix every bug found. List them in the commit description.
**Done when:** a full order works start to finish with zero red console errors.
**Commit:** `Final testing and fixes for cart and checkout`

---

## Part C — Checklist per day

| Day | Anushka | Yug | Krishnika | Naina |
|---|---|---|---|---|
| 9 Nov | 404 page | Recently viewed | Password strength | Cancel order |
| 10 Nov | Back to top | Filter chips | Share comparison | 80% budget alert |
| 11 Nov | Page titles | Sort in URL | Redirect after login | Coupon SAVE10 |
| 12 Nov | Contact validation | New arrivals | Product 400/404 | Move all to cart |
| 13 Nov | Dark mode check | Keyboard search | Compare on mobile | Printable invoice |
| 14 Nov | Accessibility | Sticky buy bar | Session expiry | Total saved |
| 15 Nov | README screenshots | Final test (browsing) | API tests | Final test (shopping) |
