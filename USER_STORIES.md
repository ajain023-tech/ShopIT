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

**US-1.6 Page not reloading**
As a shopper, I want pages to switch without a full reload so that the site feels fast.

---

## Module 2 — Product Browsing (Yug)

**US-2.1 Home page**
As a shopper, I want to see a banner, featured products and categories on the home page so that I can start shopping quickly.

**US-2.2 Browse by category**
As a shopper, I want to open a category (e.g. Shoes, Electronics) so that I only see products I am interested in.
- Clicking a category card opens that category's product list.

**US-2.3 Sort and filter**
As a shopper, I want to sort a category by price or rating so that I can find the best option.
- Options: price high→low, price low→high, high rated, low rated.

**US-2.4 Search**
As a shopper, I want to search products by name, brand or category so that I can find a product without browsing.
- Results update while typing; clicking a result opens the product.

**US-2.5 Product details**
As a shopper, I want to see a product's image, price, rating and description so that I can decide whether to buy it.
- The page also shows similar products from the same category.
- A Share button copies / shares the product link.

---

## Module 3 — User Accounts & Server (Krishnika)

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

## Module 4 — Cart, Wishlist & Orders (Naina)

**US-4.1 Add to cart**
As a shopper, I want to add a product to my cart so that I can buy it later.
- Adding the same product twice shows "already in cart".

**US-4.2 View and edit cart**
As a shopper, I want to see my cart items with the subtotal, shipping and total so that I know what I will pay.
- I can remove items from the cart.
- An empty cart shows an "empty cart" message.

**US-4.3 Wishlist**
As a shopper, I want to save products to a wishlist so that I can come back to them.
- I can add/remove items from the product card or product page.

**US-4.4 Checkout**
As a shopper, I want to enter my shipping address and place my order so that I receive my products.
- All address fields are required.
- After placing the order the cart is emptied and a confirmation page shows the order ID.

**US-4.5 Previous orders**
As a shopper, I want to see my previous orders so that I can remember what I bought.
- Previous orders are listed on the cart page, newest first.
