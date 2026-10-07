# 🏗️ Technical Architecture - Sunpowers Online Store

Complete technical documentation of the system architecture, components, and data flow.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│  (Browser: HTML5 + CSS3 + Vanilla JavaScript)                   │
│  ├─ Store Frontend (Product Browse)                             │
│  ├─ Shopping Cart & Checkout                                    │
│  └─ Admin Dashboard (CRUD Operations)                           │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/WebSocket
                 │ Supabase Client SDK (@supabase/supabase-js v2)
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    BACKEND LAYER                                 │
│  (Supabase: PostgreSQL + Real-time API)                          │
│  ├─ Database (10 Tables with RLS)                               │
│  ├─ Row Level Security (Public Read)                            │
│  ├─ Real-time Subscriptions                                     │
│  └─ Authentication & Authorization                              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                 DEPLOYMENT LAYER                                 │
│  ├─ Vercel (Static hosting + CDN)                               │
│  ├─ Custom Domain (www.sunpowers.in)                            │
│  └─ GitHub (Version control)                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

#### 1. **categories**
```sql
categories
├─ id (BIGSERIAL PRIMARY KEY)
├─ name (TEXT NOT NULL)
├─ description (TEXT)
├─ icon (TEXT)
├─ display_order (INTEGER)
└─ created_at (TIMESTAMP)

Indexes: None (fast enough for 100s of categories)
RLS Policy: Public read
```

**Sample data:**
- Residential Solar Systems
- Commercial Solar Solutions
- Industrial Solar Systems
- VFD Pumps
- Batteries & Inverters

---

#### 2. **products**
```sql
products
├─ id (BIGSERIAL PRIMARY KEY)
├─ category_id (BIGINT FOREIGN KEY → categories)
├─ name (TEXT NOT NULL)
├─ description (TEXT)
├─ price (DECIMAL 10,2)
├─ offer_price (DECIMAL 10,2)
├─ main_image (TEXT)
├─ additional_images (TEXT[])
├─ tagline (TEXT)
├─ sku (TEXT UNIQUE)
├─ stock (INTEGER)
├─ section_name (TEXT)
├─ product_link (TEXT)
├─ payment_modes (TEXT[])
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

Indexes:
  - idx_products_category (category_id)
  - idx_products_section (section_name)
RLS Policy: Public read
```

**Sample data:** 10 products with diverse pricing ($45K - $25L)

---

#### 3. **slideshows**
```sql
slideshows
├─ id (BIGSERIAL PRIMARY KEY)
├─ title (TEXT NOT NULL)
├─ position (INTEGER)
├─ slides (JSONB) [Array of slide objects]
├─ animation_type (TEXT) [e.g., 'fade']
├─ slide_duration (INTEGER) [milliseconds]
├─ ribbon_text (TEXT)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

JSONB Structure (slides):
  [{
    "image": "URL",
    "title": "Slide Title",
    "subtitle": "Subtitle",
    "link": "#target",
    "buttonText": "CTA"
  }]

RLS Policy: Public read
```

---

#### 4. **sections**
```sql
sections
├─ id (BIGSERIAL PRIMARY KEY)
├─ name (TEXT NOT NULL)
├─ title (TEXT NOT NULL)
├─ description (TEXT)
├─ display_order (INTEGER)
├─ position_index (INTEGER)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

RLS Policy: Public read
```

**Sample sections:**
- Featured Products
- Best Sellers
- Commercial Solutions
- Industrial Solutions
- New Arrivals

---

#### 5. **section_products** (Many-to-Many)
```sql
section_products
├─ id (BIGSERIAL PRIMARY KEY)
├─ section_id (BIGINT FOREIGN KEY → sections, CASCADE)
├─ product_id (BIGINT FOREIGN KEY → products, CASCADE)
├─ display_order (INTEGER)
└─ created_at (TIMESTAMP)

Indexes: idx_section_products_section
RLS Policy: Public read
```

**Purpose:** Maps products to sections for flexible organization

---

