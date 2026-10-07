# 🚀 Deployment Guide - Sunpowers Online Store

Complete step-by-step guide to deploy your solar energy e-commerce store to production.

## Quick Summary

**Time Required**: 20-30 minutes  
**Cost**: Free (Supabase free tier + Vercel free tier)  
**Result**: Live store at www.sunpowers.in (or your custom domain)

---

## Phase 1: Database Setup (Supabase)

### Step 1.1: Create/Access Supabase Project

```
Current Project Details:
- Project ID: fotmykjrqrgjnzqbdsea
- Region: Any (India recommended for lower latency)
- Database: PostgreSQL
```

**If creating new project:**
1. Visit [supabase.com/dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details (name: "Sunpowers Store")
4. Wait 2-3 minutes for project creation

### Step 1.2: Run Database Schema

1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Paste entire contents of `supabase_schema.sql`
4. Click "Run" or press Ctrl+Enter
5. Verify: Check "Tables" panel → Should show 10 tables

**Expected tables:**
- categories ✓
- products ✓
- slideshows ✓
- sections ✓
- section_products ✓
- feedbacks ✓
- orders ✓
- payment_settings ✓
- admin_settings ✓
- update_sections ✓

### Step 1.3: Insert Sample Data

1. Click "New Query" again
2. Paste entire contents of `sample-data.sql`
3. Click "Run"
4. Verify: Each INSERT should show "X row(s) affected"

**Expected results:**
- 5 categories inserted
- 10 products inserted
- 1 slideshow inserted
- 5 sections inserted
- 10 section products inserted
- 5 feedbacks inserted
- 1 payment setting inserted
- 1 admin setting inserted

### Step 1.4: Get API Credentials

1. Go to Supabase Dashboard
2. Click "Settings" (gear icon, bottom left)
3. Click "API" in left sidebar
4. Under "Project API keys":
   - Copy "Project URL" (SUPABASE_URL)
   - Copy "anon public" key (SUPABASE_KEY)

**Keep these safe - you'll need them in next phase**

---

## Phase 2: Frontend Configuration

### Step 2.1: Update index.html

1. Open `index.html` in a text editor
2. Find lines 879-880:
   ```javascript
   const SUPABASE_URL = 'https://fotmykjrqrgjnzqbdsea.supabase.co';
   const SUPABASE_KEY = 'sb_publishable_sN48EuIxQhDgS4xaalwJZA_aV-9mfLg';
   ```
3. Replace with your actual Supabase credentials from Step 1.4:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
   const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY_HERE';
   ```
4. Save the file

### Step 2.2: Test Locally (Optional)

Open `index.html` directly in a browser to test:
1. Products should load from Supabase
2. Search and filters should work
3. Add to cart should function
4. Admin mode should toggle

**If nothing loads:**
- Check browser console (F12 → Console)
- Verify Supabase credentials are correct
- Check network tab for API calls

---

## Phase 3: GitHub Setup

### Step 3.1: Push to GitHub

```bash
cd sunpowers-store
git add .
git commit -m "Initial commit: Complete Sunpowers Online Store"
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 5, done.
Counting objects: 100%...
Writing objects: 100%...
...
* [new branch]      main -> main
```

### Step 3.2: Verify on GitHub

1. Visit [github.com/Suraj4048/sunpowers-store-](https://github.com/Suraj4048/sunpowers-store-)
2. Verify files are there:
   - index.html ✓
   - supabase_schema.sql ✓
   - sample-data.sql ✓
   - README.md ✓
   - DEPLOYMENT_GUIDE.md ✓

---

## Phase 4: Vercel Deployment

### Step 4.1: Connect Vercel to GitHub

1. Visit [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose "Import from Git"
5. Select "Suraj4048/sunpowers-store-" repository
6. Click "Import"

### Step 4.2: Deploy

1. **Framework**: Select "Other" (it's HTML)
2. **Build Command**: Leave empty
3. **Output Directory**: Leave empty
4. Click "Deploy"
5. Wait 1-2 minutes for deployment

**Once deployed, you'll see:**
```
✓ Production Deployment Ready
Your project is live at: https://sunpowers-store-xxxxx.vercel.app
```

### Step 4.3: Get Your Deployment URL

1. After deployment succeeds, Vercel shows your URL
2. Format: `https://sunpowers-store-[random].vercel.app`
3. Save this URL - you'll need it for custom domain

---

## Phase 5: Custom Domain (Optional but Recommended)

### Step 5.1: Connect Custom Domain

**Your domain:** sunpowers.in

1. In Vercel Dashboard, select your project
2. Go to "Settings" → "Domains"
3. Click "Add Domain"
4. Enter: `www.sunpowers.in`
5. Click "Add"

### Step 5.2: Configure Domain Registrar

Vercel will show you DNS records to add:

**Typical records (Vercel tells you exact values):**
```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
```

**How to update in your domain registrar (e.g., GoDaddy, Namecheap):**
1. Login to your domain registrar
2. Go to DNS Settings
3. Add/Update CNAME record
4. Paste values from Vercel
5. Save changes

### Step 5.3: Verify Custom Domain

1. Wait 5-15 minutes for DNS propagation
2. Visit `https://www.sunpowers.in` in browser
3. Should load your store ✓

**Note:** Users see `www.sunpowers.in` - no "vercel" branding visible to them

---

## Phase 6: Configuration & Testing

### Step 6.1: Test Basic Functions

- [ ] Open store URL
- [ ] Products load with images
- [ ] Search works (search bar)
- [ ] Category filter works
- [ ] Price range filter works
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Cart shows correct totals

### Step 6.2: Test Checkout

- [ ] Add product to cart
- [ ] Click "Checkout"
- [ ] Enter customer details (name, phone, address)
- [ ] Select payment mode (UPI or COD)
- [ ] Complete order
- [ ] Verify order appears in admin → Orders

### Step 6.3: Test Admin Panel

- [ ] Click "Admin Mode" in header
- [ ] Go to each admin tab:
  - **Settings**: Update store name, contact info
  - **Categories**: Add new category
  - **Products**: Add new product with image URL
  - **Slideshows**: Verify promotional banner
  - **Sections**: Verify product sections
  - **Orders**: View submitted orders

### Step 6.4: Test Responsive Design

- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] All elements visible and clickable

