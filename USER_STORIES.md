# ShopIt — User Stories

Format: **As a** _type of user_, **I want** _some goal_ **so that** _some reason_.
Each story lists acceptance criteria that can be checked when testing.

---

## Module 1 — App Layout, Navigation & Info Pages (Anushka)

**US-1.1 Navigation bar**
As a shopper, I want a navigation bar on every page so that I can quickly go to Home, Cart, Wishlist and my account.
- The bar shows Home, About, Contact, Cart and Wishlist links, plus Login or Logout.
- The cart and wishlist icons show how many items they contain.
- On small screens a bottom mobile navigation bar is shown instead.

**US-1.1a Offer strip and category bar**
As a shopper, I want to see current offers and the main categories at the top of every page so that I can jump straight to what I want.
- A thin strip shows the free-delivery and Cash on Delivery offers.
- A category bar under the header links to All Products, Clothing, Shoes, Electronics, Books and Jewellery.

**US-1.2 Dark mode**
As a shopper, I want to switch between light and dark mode so that the site is comfortable to use at night.
- A toggle switches the theme instantly on all pages.

**US-1.3 Footer**
As a visitor, I want a footer with useful links so that I can find pages from anywhere on the site.

**US-1.4 About page**
As a visitor, I want to read about the store so that I know who I am buying from.

**US-1.5 Contact page**
As a visitor, I want a contact form so that I can send a question to the store.
- Empty fields show a validation message.

**US-1.6 Loading and empty states**
As a shopper, I want to see placeholders while products load and a friendly message when a page is empty so that I always know what is happening.
- Grey skeleton cards are shown while products are loading.
- Empty cart, empty wishlist, no orders and no search results each show a message and a button to continue shopping.

**US-1.7 Page not reloading**
As a shopper, I want pages to switch without a full reload so that the site feels fast.

---

## Module 2 — Product Browsing (Yug)

**US-2.1 Home page**
As a shopper, I want to see a banner, featured products and categories on the home page so that I can start shopping quickly.

**US-2.2 Browse by category**
As a shopper, I want to open a category (e.g. Shoes, Electronics) so that I only see products I am interested in.
- Clicking a category card opens that category's product list.

**US-2.3 Sort and filter**
As a shopper, I want to filter and sort products so that I can find the best option quickly.
- A sidebar filters by category/type, price range, brand and minimum rating; on mobile it opens as a drawer.
- Sort options: relevance, price low→high, price high→low, customer rating, discount.
- Products are shown 12 per page.

**US-2.4 Search**
As a shopper, I want to search products by name, brand or category so that I can find a product without browsing.
- Results update while typing; clicking a result opens the product.

**US-2.5 Product details**
As a shopper, I want to see a product's image, price, rating and description so that I can decide whether to buy it.
- The selling price is shown with the MRP crossed out and the discount percentage.
- Hovering over the image zooms in.
- I can choose a quantity (1–5), Add to Cart, or Buy Now (adds to cart and opens the cart).
- Delivery date, return policy and Cash on Delivery are shown.
- The page also shows similar products from the same category, and a Share button copies / shares the link.

**US-2.6 Quick add from product cards**
As a shopper, I want to add a product to my cart or wishlist directly from a product card so that I do not have to open every product.

---

## Module 3 — User Accounts, Server & Price Comparison (Krishnika)

**US-3.1 Register**
As a new user, I want to create an account with my name, email, phone number and password so that I can shop.
- Email must be valid, phone must be 10 digits, password at least 5 characters.
- An email or phone number that is already registered is rejected.

**US-3.2 Login / Logout**
As a registered user, I want to log in and log out so that my cart and orders stay private.
- Wrong email or password shows an error.
- Cart, wishlist and checkout ask me to log in if I am logged out.

**US-3.3 Update profile and address**
As a user, I want to update my name, phone and shipping address so that my orders reach the right place.

**US-3.4 Change password**
As a user, I want to change my password so that I can keep my account secure.
- My current password must be correct.

**US-3.5 Delete account**
As a user, I want to delete my account so that my data is removed.
- My cart, wishlist and orders are deleted too.

**US-3.6 Product data API**
As the website, I need an API that returns all products, a single product and products of a category so that pages can show them.

---

**US-3.7 Price Comparison** ⭐
As a shopper, I want to compare the prices of a few products side by side so that I can pick the best deal.
- I can tick "Compare" on up to 4 products; a bar at the bottom shows what I picked.
- On a product page, "Compare price with similar products" compares it with the closest-priced similar items.
- The comparison page highlights the lowest price, the top rated product and the biggest discount.
- It shows how much more each product costs than the cheapest one, the MRP saving, delivery charge and value for money.
- I can add any compared product to my cart from the comparison page.

---

## Module 4 — Cart, Wishlist, Orders & Smart Budget (Naina)

**US-4.1 Add to cart**
As a shopper, I want to add a product to my cart so that I can buy it later.
- Adding the same product twice shows "already in cart".

**US-4.2 View and edit cart**
As a shopper, I want to see my cart items with the price details so that I know what I will pay.
- I can increase or decrease the quantity (1–10), remove an item, or move it to my wishlist.
- Price details show MRP, discount, delivery charge and total.
- Delivery is free for orders of ₹999 or more, otherwise ₹99; the cart tells me how much more to add for free delivery.
- An empty cart shows an "empty cart" message.

**US-4.3 Wishlist**
As a shopper, I want to save products to a wishlist so that I can come back to them.
- I can add/remove items from the product card or product page.

**US-4.4 Checkout**
As a shopper, I want to check out in clear steps so that I can review my order before placing it.
- Step 1 Address: all fields required, PIN code must be 6 digits; it is pre-filled from my profile.
- Step 2 Review: shows the address, items and Cash on Delivery as the payment method.
- After placing the order the cart is emptied and a confirmation page shows the order ID.

**US-4.5 My Orders**
As a shopper, I want to see my previous orders so that I can remember what I bought.
- The My Orders page lists orders newest first with date, total, payment method, order ID, status, items and delivery address.

**US-4.6 Smart Budget** ⭐
As a shopper, I want to set a budget and see how my cart compares to it so that I do not overspend.
- I can type a budget or pick a quick amount (₹1,000 / ₹2,500 / ₹5,000 / ₹10,000); it is saved to my account.
- A progress bar shows how much of the budget my cart uses; it turns red with a warning when I go over.
- Product pages tell me whether a product fits my remaining budget.
- The product list has a "Within my budget" filter.

**US-4.7 Smart Savings** ⭐
As a shopper who is over budget, I want cheaper alternatives suggested so that I can stay within my budget.
- For items in my cart, the cart suggests the cheapest product of the same type with a rating of 4★ or more.
- Each suggestion shows how much I save; "Swap" replaces the item in my cart with the cheaper one.