#### 6. **feedbacks**
```sql
feedbacks
├─ id (BIGSERIAL PRIMARY KEY)
├─ customer_name (TEXT NOT NULL)
├─ customer_image (TEXT)
├─ rating (INTEGER CHECK 1-5)
├─ message (TEXT NOT NULL)
├─ product_name (TEXT)
├─ verified (BOOLEAN DEFAULT FALSE)
└─ created_at (TIMESTAMP)

RLS Policy: Public read
```

---

#### 7. **orders**
```sql
orders
├─ id (BIGSERIAL PRIMARY KEY)
├─ order_number (TEXT UNIQUE)
├─ customer_name (TEXT NOT NULL)
├─ customer_email (TEXT)
├─ customer_phone (TEXT NOT NULL)
├─ address (TEXT)
├─ city (TEXT)
├─ state (TEXT)
├─ pincode (TEXT)
├─ products (JSONB) [Cart items]
├─ total_amount (DECIMAL 10,2)
├─ payment_mode (TEXT) ['upi' | 'cod']
├─ advance_paid (DECIMAL 10,2)
├─ status (TEXT) ['pending' | 'confirmed' | 'shipped' | 'delivered']
├─ notes (TEXT)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

JSONB Structure (products):
  [{
    "id": 1,
    "name": "Product Name",
    "price": 50000,
    "offer_price": 45000,
    "quantity": 2,
    "total": 90000
  }]

Indexes:
  - idx_orders_customer (customer_phone)
  - idx_orders_date (created_at)
RLS Policy: Public insert/read
```

---

#### 8. **payment_settings**
```sql
payment_settings
├─ id (BIGSERIAL PRIMARY KEY)
├─ upi_id (TEXT)
├─ upi_enabled (BOOLEAN DEFAULT TRUE)
├─ cod_enabled (BOOLEAN DEFAULT TRUE)
├─ cod_advance_percent (INTEGER DEFAULT 15)
├─ razorpay_key (TEXT)
├─ razorpay_secret (TEXT)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

RLS Policy: Public read
```

**Default:**
- UPI ID: `Sunpowers@ybl`
- COD Advance: 15%

---

#### 9. **admin_settings**
```sql
admin_settings
├─ id (BIGSERIAL PRIMARY KEY)
├─ store_name (TEXT)
├─ store_logo (TEXT)
├─ whatsapp_number (TEXT)
├─ email (TEXT)
├─ phone (TEXT)
├─ address (TEXT)
├─ youtube_links (TEXT[])
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

RLS Policy: Public read
```

---

#### 10. **update_sections**
```sql
update_sections
├─ id (BIGSERIAL PRIMARY KEY)
├─ title (TEXT NOT NULL)
├─ products (BIGINT[])
├─ display_order (INTEGER)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

RLS Policy: Public read/write
```

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with public read policies:

```sql
CREATE POLICY "Allow public read" ON <table>
FOR SELECT USING (true);
```

This allows:
- ✅ Customers to browse products
- ✅ View feedback and reviews
- ✅ Place orders
- ✅ Admin to read all data

Prevents:
- ❌ Customers from modifying products
- ❌ Unauthorized deletes
- ❌ Direct database access

---

## 🔄 Data Flow

### User Journey: Browse → Add Cart → Checkout

```
1. PAGE LOAD
   └─ index.html loads
      ├─ Supabase client initializes
      └─ loadCategories() → loadProducts() → loadSlideshows()

2. BROWSE PRODUCTS
   ├─ Display categories from categories table
   ├─ Display products from products table
   ├─ Filter by category / search / price range
   └─ Products update in real-time via Supabase

3. ADD TO CART
   ├─ Click "Add to Cart"
   ├─ Product added to local state (cartItems[])
   ├─ Cart count updates in header
   ├─ Notification shows
   └─ Data persisted in browser (localStorage)

4. CHECKOUT
   ├─ Enter customer details:
   │  ├─ Name
   │  ├─ Phone
   │  └─ Address
   ├─ Select payment mode (UPI / COD)
   ├─ Click "Place Order"
   ├─ Order record created in orders table
   ├─ CartItems cleared
   └─ Success message + Order details shown

5. POST-CHECKOUT
   └─ Admin sees order in Orders tab
      ├─ Can view customer details
      ├─ Can mark as confirmed
      └─ Can update status
```

