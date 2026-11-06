require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [

  // ───────────── CLOTHS – MEN ─────────────
  {
    name: "Roadster Men's Slim Fit Shirt", brand: 'Roadster', price: 699, category: 'men',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    rating: 4.3, type: 'cloths', description: "Slim-fit cotton casual shirt with a spread collar. Perfect for daily wear."
  },
  {
    name: "H&M Men's Regular Fit Oxford Shirt", brand: 'H&M', price: 999, category: 'men',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
    rating: 4.4, type: 'cloths', description: "Classic oxford-weave shirt in a relaxed regular fit. A wardrobe essential."
  },
  {
    name: "Rare Rabbit Men's Polo T-Shirt", brand: 'Rare Rabbit', price: 1299, category: 'men',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80',
    rating: 4.5, type: 'cloths', description: "Premium pique polo with ribbed collar and two-button placket."
  },
  {
    name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", price: 2499, category: 'men',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
    rating: 4.6, type: 'cloths', description: "Iconic slim-fit jeans in authentic stretch denim. Sits below the waist."
  },
  {
    name: "Peter England Men's Formal Trousers", brand: 'Peter England', price: 1199, category: 'men',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80',
    rating: 4.2, type: 'cloths', description: "Flat-front formal trousers in wrinkle-resistant fabric. Office-ready."
  },
  {
    name: "Van Heusen Men's Fleece Sweatshirt", brand: 'Van Heusen', price: 1499, category: 'men',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80',
    rating: 4.3, type: 'cloths', description: "Soft fleece sweatshirt with kangaroo pocket. Great for cooler days."
  },
  {
    name: "Jack & Jones Men's Denim Jacket", brand: 'Jack & Jones', price: 2799, category: 'men',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
    rating: 4.5, type: 'cloths', description: "Classic 5-pocket denim jacket with button-down front. Timeless style."
  },
  {
    name: "Wrogn Men's Graphic T-Shirt", brand: 'Wrogn', price: 599, category: 'men',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
    rating: 4.1, type: 'cloths', description: "Bold graphic tee in 100% cotton. Statement style for the streets."
  },
  {
    name: "Arrow Men's Business Blazer", brand: 'Arrow', price: 3999, category: 'men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
    rating: 4.4, type: 'cloths', description: "Single-breasted blazer in wool-blend fabric. Sharp and professional."
  },
  {
    name: "Dennis Lingo Men's Bomber Jacket", brand: 'Dennis Lingo', price: 2199, category: 'men',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80',
    rating: 4.2, type: 'cloths', description: "Lightweight bomber jacket with ribbed cuffs and hem. Street-ready."
  },

  // ───────────── CLOTHS – WOMEN ─────────────
  {
    name: "Libas Women's Floral Kurta", brand: 'Libas', price: 799, category: 'women',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
    rating: 4.4, type: 'cloths', description: "Floral-print straight kurta in soft rayon. Comfortable and festive."
  },
  {
    name: "W for Woman Ethnic Printed Kurti", brand: 'W', price: 999, category: 'women',
    image: 'https://images.unsplash.com/photo-1583759136431-3a5639002c9e?w=500&q=80',
    rating: 4.3, type: 'cloths', description: "Vibrant block-printed kurti with 3/4 sleeves. Everyday ethnic wear."
  },
  {
    name: "Biba Women's Anarkali Kurta Set", brand: 'Biba', price: 1799, category: 'women',
    image: 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?w=500&q=80',
    rating: 4.5, type: 'cloths', description: "Anarkali-style kurta with palazzo pants and dupatta. Festive collection."
  },
  {
    name: "H&M Women's High-Waist Jeans", brand: 'H&M', price: 1499, category: 'women',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    rating: 4.4, type: 'cloths', description: "High-waisted skinny jeans in stretch denim. Modern and flattering."
  },
  {
    name: "Zara Women's Flared Midi Dress", brand: 'Zara', price: 2999, category: 'women',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
    rating: 4.6, type: 'cloths', description: "Flared midi dress with tie-waist detail. Perfect for brunches and outings."
  },
  {
    name: "AND Women's Formal Blazer", brand: 'AND', price: 2499, category: 'women',
    image: 'https://images.unsplash.com/photo-1548549557-dbe9155f9e75?w=500&q=80',
    rating: 4.3, type: 'cloths', description: "Structured single-button blazer. Office-chic that means business."
  },
  {
    name: "Global Desi Women's Maxi Dress", brand: 'Global Desi', price: 1399, category: 'women',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80',
    rating: 4.2, type: 'cloths', description: "Bohemian-print maxi dress with a flared hem. Effortless boho vibes."
  },
  {
    name: "Vero Moda Women's Knit Top", brand: 'Vero Moda', price: 899, category: 'women',
    image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=500&q=80',
    rating: 4.3, type: 'cloths', description: "Ribbed-knit fitted top with a round neckline. A versatile wardrobe staple."
  },
  {
    name: "ONLY Women's Jogger Pants", brand: 'ONLY', price: 1199, category: 'women',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80',
    rating: 4.4, type: 'cloths', description: "Soft cotton-blend joggers with elastic waist. Loungewear meets athleisure."
  },
  {
    name: "Fabindia Women's Cotton Saree", brand: 'Fabindia', price: 2199, category: 'women',
    image: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=500&q=80',
    rating: 4.5, type: 'cloths', description: "Handwoven cotton saree with a contrasting border. Subtle, elegant everyday wear."
  },

  // ───────────── SHOES – RUNNING ─────────────
  {
    name: 'Nike Revolution 6 Running Shoes', brand: 'Nike', price: 4495, category: 'running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Lightweight mesh upper with foam midsole for daily road running."
  },
  {
    name: 'Adidas Runfalcon 3.0 Running Shoes', brand: 'Adidas', price: 3999, category: 'running',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
    rating: 4.3, type: 'shoe', description: "Cloudfoam midsole for all-day comfort. Grippy rubber outsole for road running."
  },
  {
    name: 'ASICS Gel-Nimbus 25 Running Shoes', brand: 'ASICS', price: 14999, category: 'running',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    rating: 4.7, type: 'shoe', description: "Premium GEL technology for superior shock absorption. Built for long-distance runners."
  },
  {
    name: 'Saucony Kinvara 14 Running Shoes', brand: 'Saucony', price: 9999, category: 'running',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    rating: 4.5, type: 'shoe', description: "Featherlight PWRRUN cushioning. A speedy everyday trainer loved by marathoners."
  },
  {
    name: 'Puma Velocity Nitro 2 Running Shoes', brand: 'Puma', price: 8999, category: 'running',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "NITRO foam midsole offers explosive energy return. PUMAGRIP rubber outsole."
  },
  {
    name: 'New Balance FuelCell Rebel v3', brand: 'New Balance', price: 11999, category: 'running',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&q=80',
    rating: 4.6, type: 'shoe', description: "FuelCell foam for a propulsive, springy ride. Built for fast everyday runs."
  },
  {
    name: 'Brooks Ghost 15 Running Shoes', brand: 'Brooks', price: 12999, category: 'running',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80',
    rating: 4.7, type: 'shoe', description: "DNA LOFT v2 cushioning for ultra-smooth transitions on any terrain."
  },
  {
    name: 'Hoka Clifton 9 Running Shoes', brand: 'Hoka', price: 13999, category: 'running',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=500&q=80',
    rating: 4.6, type: 'shoe', description: "Maximal cushioning with a low weight. Meta-Rocker geometry for smooth rolling."
  },

  // ───────────── SHOES – FOOTBALL ─────────────
  {
    name: 'Nike Mercurial Vapor 15 Club FG', brand: 'Nike', price: 4995, category: 'football',
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Firm-ground football boot with synthetic upper. Designed for speed on dry pitches."
  },
  {
    name: 'Adidas Predator Accuracy.4 FG', brand: 'Adidas', price: 5999, category: 'football',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    rating: 4.5, type: 'shoe', description: "DEMONSKIN texture for superior ball control. Firm-ground stud configuration."
  },
  {
    name: 'Puma Future 7 Play FG/AG', brand: 'Puma', price: 4499, category: 'football',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80',
    rating: 4.3, type: 'shoe', description: "Adaptable fit with FUZIONFIT collar. Works on firm and artificial ground."
  },
  {
    name: 'Adidas Copa Pure.4 FG', brand: 'Adidas', price: 4999, category: 'football',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Synthetic Copa upper inspired by the classic leather. Soft touch on the ball."
  },
  {
    name: 'Nike Tiempo Legend 10 Club FG', brand: 'Nike', price: 5495, category: 'football',
    image: 'https://images.unsplash.com/photo-1462572319135-f9a68c720eac?w=500&q=80',
    rating: 4.5, type: 'shoe', description: "Textured synthetic leather for precise ball control. Ideal for central midfielders."
  },
  {
    name: 'Nivia Storm Football Boots', brand: 'Nivia', price: 1299, category: 'football',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80',
    rating: 4.0, type: 'shoe', description: "Durable synthetic upper with moulded stud outsole. Great entry-level boot."
  },
  {
    name: 'Vector X Adrenaline Football Shoes', brand: 'Vector X', price: 1599, category: 'football',
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500&q=80',
    rating: 4.1, type: 'shoe', description: "Lightweight and breathable upper. Firm ground outsole for good traction."
  },
  {
    name: 'New Balance Furon v7 Club FG', brand: 'New Balance', price: 5499, category: 'football',
    image: 'https://images.unsplash.com/photo-1521093470119-a3acdc43374a?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Hypoknit wrap for a glove-like fit. Firm-ground studs for natural grass."
  },

  // ───────────── SHOES – FORMAL ─────────────
  {
    name: "Hush Puppies Men's Leather Oxford", brand: 'Hush Puppies', price: 3499, category: 'formal',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Genuine leather Oxford with memory foam insole. Classic office footwear."
  },
  {
    name: "Red Tape Men's Derby Shoes", brand: 'Red Tape', price: 2799, category: 'formal',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=80',
    rating: 4.3, type: 'shoe', description: "Full-grain leather derby with lace-up closure. Elegant and durable."
  },
  {
    name: "Clarks Men's Un Aldric Lace-Up", brand: 'Clarks', price: 5999, category: 'formal',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    rating: 4.6, type: 'shoe', description: "Premium leather upper with OrthoLite® footbed. All-day comfort for long work hours."
  },
  {
    name: "Bata Comfit Men's Formal Shoes", brand: 'Bata', price: 1999, category: 'formal',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80',
    rating: 4.2, type: 'shoe', description: "Comfortable leather-look formal shoes with cushioned insole. Value pick."
  },
  {
    name: "Woodland Men's Leather Monk Strap", brand: 'Woodland', price: 3299, category: 'formal',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Genuine leather monk-strap shoe with double buckle. Smart and versatile."
  },
  {
    name: "Liberty Men's Brogue Shoes", brand: 'Liberty', price: 1799, category: 'formal',
    image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500&q=80',
    rating: 4.2, type: 'shoe', description: "Classic brogue detailing on a leather-look upper. Affordable formal style."
  },
  {
    name: "Lee Cooper Men's Slip-On Shoes", brand: 'Lee Cooper', price: 1599, category: 'formal',
    image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500&q=80',
    rating: 4.1, type: 'shoe', description: "Loafer-style slip-ons with a polished finish. Easy to wear, easy to love."
  },
  {
    name: "Arrow Men's Cap Toe Derby", brand: 'Arrow', price: 2999, category: 'formal',
    image: 'https://images.unsplash.com/photo-1571456111134-0393e18a42c1?w=500&q=80',
    rating: 4.5, type: 'shoe', description: "Italian-crafted cap-toe derby in genuine leather. The boardroom essential."
  },

  // ───────────── SHOES – CASUAL ─────────────
  {
    name: 'Nike Air Max 270', brand: 'Nike', price: 9995, category: 'casual',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    rating: 4.6, type: 'shoe', description: "Max Air unit in the heel for all-day cushioning. Lifestyle sneaker icon."
  },
  {
    name: 'Adidas Stan Smith Sneakers', brand: 'Adidas', price: 7999, category: 'casual',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
    rating: 4.5, type: 'shoe', description: "The timeless court-inspired tennis sneaker. Clean leather upper, perforated 3-Stripes."
  },
  {
    name: 'Puma Smash v2 Sneakers', brand: 'Puma', price: 2799, category: 'casual',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80',
    rating: 4.3, type: 'shoe', description: "Vulcanized canvas sneaker with EVA midsole. Classic tennis-court style."
  },
  {
    name: "Converse Chuck Taylor All Star", brand: 'Converse', price: 3799, category: 'casual',
    image: 'https://images.unsplash.com/photo-1494496195158-c3bc7e73e2c5?w=500&q=80',
    rating: 4.5, type: 'shoe', description: "The original canvas high-top sneaker. Iconic rubber toe cap and OrthoLite cushioning."
  },
  {
    name: 'Skechers Go Walk 6 Slip-Ons', brand: 'Skechers', price: 3999, category: 'casual',
    image: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=500&q=80',
    rating: 4.4, type: 'shoe', description: "Hands-free slip-on with Air-Cooled Goga Mat insole. Ridiculously comfortable."
  },
  {
    name: 'Vans Old Skool Skate Shoes', brand: 'Vans', price: 4795, category: 'casual',
    image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=500&q=80',
    rating: 4.6, type: 'shoe', description: "Suede and canvas uppers with iconic side stripe. The original skate shoe."
  },
  {
    name: 'Bata North Star Canvas Sneakers', brand: 'Bata', price: 1299, category: 'casual',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80',
    rating: 4.1, type: 'shoe', description: "Lightweight canvas upper with flexible rubber sole. Everyday casual comfort."
  },
  {
    name: 'Campus Oxyfit Running Casuals', brand: 'Campus', price: 1799, category: 'casual',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80',
    rating: 4.2, type: 'shoe', description: "Mesh upper with phylon midsole for breathable everyday wear."
  },

  // ───────────── ELECTRONICS – MONITOR ─────────────
  {
    name: 'LG 24MR400-B 24" FHD Monitor', brand: 'LG', price: 8999, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "23.8\" Full HD IPS panel, 75Hz refresh rate, AMD FreeSync. Ideal for everyday computing."
  },
  {
    name: 'Samsung LS24D304GAWXXL 24" FHD Monitor', brand: 'Samsung', price: 7999, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&q=80',
    rating: 4.2, type: 'electronics', description: "24\" FHD panel with Eye Saver Mode and Flicker Free technology. Easy on the eyes."
  },
  {
    name: 'LG UltraGear 27GS60F 27" FHD Gaming Monitor', brand: 'LG', price: 13999, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1593640408182-31c228b19f60?w=500&q=80',
    rating: 4.6, type: 'electronics', description: "27\" FHD IPS, 180Hz, 1ms MPRT, G-SYNC Compatible. Pure gaming performance."
  },
  {
    name: 'Dell E2423H 24" FHD Monitor', brand: 'Dell', price: 10499, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "24\" FHD IPS panel with ComfortView Plus. Designed for professionals."
  },
  {
    name: 'Asus VA27EHF 27" FHD Monitor', brand: 'Asus', price: 11999, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&q=80',
    rating: 4.5, type: 'electronics', description: "27\" FHD IPS, 100Hz, HDMI, Eye Care with flicker-free display. Great value."
  },
  {
    name: 'BenQ GW2490 24" FHD Monitor', brand: 'BenQ', price: 12999, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "Eye-Care technology with B.I. Gen2 brightness intelligence."
  },
  {
    name: 'Samsung Odyssey G5 27" QHD Curved', brand: 'Samsung', price: 16999, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1655721533850-68bf38cbf193?w=500&q=80',
    rating: 4.6, type: 'electronics', description: "27\" WQHD 1000R Curved, 165Hz, 1ms, AMD FreeSync Premium. Immersive gaming."
  },
  {
    name: 'ViewSonic VA2719-SMH 27" FHD Monitor', brand: 'ViewSonic', price: 9499, category: 'monitor',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "27\" Full HD SuperClear® IPS panel, HDMI and VGA connectivity."
  },

  // ───────────── ELECTRONICS – SSD ─────────────
  {
    name: 'Samsung 870 EVO 500GB SATA SSD', brand: 'Samsung', price: 4499, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80',
    rating: 4.7, type: 'electronics', description: "500GB SATA III SSD with 560 MB/s read speed. Reliable upgrade for laptops & desktops."
  },
  {
    name: 'WD Blue SN580 1TB NVMe SSD', brand: 'Western Digital', price: 7999, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=500&q=80',
    rating: 4.6, type: 'electronics', description: "1TB PCIe Gen4 NVMe SSD with up to 4150 MB/s read. Blazing-fast storage."
  },
  {
    name: 'Kingston A400 240GB SATA SSD', brand: 'Kingston', price: 2799, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "240GB SATA SSD with 500 MB/s read. Budget-friendly OS drive upgrade."
  },
  {
    name: 'Crucial MX500 1TB SATA SSD', brand: 'Crucial', price: 6999, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=500&q=80',
    rating: 4.6, type: 'electronics', description: "1TB SATA III SSD with AES 256-bit encryption. Reliable everyday storage."
  },
  {
    name: 'Seagate BarraCuda Q5 500GB NVMe SSD', brand: 'Seagate', price: 4999, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "500GB M.2 NVMe SSD with 2400 MB/s read speed. Compact and fast."
  },
  {
    name: 'Samsung T7 1TB Portable SSD', brand: 'Samsung', price: 8999, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&q=80',
    rating: 4.7, type: 'electronics', description: "1TB USB 3.2 Gen 2 portable SSD with 1050 MB/s read. Transfer files on the go."
  },
  {
    name: 'WD Green 240GB SATA SSD', brand: 'Western Digital', price: 2499, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1611450776669-ef10f2b2406b?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "240GB SATA SSD for everyday computing. Low power consumption, silent operation."
  },
  {
    name: 'Lexar NM620 512GB NVMe SSD', brand: 'Lexar', price: 4299, category: 'ssd',
    image: 'https://images.unsplash.com/photo-1606318621004-c51ccc405dab?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "512GB PCIe Gen3 NVMe with 3300 MB/s read. Great performance per rupee."
  },

  // ───────────── ELECTRONICS – HDD ─────────────
  {
    name: 'Seagate Barracuda 1TB Desktop HDD', brand: 'Seagate', price: 2999, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "1TB 7200 RPM 3.5\" SATA HDD. Reliable mass storage for desktops."
  },
  {
    name: 'WD Blue 2TB Desktop HDD', brand: 'Western Digital', price: 4499, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "2TB 7200 RPM 3.5\" SATA HDD. The go-to drive for everyday storage needs."
  },
  {
    name: 'Toshiba P300 1TB Desktop HDD', brand: 'Toshiba', price: 2799, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80',
    rating: 4.2, type: 'electronics', description: "1TB 7200 RPM 3.5\" SATA HDD with 64MB cache. Dependable and affordable."
  },
  {
    name: 'Seagate Expansion 2TB Portable HDD', brand: 'Seagate', price: 4999, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1608155686393-8fefad9a9dab?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "2TB USB 3.0 portable drive. Plug-and-play, no external power required."
  },
  {
    name: 'WD Elements 1TB Portable HDD', brand: 'Western Digital', price: 3299, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "1TB USB 3.0 portable drive with WD reliability. Compact and travel-friendly."
  },
  {
    name: 'Seagate IronWolf 4TB NAS HDD', brand: 'Seagate', price: 8999, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1602526212974-d77cb6a2b962?w=500&q=80',
    rating: 4.6, type: 'electronics', description: "4TB NAS-optimized HDD. Built for 24×7 operation."
  },
  {
    name: 'WD Purple 2TB Surveillance HDD', brand: 'Western Digital', price: 5499, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1583534978996-9b94e7693099?w=500&q=80',
    rating: 4.4, type: 'electronics', description: "2TB drive optimized for DVR and NVR systems. AllFrame AI™ technology."
  },
  {
    name: 'Toshiba N300 4TB NAS HDD', brand: 'Toshiba', price: 8499, category: 'hdd',
    image: 'https://images.unsplash.com/photo-1604069406218-c3c53e2e2a26?w=500&q=80',
    rating: 4.3, type: 'electronics', description: "4TB 7200 RPM NAS HDD. Designed for 24/7 multi-drive enclosures."
  },

  // ───────────── BOOKS – SCIFI ─────────────
  {
    name: 'Dune by Frank Herbert', brand: 'Hodder & Stoughton', price: 499, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    rating: 4.8, type: 'book', author: 'Frank Herbert', description: "The epic saga of a desert planet. A masterpiece of science fiction."
  },
  {
    name: 'The Martian by Andy Weir', brand: 'Del Rey', price: 399, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Andy Weir', description: "An astronaut stranded on Mars must use science to survive. Thrilling and brilliantly funny."
  },
  {
    name: "The Hitchhiker's Guide to the Galaxy", brand: 'Pan Books', price: 299, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
    rating: 4.8, type: 'book', author: 'Douglas Adams', description: "The most hilarious sci-fi ever written."
  },
  {
    name: 'Project Hail Mary by Andy Weir', brand: 'Ballantine Books', price: 449, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500&q=80',
    rating: 4.9, type: 'book', author: 'Andy Weir', description: "A lone astronaut must save Earth from an extinction-level threat."
  },
  {
    name: "Ender's Game by Orson Scott Card", brand: 'Tor Books', price: 349, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Orson Scott Card', description: "A child military genius trained to fight an alien war. A landmark of science fiction."
  },
  {
    name: 'Foundation by Isaac Asimov', brand: 'Spectra', price: 379, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Isaac Asimov', description: "The science of psychohistory predicts civilization's fall. A legendary space-opera epic."
  },
  {
    name: 'Neuromancer by William Gibson', brand: 'Ace Books', price: 329, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
    rating: 4.5, type: 'book', author: 'William Gibson', description: "The novel that defined cyberpunk."
  },
  {
    name: 'The Three-Body Problem by Liu Cixin', brand: 'Tor Books', price: 499, category: 'scifi',
    image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Liu Cixin', description: "A mind-bending hard science fiction masterpiece from China."
  },

  // ───────────── BOOKS – BUSINESS ─────────────
  {
    name: 'Rich Dad Poor Dad by Robert T. Kiyosaki', brand: 'Plata Publishing', price: 299, category: 'business',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80',
    rating: 4.6, type: 'book', author: 'Robert T. Kiyosaki', description: "What the rich teach their kids about money. Financial literacy 101."
  },
  {
    name: 'Atomic Habits by James Clear', brand: 'Avery', price: 499, category: 'business',
    image: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=500&q=80',
    rating: 4.8, type: 'book', author: 'James Clear', description: "Tiny changes, remarkable results. The definitive guide to habits."
  },
  {
    name: 'Zero to One by Peter Thiel', brand: 'Crown Business', price: 399, category: 'business',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80',
    rating: 4.6, type: 'book', author: 'Peter Thiel', description: "Notes on startups and how to build the future."
  },
  {
    name: 'The Lean Startup by Eric Ries', brand: 'Currency', price: 449, category: 'business',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857949?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Eric Ries', description: "How entrepreneurs use continuous innovation to create successful businesses."
  },
  {
    name: 'Good to Great by Jim Collins', brand: 'Harper Business', price: 549, category: 'business',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Jim Collins', description: "Why some companies make the leap and others don't."
  },
  {
    name: 'The Psychology of Money by Morgan Housel', brand: 'Harriman House', price: 349, category: 'business',
    image: 'https://images.unsplash.com/photo-1621264448270-9ef00e88a935?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Morgan Housel', description: "Timeless lessons on wealth, greed, and happiness."
  },
  {
    name: 'Think and Grow Rich by Napoleon Hill', brand: 'Fingerprint', price: 199, category: 'business',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Napoleon Hill', description: "Lessons from 500 of America's most successful people."
  },
  {
    name: 'The Almanack of Naval Ravikant', brand: 'Magrathea Publishing', price: 399, category: 'business',
    image: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=500&q=80',
    rating: 4.8, type: 'book', author: 'Eric Jorgenson', description: "A guide to wealth and happiness from Naval Ravikant."
  },

  // ───────────── BOOKS – MYSTERY ─────────────
  {
    name: 'The Girl with the Dragon Tattoo', brand: 'Vintage Crime', price: 399, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=500&q=80',
    rating: 4.6, type: 'book', author: 'Stieg Larsson', description: "A journalist and a hacker investigate a decades-old disappearance."
  },
  {
    name: 'Gone Girl by Gillian Flynn', brand: 'Crown', price: 349, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Gillian Flynn', description: "On the day of their fifth anniversary, Amy Dunne disappears."
  },
  {
    name: 'The Da Vinci Code by Dan Brown', brand: 'Anchor', price: 299, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&q=80',
    rating: 4.4, type: 'book', author: 'Dan Brown', description: "A murder in the Louvre reveals a trail of clues through Leonardo's art."
  },
  {
    name: 'Big Little Lies by Liane Moriarty', brand: 'Berkley', price: 379, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Liane Moriarty', description: "Three women, one murder, and the explosive secrets of a picture-perfect community."
  },
  {
    name: 'In the Woods by Tana French', brand: 'Penguin', price: 349, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Tana French', description: "A detective investigates a murder linked to a childhood trauma."
  },
  {
    name: 'The Silent Patient by Alex Michaelides', brand: 'Celadon Books', price: 399, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1494947665470-20322015e3a8?w=500&q=80',
    rating: 4.6, type: 'book', author: 'Alex Michaelides', description: "A woman shoots her husband and never speaks again. A therapist is obsessed with finding out why."
  },
  {
    name: 'And Then There Were None by Agatha Christie', brand: 'HarperCollins', price: 249, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1476275466078-4cdc8b96db22?w=500&q=80',
    rating: 4.8, type: 'book', author: 'Agatha Christie', description: "Ten strangers are lured to an island and murdered one by one. Best-selling mystery novel of all time."
  },
  {
    name: 'The Thursday Murder Club by Richard Osman', brand: 'Viking', price: 349, category: 'mystery',
    image: 'https://images.unsplash.com/photo-1501975558162-0be7b8c42d17?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Richard Osman', description: "Four retired friends who solve cold cases take on a live murder."
  },

  // ───────────── BOOKS – COOKBOOKS ─────────────
  {
    name: 'Salt, Fat, Acid, Heat by Samin Nosrat', brand: 'Simon & Schuster', price: 699, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80',
    rating: 4.8, type: 'book', author: 'Samin Nosrat', description: "Master four elements and cook anything. A revolutionary approach to cooking."
  },
  {
    name: 'The Complete Indian Cookbook by Mridula Baljekar', brand: 'Hermes House', price: 549, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Mridula Baljekar', description: "Over 150 authentic Indian recipes from every region."
  },
  {
    name: "Nigella Lawson's How to Eat", brand: 'John Wiley', price: 799, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
    rating: 4.6, type: 'book', author: 'Nigella Lawson', description: "The pleasures and principles of good food. Warm, witty, and wonderfully practical."
  },
  {
    name: "Sanjeev Kapoor's Khazana of Indian Recipes", brand: 'Popular Prakashan', price: 399, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
    rating: 4.5, type: 'book', author: 'Sanjeev Kapoor', description: "A treasury of over 200 recipes from India's most beloved chef."
  },
  {
    name: 'Plenty by Yotam Ottolenghi', brand: 'Chronicle Books', price: 599, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Yotam Ottolenghi', description: "Vegetables take centre stage in bold, inventive recipes."
  },
  {
    name: "Jamie Oliver's 5 Ingredients", brand: 'Flatiron Books', price: 699, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
    rating: 4.6, type: 'book', author: 'Jamie Oliver', description: "Quick, easy and delicious dishes using only 5 ingredients."
  },
  {
    name: 'The Joy of Cooking by Irma S. Rombauer', brand: 'Scribner', price: 899, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
    rating: 4.7, type: 'book', author: 'Irma S. Rombauer', description: "America's most treasured and trusted cookbook — fully revised and updated."
  },
  {
    name: 'Masala Lab: The Science of Indian Cooking', brand: 'Penguin Viking', price: 449, category: 'cookbooks',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80',
    rating: 4.8, type: 'book', author: 'Krish Ashok', description: "A data-driven deep dive into Indian cooking — spice science and Maillard reactions."
  },

  // ───────────── JEWELRY – ACCESSORIES ─────────────
  {
    name: 'Tanishq 22KT Gold Mangalsutra', brand: 'Tanishq', price: 24999, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=500&q=80',
    rating: 4.7, type: 'jewelry', description: "Handcrafted 22KT gold mangalsutra with classic black bead pattern. Certified hallmarked gold."
  },
  {
    name: 'Malabar Gold Diamond Earrings', brand: 'Malabar Gold', price: 14999, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
    rating: 4.6, type: 'jewelry', description: "18KT white gold earrings with brilliant-cut solitaire diamonds."
  },
  {
    name: 'PC Jeweller Silver Bracelet', brand: 'PC Jeweller', price: 1799, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94b2caf?w=500&q=80',
    rating: 4.3, type: 'jewelry', description: "925 sterling silver adjustable bracelet with heart-link design. BIS hallmarked."
  },
  {
    name: 'Kalyan Jewellers Gold Bangle', brand: 'Kalyan Jewellers', price: 18999, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80',
    rating: 4.5, type: 'jewelry', description: "Traditional 22KT gold bangle with intricate floral engraving. Hallmarked & certified."
  },
  {
    name: 'Voylla Kundan Necklace Set', brand: 'Voylla', price: 999, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    rating: 4.2, type: 'jewelry', description: "Kundan-polki necklace set with matching earrings and maangtikka."
  },
  {
    name: 'Johareez Oxidised Silver Jhumkas', brand: 'Johareez', price: 499, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80',
    rating: 4.3, type: 'jewelry', description: "Antique oxidised silver jhumkas with beaded tassels. Ideal for ethnic outfits."
  },
  {
    name: 'Sukkhi Gold-Plated Choker Set', brand: 'Sukkhi', price: 799, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
    rating: 4.2, type: 'jewelry', description: "Gold-plated choker necklace with floral CZ stones and matching earrings."
  },
  {
    name: 'Giva 925 Silver Infinity Ring', brand: 'Giva', price: 1299, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    rating: 4.5, type: 'jewelry', description: "Minimalist infinity-symbol ring in 925 sterling silver with box & certificate."
  },
  {
    name: 'Pipa Bella Layered Pearl Necklace', brand: 'Pipa Bella', price: 699, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80',
    rating: 4.3, type: 'jewelry', description: "Chic layered necklace with faux pearl beads. Elegant western-style jewellery."
  },
  {
    name: 'Tribe by Amrapali Boho Cuff Bracelet', brand: 'Tribe by Amrapali', price: 1499, category: 'accessories',
    image: 'https://images.unsplash.com/photo-1586104195538-050b9f74f58e?w=500&q=80',
    rating: 4.4, type: 'jewelry', description: "Bohemian-style open cuff with turquoise stone inlay. Handcrafted tribal jewellery."
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);

  // Delete all existing products and re-insert fresh with images
  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Catalog seeded: ${products.length} products inserted with real images.`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
