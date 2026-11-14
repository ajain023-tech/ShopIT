// Price helpers shared by product cards, product page and cart

export const formatPrice = (amount) =>
    '₹' + Math.round(Number(amount) || 0).toLocaleString('en-IN');

// MRP of a product; falls back to the selling price if no MRP is stored
export const getOriginalPrice = (product) =>
    product?.originalPrice && product.originalPrice > product.price ? product.originalPrice : product?.price;

// discount in percent, e.g. 25
export const getDiscountPercent = (product) => {
    const mrp = getOriginalPrice(product);
    if (!mrp || mrp <= product.price) return 0;
    return Math.round(((mrp - product.price) / mrp) * 100);
};