### Admin Journey: CRUD Operations

```
1. ENABLE ADMIN MODE
   └─ Click "Admin Mode" button
      └─ Admin dashboard appears with 6 tabs

2. ADD PRODUCT
   ├─ Click "Add Product"
   ├─ Form opens with fields
   ├─ Fill details + image URL
   ├─ Click "Save"
   ├─ INSERT INTO products
   └─ Product appears in grid + store

3. EDIT PRODUCT
   ├─ Click "Edit" button on product
   ├─ Modal opens with existing data
   ├─ Modify fields
   ├─ Click "Save"
   ├─ UPDATE products SET ...
   └─ Store updates in real-time

4. DELETE PRODUCT
   ├─ Click "Delete" button
   ├─ Confirmation dialog
   ├─ Click "Confirm"
   ├─ DELETE FROM products
   └─ Product removed from store

5. SAME FOR CATEGORIES, SLIDESHOWS, SECTIONS
```

---

## 🎯 Key Components

### Frontend Architecture

```
index.html (Single file)
│
├─ CSS (880 lines)
│  ├─ Root variables (colors, spacing)
│  ├─ Layout (flexbox, grid)
│  ├─ Components (buttons, forms, cards)
│  └─ Responsive (media queries for mobile/tablet)
│
├─ HTML (400 lines)
│  ├─ Header (store name, search, cart, admin toggle)
│  ├─ Main Content Area
│  │  ├─ Slideshow section
│  │  ├─ Products grid
│  │  ├─ Feedback ticker
│  │  ├─ Contact form
│  │  └─ YouTube section
│  ├─ Cart Sidebar (fixed position, slide-in)
│  ├─ Admin Dashboard (6 tabs)
│  │  ├─ Settings
│  │  ├─ Categories
│  │  ├─ Products
│  │  ├─ Slideshows
│  │  ├─ Sections
│  │  └─ Orders
│  └─ Modal/Form containers
│
└─ JavaScript (400 lines)
   ├─ Supabase Initialization
   ├─ Data Loading Functions
   │  ├─ loadCategories()
   │  ├─ loadProducts()
   │  ├─ loadSlideshows()
   │  ├─ loadSections()
   │  └─ loadFeedbacks()
   ├─ UI Update Functions
   │  ├─ displayProducts()
   │  ├─ displaySlideshows()
   │  └─ displayFeedback()
   ├─ Cart Management
   │  ├─ addToCart()
   │  ├─ removeFromCart()
   │  └─ updateCartUI()
   ├─ Checkout
   │  └─ checkout()
   ├─ Search & Filter
   │  └─ filterProducts()
   ├─ Admin Functions
   │  ├─ toggleAdminMode()
   │  ├─ switchAdminTab()
   │  ├─ saveProduct()
   │  ├─ saveCategory()
   │  ├─ deleteProduct()
   │  └─ deleteCategory()
   ├─ Form Handling
   │  ├─ openProductModal()
   │  ├─ closeProductModal()
   │  └─ Form submissions
   └─ Event Listeners
      ├─ Search input
      ├─ Category filter
      ├─ Price range
      ├─ Button clicks
      └─ Form submissions
```

---

## 🔌 Supabase Integration

### Client Initialization
```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Query Examples

**Fetch all products:**
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false });
```

**Filter by category:**
```javascript
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId);
```

**Insert order:**
```javascript
const { data, error } = await supabase
  .from('orders')
  .insert([{
    order_number: generateOrderNumber(),
    customer_name,
    customer_phone,
    address,
    products: cartItems,
    total_amount,
    payment_mode
  }]);
```

