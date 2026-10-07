# 🌞 Sunpowers Online Store

A complete, production-ready online store for solar energy products. Built with pure HTML5, Supabase (PostgreSQL), and Vercel for deployment.

## ✨ Features

- **Complete E-Commerce Platform**
  - Product catalog with multiple categories
  - Advanced search and filtering (by name, category, price range)
  - Shopping cart with real-time updates
  - Checkout with customer information collection

- **Payment Options**
  - UPI Payment: `Sunpowers@ybl`
  - Cash on Delivery (COD) with 15% advance payment option

- **Dynamic Slideshows**
  - Auto-rotating promotional banners
  - Configurable animation, timing, and link routing
  - Multiple slideshows support

- **Product Management**
  - Multi-section organization (Featured, Best Sellers, etc.)
  - Product images and descriptions
  - Offer pricing with original price display
  - Stock management

- **Customer Engagement**
  - Real-time customer feedback ticker
  - 5-star rating system
  - Contact form integration
  - YouTube video section

- **Admin Dashboard**
  - Full CRUD operations for products and categories
  - Real-time data synchronization
  - Order management and tracking
  - Payment settings configuration
  - Bulk operations support

- **Responsive Design**
  - Works on desktop, tablet, and mobile
  - Dark theme with glassmorphism effects
  - Smooth animations and transitions

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Real-time**: Supabase Real-time Client
- **Authentication**: Supabase Row Level Security (RLS)

## 📋 Prerequisites

