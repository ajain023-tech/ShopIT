import { GroupCloth, Shoes, Electronics, FemaleCloth, MaleCloth, Books, Jewelry } from '../Assets/Images/Image';

// slides of the big banner at the top of the home page
export const heroSlides = [
    {
        img: GroupCloth,
        tag: 'New Season',
        title: 'Fashion that fits your style',
        text: 'Shirts, dresses, jeans and more from top brands.',
        to: '/product/type/cloths',
    },
    {
        img: Electronics,
        tag: 'Tech Deals',
        title: 'Upgrade your setup',
        text: 'Monitors, SSDs and hard drives at the best prices.',
        to: '/product/type/electronics',
    },
    {
        img: Shoes,
        tag: 'Up to 40% off',
        title: 'Step out in comfort',
        text: 'Running, football, formal and casual shoes.',
        to: '/product/type/shoe',
    },
];

// "Shop by Category" cards; `type` must match the product type in the database
const categories = [
    { img: MaleCloth, name: 'Men', type: 'cloths' },
    { img: FemaleCloth, name: 'Women', type: 'cloths' },
    { img: Shoes, name: 'Shoes', type: 'shoe' },
    { img: Electronics, name: 'Electronics', type: 'electronics' },
    { img: Books, name: 'Books', type: 'book' },
    { img: Jewelry, name: 'Jewellery', type: 'jewelry' },
];

export default categories;