### Step 6.5: Test Payment Options

**UPI Payment:**
- [ ] Show UPI ID: Sunpowers@ybl
- [ ] Display in checkout

**Cash on Delivery:**
- [ ] Show advance required: 15%
- [ ] Show remaining: 85%
- [ ] Collect advance payment details

---

## Phase 7: Go Live Checklist

Before announcing to customers:

### Store Content
- [ ] All product images display correctly
- [ ] Product descriptions are accurate
- [ ] Pricing is correct
- [ ] Stock levels are updated
- [ ] Categories are organized properly

### Payment Settings
- [ ] UPI ID is correct (Sunpowers@ybl)
- [ ] COD advance percentage is set (15%)
- [ ] Both payment modes enabled

### Admin Settings
- [ ] Store name: "Sunpowers Online Hub"
- [ ] Contact number: +91-9621-050-636
- [ ] Email: info@sunpowers.in
- [ ] WhatsApp: 9621050636
- [ ] Address: Updated

### Security
- [ ] HTTPS enabled ✓ (Vercel automatic)
- [ ] No sensitive data in code
- [ ] RLS policies active in Supabase

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Search responds instantly
- [ ] Cart updates smoothly
- [ ] Admin operations complete quickly

---

## Monitoring & Maintenance

### Check Performance

**Vercel Analytics:**
1. Vercel Dashboard → Analytics
2. Monitor page load times
3. Watch for errors

**Supabase Monitoring:**
1. Supabase Dashboard → Logs
2. Watch for database errors
3. Monitor API calls

### Regular Tasks

**Weekly:**
- [ ] Check for new orders
- [ ] Update product stock
- [ ] Review customer feedback

**Monthly:**
- [ ] Update promotional slideshows
- [ ] Add new products if needed
- [ ] Review analytics

**Quarterly:**
- [ ] Backup database (Supabase does this automatically)
- [ ] Review security settings
- [ ] Update contact information if needed

---

## Troubleshooting

### Issue: "Cannot connect to Supabase"
**Solution:**
1. Check SUPABASE_URL and SUPABASE_KEY in index.html
2. Verify Supabase project is active
3. Check browser console for exact error
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Products not loading"
**Solution:**
1. Check sample data was inserted
2. Verify products table has entries
3. Check RLS policies (should allow public read)
4. Check browser Network tab for API responses

### Issue: "Admin operations not working"
**Solution:**
1. Check admin mode toggle (should be enabled)
2. Verify Supabase credentials include write permissions
3. Check browser console for errors
4. Try refreshing page

### Issue: "Custom domain not working"
**Solution:**
1. Wait 15-30 minutes for DNS propagation
2. Verify DNS records added correctly in registrar
3. Check Vercel Domain settings show "Valid Configuration"
4. Try clearing browser cache

### Issue: "Checkout button not responding"
**Solution:**
1. Check all required fields filled (name, phone, address)
2. Select payment mode before checkout
3. Check browser console for validation errors
4. Try adding product again

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Help**: https://docs.github.com
- **Browser Console**: Press F12 to see detailed errors

---

## Success! 🎉

Your Sunpowers Online Store is now live!

**Next Steps:**
1. Share www.sunpowers.in with customers
2. Monitor orders and feedback
3. Add more products as needed
4. Promote on social media
5. Track analytics in Vercel

**Questions?** Contact: info@sunpowers.in

---

**Last Updated**: 2026-10-07  
**Version**: 1.0  
**Status**: ✅ Production Ready