1. **GitHub Account** - For repository and Vercel deployment
2. **Supabase Account** - For PostgreSQL database ([https://supabase.com](https://supabase.com))
3. **Vercel Account** - For hosting ([https://vercel.com](https://vercel.com))
4. **Custom Domain** (Optional) - For custom URL (e.g., www.sunpowers.in)

## 🚀 Setup Instructions

### Step 1: Set Up Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use existing one (Project ID: `fotmykjrqrgjnzqbdsea`)
3. Go to **SQL Editor** and create a new query
4. Copy the entire content of `supabase_schema.sql` and run it
   - This creates all 10 tables with proper relationships and Row Level Security
5. Run `sample-data.sql` to insert sample data:
   - 5 Categories (Residential, Commercial, Industrial, VFD Pumps, Batteries)
   - 10 Products with pricing and descriptions
   - 1 Main promotional slideshow
   - 5 Sections (Featured, Best Sellers, Commercial, Industrial, New Arrivals)
   - 5 Sample customer feedbacks
   - Payment settings (UPI + COD)
   - Admin settings with contact info

### Step 2: Get Supabase Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy:
   - **Project URL**: Your Supabase URL
   - **Anon Public Key**: Your publishable key
3. Update `index.html`:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL';
   const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY';
   ```

### Step 3: Push to GitHub

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/sunpowers-store-.git
cd sunpowers-store-
git add .
git commit -m "Initial commit: Sunpowers Online Store"
git push -u origin main
```

### Step 4: Deploy to Vercel

**Option A: Automatic (Recommended)**
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy" (no environment variables needed - they're in index.html)
5. Get your Vercel URL

**Option B: Vercel CLI**
```bash
npm install -g vercel
vercel
# Follow prompts to connect GitHub and deploy
```

### Step 5: Connect Custom Domain (Optional)

1. In Vercel Dashboard, go to your project settings
2. Go to **Domains**
3. Add your domain (e.g., `sunpowers.in` or `www.sunpowers.in`)
4. Follow DNS configuration instructions
5. Your custom domain will connect to Vercel (no redirect visible to users)

## 📱 Admin Dashboard Access

1. Open your deployed store
2. Look for **"Admin Mode"** button in the header
3. Click to toggle admin panel on/off
4. Available admin tabs:
   - **Settings**: Store configuration and payment options
   - **Categories**: Add/edit/delete product categories
   - **Products**: Add/edit/delete products with images
   - **Slideshows**: Configure promotional slideshows
   - **Sections**: Manage product sections and organization
   - **Orders**: View and manage customer orders

## 💳 Payment Configuration

### UPI Payment
- Default UPI ID: `Sunpowers@ybl`
- Update in Admin → Settings → Payment Settings

### Cash on Delivery (COD)
- Advance payment required: **15%** of total amount
- Remaining: **85%** paid at delivery
- Configurable in Admin → Settings → Payment Settings

## 📊 Database Schema

### Tables Created:
1. **categories** - Product categories with descriptions
2. **products** - Product details, pricing, images
3. **slideshows** - Promotional banners with animations
4. **sections** - Product groupings (Featured, Best Sellers, etc.)
5. **section_products** - Many-to-many: products in sections
6. **feedbacks** - Customer reviews and ratings
7. **orders** - Order tracking with customer details
8. **payment_settings** - UPI and COD configuration
9. **admin_settings** - Store information and contact details
10. **update_sections** - Dynamic section management

All tables have Row Level Security (RLS) enabled for public read access.

## 🔐 Security Features

- **Row Level Security (RLS)**: All tables protected with RLS policies
- **Public Read Access**: Customers can browse products and feedback
- **Admin Operations**: Create, update, delete operations available for admin
- **No API Keys Exposed**: Using Supabase's anon public key for safe frontend access
- **HTTPS Only**: All communication encrypted

## 🎨 Customization

### Colors & Theme
In `index.html`, modify `:root` CSS variables:
```css
:root {
    --primary: #ff6b35;      /* Orange */
    --secondary: #ffd700;    /* Gold */
    --dark-bg: #0f1419;      /* Dark background */
    --card-bg: #1a1f2e;      /* Card background */
    --text-light: #e0e0e0;   /* Light text */
    --text-dark: #ffffff;    /* Dark text */
    --border: #2a3142;       /* Border color */
}
```

### Store Information
Go to Admin Dashboard → Settings to update:
- Store name and logo
- Contact information
- WhatsApp number
- Email address
- YouTube links

### Product Images
- Use placeholder URLs (like `https://via.placeholder.com/300x200`)
- Or upload images to a CDN and use their URLs
- Update product entries in Supabase → products table

## 📈 Performance Optimization

- **Real-time Sync**: Uses Supabase client library for instant updates
- **Lazy Loading**: Products and sections load on demand
- **Optimized Queries**: Indexed columns for faster searches
- **CDN Delivery**: Static assets via Vercel's global CDN
- **Database Indexes**: On frequently queried columns

## 🐛 Troubleshooting

### "Connection refused" or "CORS error"
- Check Supabase project is active
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Ensure RLS policies allow public read access

### Products not showing
- Check sample data was inserted correctly
- Verify categories exist in Supabase
- Check browser console for errors (F12)

### Payment settings not updating
- Check admin mode is enabled
- Verify you have write permissions in Supabase
- Try clearing browser cache (Ctrl+Shift+Delete)

### Deployment fails on Vercel
- Check GitHub repository is public
- Verify all files pushed to GitHub
- Check Vercel logs for detailed error messages

## 📞 Support

For issues or questions:
1. Check Supabase logs: Dashboard → Logs
2. Check Vercel logs: Dashboard → Functions
3. Check browser console: F12 → Console tab
4. Review error messages in admin panel

## 📝 Database Maintenance

### Backup Data
```sql
-- Export from Supabase SQL Editor
SELECT * FROM products;
SELECT * FROM orders;
-- Use Supabase's built-in backup features
```

### Bulk Operations
1. Export data from admin panel (if available)
2. Modify in Excel
3. Import back through admin panel or SQL

## 🚀 Next Steps (Phase 2)

Future enhancements coming:
- SMS/WhatsApp integration for order updates
- Real-time OTP verification
- Google Merchant integration
- Meta AI catalog sync
- Email notifications
- Advanced analytics dashboard
- Inventory management alerts

## 📄 License

This project is built for Sunpowers Solar Solutions.

## 🔄 Version History

- **v1.0** (2026-10-07) - Initial release
  - Complete e-commerce platform
  - Admin dashboard
  - Multi-payment options
  - Real-time data sync
  - Responsive design

---

**Happy Selling! ☀️**

For questions or customization requests, contact: info@sunpowers.in