**Real-time subscriptions (future enhancement):**
```javascript
supabase
  .from('products')
  .on('*', payload => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

---

## 📊 Deployment Architecture

### Development (Local)
```
Your Computer
└─ index.html (served by browser, file:// protocol)
   └─ Supabase (cloud database)
```

### Production (Vercel)
```
GitHub Repository
└─ Vercel (automatic deployment on push)
   ├─ Edge Network (CDN)
   ├─ Static hosting (index.html)
   └─ Custom domain (www.sunpowers.in)
      └─ Supabase (cloud database)
```

### DNS Flow
```
User visits www.sunpowers.in
└─ DNS resolution (registrar)
   └─ Points to Vercel nameservers
      └─ Vercel CDN
         └─ Serves index.html
            └─ JavaScript makes API calls to Supabase
               └─ PostgreSQL database returns data
                  └─ Data displayed in browser
```

---

## ⚡ Performance Optimization

### Frontend Optimization
- **Single file:** No HTTP overhead for multiple files
- **Lazy loading:** Products load on-demand, not all at once
- **CSS-in-HTML:** No separate CSS file request
- **JS bundled:** No external library dependencies (except Supabase SDK)
- **Caching:** Browser caches static content automatically

### Database Optimization
- **Indexes:** On frequently queried columns (category_id, section_name, customer_phone, created_at)
- **JSONB:** For flexible product and order data
- **Pagination:** Can implement cursor-based pagination for large datasets
- **Connection pooling:** Supabase handles automatically

### Network Optimization
- **CDN:** Vercel's global CDN caches content near users
- **HTTP/2:** Efficient multiplexing
- **HTTPS:** Automatic, secure communication
- **Compression:** Gzip compression on transfer

---

## 🔍 Monitoring & Analytics

### Supabase Dashboard
- View API usage
- Monitor database performance
- Check RLS policy execution
- View error logs

### Vercel Dashboard
- Monitor page load times
- Track visits and users
- View deployment history
- Check error logs

### Browser DevTools
- Network tab: API call timing and size
- Console: JavaScript errors and warnings
- Application: Local storage and cache

---

## 🛠️ Scalability Considerations

### Current Capacity
- **Databases:** PostgreSQL (Supabase free tier: 500MB storage)
- **Bandwidth:** Vercel free tier: 100GB/month
- **Database reads:** Supabase free tier: Unlimited
- **Database writes:** Supabase free tier: Unlimited

### Scaling Options

**Phase 2 (Growth):**
- Upgrade Supabase to Pro (₹2,000/month)
- Add caching layer (Redis)
- Implement pagination for large product lists

**Phase 3 (Enterprise):**
- Upgrade to Supabase Business
- Add CDN for image optimization (Cloudinary)
- Implement advanced analytics
- Add search engine (Elasticsearch)

---

## 🔐 Security Considerations

### Implemented
- ✅ HTTPS/SSL (Vercel automatic)
- ✅ Row Level Security (Supabase RLS)
- ✅ No sensitive data in frontend code
- ✅ Anon public key (safe for frontend)

### Future Enhancements
- [ ] OAuth/Social login
- [ ] Email verification
- [ ] Admin authentication
- [ ] Payment encryption
- [ ] Rate limiting
- [ ] CORS policies

---

## 📈 Growth Path

### Month 1
- Launch store
- Gather feedback
- Monitor performance

### Month 2-3
- Add more products
- Implement SMS notifications
- Add email integration

### Month 3-6
- Add payment gateway (Razorpay)
- Implement analytics
- Add inventory management

### Month 6+
- Multi-warehouse support
- Advanced reporting
- Mobile app (React Native)

---

## 📞 Support & Maintenance

### Regular Tasks
- Daily: Monitor orders
- Weekly: Check performance
- Monthly: Update content
- Quarterly: Review analytics

### Backup Strategy
- Supabase automated backups (daily)
- GitHub version control
- Customer data export (monthly)

---

**Architecture Version:** 1.0  
**Last Updated:** 2026-10-07  
**Status:** ✅ Production Ready
